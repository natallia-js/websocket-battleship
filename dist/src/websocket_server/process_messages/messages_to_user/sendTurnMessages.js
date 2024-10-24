import { ServerMessageTypes } from '../../dto.js';
function sendTurnMessages(gameId, db) {
    const game = db.getGame(gameId);
    if (!game)
        return;
    game.users.forEach(user => {
        const messageToUser = {
            type: ServerMessageTypes.turn,
            data: JSON.stringify({
                currentPlayer: game.currentPlayer?.userGameId,
            }),
            id: 0,
        };
        if (user.ws)
            user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}
export default sendTurnMessages;
//# sourceMappingURL=sendTurnMessages.js.map