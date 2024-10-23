import WebSocket from 'ws';
import { UserMessageTypes, UserMessage } from '../dto.js';
import DB from '../../db/index.js';
import processRegMessage from './messages_from_user/processRegMessage.js';
import sendRegMessage from './messages_to_user/sendRegMessage.js';
import sendUpdateWinnersMessages from './messages_to_user/sendUpdateWinnersMessages.js';
import sendUpdateRoomMessages from './messages_to_user/sendUpdateRoomMessages.js';
import processCreateRoomMessage from './messages_from_user/processCreateRoomMessage.js';
import processAddUserToRoomMessage from './messages_from_user/processAddUserToRoomMessage.js';
import sendCreateGameMessages from './messages_to_user/sendCreateGameMessages.js';
import processAddShipsMessage from './messages_from_user/processAddShipsMessage.js';
import sendStartGameMessages from './messages_to_user/sendStartGameMessages.js';
import processAttackMessage from './messages_from_user/processAttackMessage.js';
import sendTurnMessages from './messages_to_user/sendTurnMessages.js';
import sendFinishMessages from './messages_to_user/sendFinishMessages.js';
import sendAttackMessages from './messages_to_user/sendAttackMessages.js';
import processRandomAttackMessage from './messages_from_user/processRandomAttackMessage.js';

function processAttackResult(processAttackMessageResult: any, db: DB) {
    if (!processAttackMessageResult)
        return;
    sendAttackMessages(
        processAttackMessageResult.gameId,
        processAttackMessageResult.playerId, // player that made a shot
        processAttackMessageResult.position,
        processAttackMessageResult.attackStatus,
        db
    );
    if (!processAttackMessageResult.gameOver) {
        sendTurnMessages(processAttackMessageResult.gameId, db);
    } else {
        sendFinishMessages(processAttackMessageResult.gameId, db);
        sendUpdateWinnersMessages(db);
    }
}

function processUserMessage(userId: string, data: any, db: DB, ws: WebSocket) {
    const userMessage: UserMessage = JSON.parse(data.toString());
    console.log(`Received command \x1b[31m${userMessage.type}\x1b[0m`);
    switch(userMessage.type) {
        case UserMessageTypes.reg:
            processRegMessage(userId, userMessage, db);
            sendRegMessage(userId, db, ws);
            sendUpdateRoomMessages(db);
            sendUpdateWinnersMessages(db);
            break;
        case UserMessageTypes.create_room:
            processCreateRoomMessage(userId, db);
            sendUpdateRoomMessages(db);
            break;
        case UserMessageTypes.add_user_to_room:
            const roomId = processAddUserToRoomMessage(userId, userMessage, db);
            sendUpdateRoomMessages(db);
            sendCreateGameMessages(roomId, db);
            break;
        case UserMessageTypes.add_ships:
            const gameId = processAddShipsMessage(userMessage, db);
            if (!gameId)
                return;
            sendStartGameMessages(gameId, db);
            sendTurnMessages(gameId, db);
            break;
        case UserMessageTypes.attack:
            const processAttackMessageResult = processAttackMessage(userMessage, db);
            processAttackResult(processAttackMessageResult, db);
            break;
        case UserMessageTypes.randomAttack:
            const processRandomAttackMessageResult = processRandomAttackMessage(userMessage, db);
            processAttackResult(processRandomAttackMessageResult, db);
            break;
        default:
            console.log(`Unknown user message type: ${userMessage.type}`);
            break;
    }
}

export default processUserMessage;
