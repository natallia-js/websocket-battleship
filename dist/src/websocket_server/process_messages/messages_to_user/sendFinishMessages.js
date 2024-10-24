import { ServerMessageTypes } from '../../dto.js';
function sendFinishMessages(gameId, db) {
    const game = db.getGame(gameId);
    if (!game)
        return;
    game.users.forEach(user => {
        const messageToUser = {
            type: ServerMessageTypes.finish,
            data: {
                winPlayer: game.winner?.userGameId,
            },
            id: 0,
        };
        if (user.ws)
            user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}
export default sendFinishMessages;
//# sourceMappingURL=sendFinishMessages.js.map