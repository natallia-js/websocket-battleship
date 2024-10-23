import DB from '../../../db/index.js';
import { UserMessage } from '../../dto.js';

function processAddUserToRoomMessage(userId: string, userMessage: UserMessage, db: DB) {
    const userMessageData = JSON.parse(userMessage?.data) || {};
    const roomId = userMessageData.indexRoom;
    db.addUserToRoom(userId, roomId);
    return roomId;
}

export default processAddUserToRoomMessage;
