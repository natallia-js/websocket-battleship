function processAddUserToRoomMessage(userId, userMessage, db) {
    const userMessageData = JSON.parse(userMessage?.data) || {};
    const roomId = userMessageData.indexRoom;
    db.addUserToRoom(userId, roomId);
    return roomId;
}
export default processAddUserToRoomMessage;
//# sourceMappingURL=processAddUserToRoomMessage.js.map