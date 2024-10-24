import WebSocket from 'ws';
import { ServerMessage, ServerMessageTypes} from '../websocket_server/dto.js';
import sendAddUserToRoomMessage from './messages_to_server/sendAddUserToRoomMessage.js';
import processUpdateRoomMessage from './messages_from_server/processUpdateRoomMessage.js';
import sendAddShipsMessage from './messages_to_server/sendAddShipsMessage.js';
import processCreateGameMessage from './messages_from_server/processCreateGameMessage.js';
import Bot from './bot.js';

function processServerMessage(serverMessage: any, socket: WebSocket, bot: Bot | null) {
    if (!serverMessage) return;
    const messageObject: ServerMessage = JSON.parse(serverMessage);
    switch (messageObject.type) {
        case ServerMessageTypes.reg:
            bot?.setUserId(messageObject.data.index); // messageData.index - bot id
            break;
        case ServerMessageTypes.update_room:
            if (!bot) break;
            processUpdateRoomMessage(bot, messageObject);
            sendAddUserToRoomMessage(bot, socket);
            break;
        case ServerMessageTypes.create_game:
            if (!bot) break;
            processCreateGameMessage(bot, messageObject);
            bot.generateRandomShipMap();
            sendAddShipsMessage(bot, socket);
            break;
        default:
            break;
    }
}

export default processServerMessage;
