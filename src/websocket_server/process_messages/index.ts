import WebSocket from 'ws';
import { UserMessageTypes, UserMessage } from '../dto.js';
import DB from '../../db/index.js';
import processRegMessage from './messages_from_user/processRegMessage.js';
import sendRegMessage from './messages_to_user/sendRegMessage.js';
import sendUpdateWinnersMessage from './messages_to_user/sendUpdateWinnersMessage.js';
import sendUpdateRoomMessage from './messages_to_user/sendUpdateRoomMessage.js';
import processCreateRoomMessage from './messages_from_user/processCreateRoomMessage.js';
import processAddUserToRoomMessage from './messages_from_user/processAddUserToRoomMessage.js';

function processUserMessage(userId: string, data: any, db: DB, ws: WebSocket) {
    const userMessage: UserMessage = JSON.parse(data.toString());
    switch(userMessage.type) {
        // Player
        case UserMessageTypes.reg:
            processRegMessage(userId, userMessage, db);
            sendRegMessage(userId, db, ws);
            sendUpdateWinnersMessage(userId, db, ws);
            break;
        case UserMessageTypes.create_room:
            const roomId = processCreateRoomMessage(userId, db);
            sendUpdateRoomMessage(roomId, db, ws);
            break;
        case UserMessageTypes.add_user_to_room:
            processAddUserToRoomMessage(userId, userMessage, db);
            break;
        default:
            console.log(`Unknown user message type: ${userMessage.type}`);
            break;
    }
}

export default processUserMessage;
