import { ServerMessageTypes } from '../../dto.js';
function sendStartGameMessages(gameId, db) {
    const game = db.getGame(gameId);
    if (!game)
        return;
    if (game.users.find(user => !user.gameBoard.getShipsNumber()))
        return;
    game.users.forEach(user => {
        const messageToUser = {
            type: ServerMessageTypes.start_game,
            data: JSON.stringify({
                ships: user.gameBoard.getShips(),
                currentPlayerIndex: user.userGameId,
            }),
            id: 0,
        };
        if (user.ws)
            user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}
export default sendStartGameMessages;
//# sourceMappingURL=sendStartGameMessages.js.map