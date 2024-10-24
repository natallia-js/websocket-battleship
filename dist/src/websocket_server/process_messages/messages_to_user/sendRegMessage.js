import { ServerMessageTypes } from '../../dto.js';
function sendRegMessage(userId, db, ws) {
    const userName = db.getUserLogin(userId);
    const messageToUser = {
        type: ServerMessageTypes.reg,
        data: {
            name: userName,
            index: userName,
            error: false,
            errorText: '',
        },
        id: 0,
    };
    if (ws)
        ws.send(JSON.stringify(messageToUser));
    console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
}
export default sendRegMessage;
//# sourceMappingURL=sendRegMessage.js.map