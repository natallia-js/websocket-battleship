function processCreateRoomMessage(userId, db) {
    const roomId = db.createRoom();
    db.addUserToRoom(userId, roomId);
    return roomId;
}
export default processCreateRoomMessage;
//# sourceMappingURL=processCreateRoomMessage.js.map