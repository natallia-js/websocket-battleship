function processAttackMessage(userMessage, db) {
    const userMessageData = JSON.parse(userMessage?.data) || {};
    const gameId = userMessageData.gameId;
    const playerId = userMessageData.indexPlayer;
    const position = {
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
//# sourceMappingURL=processAttackMessage.js.map