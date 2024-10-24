import { ServerMessageTypes } from '../../dto.js';
function sendAttackMessages(gameId, playerId, position, status, db) {
    const game = db.getGame(gameId);
    if (!game)
        return;
    game.users.forEach(user => {
        const messageToUser = {
            type: ServerMessageTypes.attack,
            data: JSON.stringify({
                position,
                currentPlayer: playerId,
                status,
            }),
            id: 0,
        };
        if (user.ws)
            user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}
export default sendAttackMessages;
//# sourceMappingURL=sendAttackMessages.js.map