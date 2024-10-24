import { v4 as uuidv4 } from 'uuid';
import { GameBoard, AttackStatus } from './dto.js';
import Lock from '../lock.js';
class DB {
    users = [];
    rooms = [];
    lock = new Lock();
    constructor() { }
    addUser(login, password, ws) {
        this.lock.acquire();
        try {
            const userWithTheSameLogin = this.users.find(user => user.login === login);
            if (userWithTheSameLogin) {
                if (userWithTheSameLogin.isAlive || userWithTheSameLogin.password !== password)
                    return undefined;
                userWithTheSameLogin.isAlive = true;
                userWithTheSameLogin.ws = ws;
                userWithTheSameLogin.lastRequestDateTime = new Date();
                return userWithTheSameLogin.id;
            }
            const userId = uuidv4();
            this.users.push({
                id: userId,
                login,
                password,
                isAlive: true,
                lastRequestDateTime: new Date(),
                wins: 0,
                ws,
            });
            return userId;
        }
        finally {
            this.lock.release();
        }
    }
    createRoom() {
        const roomId = uuidv4();
        this.rooms.push({
            id: roomId,
            users: [],
            game: null,
        });
        return roomId;
    }
    addUserToRoom(userId, roomId) {
        const room = this.rooms.find(el => el.id === roomId);
        if (!room)
            return;
        const user = this.getUser(userId);
        if (!user)
            return;
        if (room.users.length === 2)
            return;
        if (room.users.find(user => user.id === userId))
            return;
        room.users.push(user);
    }
    createGame(roomId) {
        const room = this.rooms.find(room => room.id === roomId);
        if (!room)
            return null;
        if (room.users.length < 2)
            return null;
        const usersInGame = room.users.map(user => {
            return {
                ...user,
                userGameId: uuidv4(),
                gameBoard: new GameBoard(),
            };
        });
        const game = {
            id: uuidv4(),
            users: usersInGame,
            currentPlayer: usersInGame[0],
            winner: undefined,
        };
        room.game = game;
        return game;
    }
    setUserAlive(userId) {
        const user = this.users.find(el => el.id === userId);
        if (user) {
            user.isAlive = true;
            user.lastRequestDateTime = new Date();
        }
    }
    setUserDisconnected(userId) {
        const user = this.users.find(el => el.id === userId);
        if (!user)
            return;
        user.isAlive = false;
        const userActiveRoomIndex = this.rooms.findIndex(room => room.users.find(el => el.id === userId));
        if (userActiveRoomIndex === -1)
            return;
        this.rooms[userActiveRoomIndex].users = this.rooms[userActiveRoomIndex].users.filter(el => el.id !== userId);
        if (!this.rooms[userActiveRoomIndex].users.length) {
            this.rooms.splice(userActiveRoomIndex, 1);
        }
        else {
            const game = this.rooms[userActiveRoomIndex].game;
            if (game) {
                const gameWinner = game.users.find(el => el.id !== userId);
                if (gameWinner)
                    this.setGameWinner(game, gameWinner);
                this.rooms[userActiveRoomIndex].game = null;
            }
        }
    }
    getUser(userId) {
        return this.users.find(el => el.id === userId);
    }
    getAllUsers() {
        return this.users;
    }
    getRoom(roomId) {
        return this.rooms.find(el => el.id === roomId);
    }
    getUserLogin(userId) {
        return this.users.find(el => el.id === userId)?.login || '?';
    }
    getAllAvailableRooms() {
        return this.rooms.filter(room => room.users.length < 2);
    }
    getGame(gameId) {
        return this.rooms.find(room => room.game?.id === gameId)?.game;
    }
    getUserGame(userId) {
        return this.rooms.find(room => room.game?.users.find(el => el.id === userId))?.game;
    }
    addUserShips(gameId, playerId, ships) {
        const room = this.rooms.find(room => room.game?.id === gameId);
        if (!room)
            return null;
        const gameUser = room.game?.users.find(user => user.userGameId === playerId);
        if (!gameUser)
            return null;
        gameUser.gameBoard.addShips(ships);
        return gameId;
    }
    setGameWinner(game, gameUser) {
        game.winner = gameUser;
        const user = this.users.find(user => user.id === gameUser.id);
        if (user)
            user.wins += 1;
    }
    attack(gameId, currentPlayerId, position) {
        const game = this.rooms.find(room => room?.game?.id === gameId)?.game;
        if (!game)
            return null;
        if (game.currentPlayer?.userGameId !== currentPlayerId)
            return null;
        const gameUser = game.users.find(user => user.userGameId === currentPlayerId);
        if (!gameUser)
            return null;
        const nextGameUser = game.users.find(user => user.userGameId !== currentPlayerId);
        if (!nextGameUser)
            return null;
        const attackStatus = nextGameUser.gameBoard.attack(position);
        if (attackStatus === AttackStatus.killed) {
            if (nextGameUser?.gameBoard.ifAllShipsAreDead())
                this.setGameWinner(game, gameUser);
        }
        if (!game.winner)
            game.currentPlayer = nextGameUser;
        return {
            attackStatus,
            gameOver: game.winner ? true : false,
        };
    }
    deleteNonAliveUsers(lastAliveDate) {
        this.lock.acquire();
        try {
            for (let i = 0; i < this.users.length; i++) {
                const user = this.users[i];
                if (!user.isAlive && user.lastRequestDateTime <= lastAliveDate)
                    this.users.splice(i, 1);
            }
        }
        finally {
            this.lock.release();
        }
    }
}
export default DB;
//# sourceMappingURL=index.js.map