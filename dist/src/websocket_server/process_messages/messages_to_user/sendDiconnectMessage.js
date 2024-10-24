import { ServerMessageTypes } from '../../dto.js';
function sendDiconnectMessage(disconnectedUserId, db) {
    const game = db.getUserGame(disconnectedUserId);
    if (!game)
        return;
    game.users.forEach(user => {
        if (user.id === disconnectedUserId)
            return;
        const messageToUser = {
            type: ServerMessageTypes.diconnect,
            id: 0,
        };
        if (user.ws)
            user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}
export default sendDiconnectMessage;
//# sourceMappingURL=sendDiconnectMessage.js.map