import WebSocket from 'ws';
import { ServerMessageTypes } from '../../dto.js';
import DB from '../../../db/index.js';

function sendUpdateWinnersMessage(userId: string, db: DB, ws: WebSocket) {
    const messageToUser = {
        type: ServerMessageTypes.update_winners,
        data: [
            {
                name: db.getUserLogin(userId),
                wins: db.getUserWins(userId),
            }
        ],
        id: 0,
    };
    ws.send(JSON.stringify(messageToUser));
}

export default sendUpdateWinnersMessage;
