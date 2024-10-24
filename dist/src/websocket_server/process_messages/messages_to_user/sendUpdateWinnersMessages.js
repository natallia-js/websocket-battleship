import { ServerMessageTypes } from '../../dto.js';
function sendUpdateWinnersMessages(db) {
    const users = db.getAllUsers();
    if (!users?.length)
        return;
    users.forEach(user => {
        const messageToUser = {
            type: ServerMessageTypes.update_winners,
            data: users.map(user => ({
                name: user.login,
                wins: user.wins,
            })),
            id: 0,
        };
        if (user.ws)
            user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}
export default sendUpdateWinnersMessages;
//# sourceMappingURL=sendUpdateWinnersMessages.js.map