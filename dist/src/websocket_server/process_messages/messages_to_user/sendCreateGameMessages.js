import { ServerMessageTypes } from '../../dto.js';
function sendCreateGameMessages(roomId, db) {
    const game = db.createGame(roomId);
    if (!game)
        return;
    game.users.forEach(user => {
        const messageToUser = {
            type: ServerMessageTypes.create_game,
            data: {
                idGame: game.id,
                idPlayer: user.userGameId,
            },
            id: 0,
        };
        if (user.ws)
            user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}
export default sendCreateGameMessages;
//# sourceMappingURL=sendCreateGameMessages.js.map