import { ServerMessageTypes } from '../../dto.js';
function sendUpdateRoomMessages(db) {
    const rooms = db.getAllAvailableRooms();
    if (!rooms?.length)
        return;
    const users = db.getAllUsers();
    if (!users?.length)
        return;
    rooms.forEach(room => {
        const messageToUser = {
            type: ServerMessageTypes.update_room,
            data: [
                {
                    roomId: room.id,
                    roomUsers: room.users
                        .map(user => ({
                        name: user.login,
                        index: user.login,
                    })),
                },
            ],
            id: 0,
        };
        users.forEach(user => { if (user.ws)
            user.ws.send(JSON.stringify(messageToUser)); });
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}
export default sendUpdateRoomMessages;
//# sourceMappingURL=sendUpdateRoomMessages.js.map