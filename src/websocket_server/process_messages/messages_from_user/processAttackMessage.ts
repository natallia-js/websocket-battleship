import DB from '../../../db/index.js';
import { UserMessage } from '../../dto.js';
import { Position } from 'src/db/dto.js';

function processAttackMessage(userMessage: UserMessage, db: DB) {
    const userMessageData = JSON.parse(userMessage?.data) || {};
    const gameId = userMessageData.gameId;
    const playerId = userMessageData.indexPlayer;
    const position: Position = {
        x: userMessageData.x,
        y: userMessageData.y,
    };
    const attackResult = db.attack(gameId, playerId, position);
    if (!attackResult)
        return null;
    return {
        gameId: userMessageData.gameId,
        playerId: userMessageData.indexPlayer,
        position,
        attackStatus: attackResult.attackStatus,
        gameOver: attackResult.gameOver,
    };
}

export default processAttackMessage;
