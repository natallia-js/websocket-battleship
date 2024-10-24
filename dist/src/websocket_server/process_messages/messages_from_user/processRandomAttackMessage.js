import { UserMessageTypes } from '../../dto.js';
import processAttackMessage from './processAttackMessage.js';
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function processRandomAttackMessage(userMessage, db) {
    const userMessageData = JSON.parse(userMessage?.data) || {};
    const gameId = userMessageData.gameId;
    const playerId = userMessageData.indexPlayer;
    const randomX = getRandomInt(10);
    const randomY = getRandomInt(10);
    const message = {
        type: UserMessageTypes.attack,
        data: JSON.stringify({
            gameId,
            x: randomX,
            y: randomY,
            indexPlayer: playerId,
        }),
        id: 0,
    };
    return processAttackMessage(message, db);
}
export default processRandomAttackMessage;
//# sourceMappingURL=processRandomAttackMessage.js.map