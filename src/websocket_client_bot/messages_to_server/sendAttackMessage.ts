import WebSocket from 'ws';
import { UserMessageTypes } from '../../websocket_server/dto.js';
import Bot from '../bot.js';

function sendAttackMessage(bot: Bot, ws: WebSocket) {
    const messageToServer = {
        type: UserMessageTypes.attack,
        data: JSON.stringify({
            position: {
                x: <number>,
                y: <number>,
            },
            currentPlayer: bot.getPlayerId(),
            status: "miss"|"killed"|"shot",
        }),
        id: 0,
    };
    if (ws)
        ws.send(JSON.stringify(messageToServer));
    console.log(`Sending message to server from Bot:\r\n${JSON.stringify(messageToServer)}`);
}

export default sendAttackMessage;
