import WebSocket from 'ws';
import { ServerMessageTypes } from '../../dto.js';
import DB from '../../../db/index.js';

function sendUpdateRoomMessage(roomId: string, db: DB, ws: WebSocket) {
    const room = db.getRoom(roomId);
    const messageToUser = {
        type: ServerMessageTypes.update_room,
        data: [
            {
                roomId,
                roomUsers: room?.users.map(el => {
                    const userName = db.getUserLogin(el);
                    if (!userName) return null;
                    return {
                        name: userName,
                        index: userName,
                    };
                }).map(el => el),
            },
        ],
        id: 0,
    };
    ws.send(JSON.stringify(messageToUser));
}

export default sendUpdateRoomMessage;
