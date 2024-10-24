import WebSocket from 'ws';
import { UserMessageTypes } from '../../websocket_server/dto.js';

function sendRegMessage(ws: WebSocket) {
    const messageToServer = {
        type: UserMessageTypes.reg,
        data: JSON.stringify({
            name: 'bot',
            index: 'bot',
        }),
        id: 0,
    };
    if (ws)
        ws.send(JSON.stringify(messageToServer));
    console.log(`Sending message to server from Bot:\r\n${JSON.stringify(messageToServer)}`);
}

export default sendRegMessage;
