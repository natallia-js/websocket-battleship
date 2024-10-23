import WebSocket from 'ws';
import { ServerMessageTypes } from '../../dto.js';
import DB from '../../../db/index.js';

function sendCreateGameMessage(userId: string, db: DB, ws: WebSocket) {
    const messageToUser = {
        type: ServerMessageTypes.create_game,
        data: {
            idGame: ,
            idPlayer: ,
        },
        id: 0,
    };
    ws.send(JSON.stringify(messageToUser));
}

export default sendCreateGameMessage;
