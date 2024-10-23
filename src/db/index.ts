import { v4 as uuidv4  } from 'uuid';
import { IdentifiedUser, Room } from './dto.js';

class DB {
    private users: IdentifiedUser[] = [];
    private rooms: Room[] = [];

    constructor() {}

    addUser(clientIP: string) {
        const userId = uuidv4();
        this.users.push({
            id: userId,
            login: '',
            password: '',
            isAlive: true,
            clientIP,
            wins: 0,
        });
        return userId;
    }

    addUserAuthData(userId: string, login: string, password: string) {
        const user = this.users.find(el => el.id === userId);
        if (user) {
            user.login = login;
            user.password = password;
        }
    }

    createRoom() {
        const roomId = uuidv4();
        this.rooms.push({
            id: roomId,
            users: [],
            whoseTurn: null,
            gameBoard: null,
        });
        return roomId;
    }

    addUserToRoom(userId: string, roomId: string) {
        const room = this.rooms.find(el => el.id === roomId);
        if (!room) return;
        if (room.users.length === 2) return;
        room.users.push(userId);
        room.whoseTurn = room.users[0];
    }

    setUserAlive(userId: string) {
        const user = this.users.find(el => el.id === userId);
        if (user)
            user.isAlive = true;
    }

    getUser(userId: string) {
        return this.users.find(el => el.id === userId);
    }

    getRoom(roomId: string) {
        return this.rooms.find(el => el.id === roomId);
    }

    getAvailableRooms() {
        return this.rooms.filter(room => room.users.length < 2);
    }

    getUserLogin(userId: string) {
        return this.users.find(el => el.id === userId)?.login || '?';
    }

    getUserWins(userId: string) {
        return this.users.find(el => el.id === userId)?.wins || 0;
    }
}

export default DB;
