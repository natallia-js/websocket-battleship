import DB from '../../../db/index.js';
import { UserMessage } from '../../dto.js';

function processAddUserToRoomMessage(userId: string, userMessage: UserMessage, db: DB) {
    const roomId = userMessage?.data?.indexRoom;
    db.addUserToRoom(userId, roomId);
}

export default processAddUserToRoomMessage;
