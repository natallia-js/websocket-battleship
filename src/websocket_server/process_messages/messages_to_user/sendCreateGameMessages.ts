import { ServerMessageTypes } from '../../dto.js';
import DB from '../../../db/index.js';

function sendCreateGameMessages(roomId: string, db: DB) {
    const game = db.createGame(roomId);
    if (!game) return;
    game.users.forEach(user => {
        const messageToUser = {
            type: ServerMessageTypes.create_game,
            data: {
                idGame: game.id,
                idPlayer: user.userGameId,
            },
            id: 0,
        };
        user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}

export default sendCreateGameMessages;
