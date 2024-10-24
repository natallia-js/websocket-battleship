import { ServerMessage } from '../../websocket_server/dto.js';
import Bot from '../bot.js';

function processTurnMessage(bot: Bot, message: ServerMessage) {
    const serverMessageData = message?.data;
    const currentPlayer = serverMessageData.currentPlayer;
    if (currentPlayer === bot.getPlayerId()) {
        //
    }
}

export default processTurnMessage;
