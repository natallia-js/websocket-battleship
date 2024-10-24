import { ServerMessage } from '../../websocket_server/dto.js';
import Bot from '../bot.js';

function processUpdateRoomMessage(bot: Bot, message: ServerMessage) {
    const serverMessageData = message?.data;
    const roomId = serverMessageData[0].roomId;
    if (bot && !bot.getRoomId()) {
        bot?.setRoomId(roomId);
    }
}

export default processUpdateRoomMessage;
