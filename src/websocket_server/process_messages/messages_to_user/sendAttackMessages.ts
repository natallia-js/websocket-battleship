import { ServerMessageTypes } from '../../dto.js';
import DB from 'src/db/index.js';
import { Position, AttackStatus } from 'src/db/dto.js';

function sendAttackMessages(gameId: string, playerId: string, position: Position, status: AttackStatus, db: DB) {
    const game = db.getGame(gameId);
    if (!game) return;
    game.users.forEach(user => {
        const messageToUser = {
            type: ServerMessageTypes.attack,
            data: JSON.stringify({
                position,
                currentPlayer: playerId, // player that made a shot
                status,
            }),
            id: 0,
        };
        user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}

export default sendAttackMessages;
