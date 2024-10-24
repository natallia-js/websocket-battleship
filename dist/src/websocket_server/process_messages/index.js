import { UserMessageTypes } from '../dto.js';
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
import { Bot } from '../bot.js';
function processAttackResult(processAttackMessageResult, db) {
    if (!processAttackMessageResult)
        return;
    sendAttackMessages(processAttackMessageResult.gameId, processAttackMessageResult.playerId, processAttackMessageResult.position, processAttackMessageResult.attackStatus, db);
    if (!processAttackMessageResult.gameOver) {
        sendTurnMessages(processAttackMessageResult.gameId, db);
    }
    else {
        sendFinishMessages(processAttackMessageResult.gameId, db);
        sendUpdateWinnersMessages(db);
    }
}
function processUserMessage(userWSData, data, db, ws) {
    const userMessage = JSON.parse(data.toString());
    console.log(`Received command \x1b[33m${userMessage.type}\x1b[0m from user at ${userWSData.getClientIP()} (id = ${userWSData.getUserID()})`);
    switch (userMessage.type) {
        case UserMessageTypes.reg:
            const userId = processRegMessage(userMessage, db, ws);
            if (!userId)
                return;
            userWSData.setUserID(userId);
            sendRegMessage(userId, db, ws);
            sendUpdateRoomMessages(db);
            sendUpdateWinnersMessages(db);
            break;
        case UserMessageTypes.create_room:
            processCreateRoomMessage(userWSData.getUserID(), db);
            sendUpdateRoomMessages(db);
            break;
        case UserMessageTypes.add_user_to_room:
            const roomId = processAddUserToRoomMessage(userWSData.getUserID(), userMessage, db);
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
        case 'single_play':
            const map = new Bot().generateRandomShipMap;
            console.log(map);
            const botId = processRegMessage({
                type: 'single_play',
                data: JSON.stringify({ name: 'bot', password: 'bot' }),
                id: 0,
            }, db, undefined);
            if (!botId)
                return;
            const singlePlayRoomId = processCreateRoomMessage(botId, db);
            processAddUserToRoomMessage(userWSData.getUserID(), {
                type: UserMessageTypes.add_user_to_room,
                data: JSON.stringify({ indexRoom: singlePlayRoomId }),
                id: 0,
            }, db);
            sendUpdateRoomMessages(db);
            sendUpdateWinnersMessages(db);
            sendCreateGameMessages(singlePlayRoomId, db);
            break;
        default:
            console.log(`Unknown user message type: \x1b[31m${userMessage.type}\x1b[0m`);
            break;
    }
}
export default processUserMessage;
//# sourceMappingURL=index.js.map