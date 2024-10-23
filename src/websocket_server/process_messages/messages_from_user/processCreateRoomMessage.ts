import DB from '../../../db/index.js';

function processCreateRoomMessage(userId: string, db: DB) {
    const roomId = db.createRoom();
    db.addUserToRoom(userId, roomId);
    return roomId;
}

export default processCreateRoomMessage;
