import WebSocket from 'ws';
import { ServerMessageTypes } from '../../dto.js';
import DB from '../../../db/index.js';

function sendRegMessage(userId: string, db: DB, ws: WebSocket) {
    const userName = db.getUserLogin(userId);
    const messageToUser = {
        type: ServerMessageTypes.reg,
        data: {
            name: userName,
            index: userName,
            error: false,
            errorText: '',
        },
        id: 0,
    };
    ws.send(JSON.stringify(messageToUser));
    console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
}

export default sendRegMessage;
