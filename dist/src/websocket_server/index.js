import { WebSocketServer } from 'ws';
import DB from '../db/index.js';
import processUserMessage from './process_messages/index.js';
import sendDiconnectMessage from './process_messages/messages_to_user/sendDiconnectMessage.js';
import sendUpdateRoomMessages from './process_messages/messages_to_user/sendUpdateRoomMessages.js';
import sendUpdateWinnersMessages from './process_messages/messages_to_user/sendUpdateWinnersMessages.js';
import { UserWSData } from './dto.js';
export const startWebSocketServer = (port) => {
    const webSocketServer = new WebSocketServer({
        port,
        clientTracking: true,
    });
    const db = new DB();
    setInterval(() => {
        const minutes = 1;
        db.deleteNonAliveUsers(new Date((new Date()).getTime() - minutes * 60000));
        sendUpdateWinnersMessages(db);
    }, 10000);
    webSocketServer.on('connection', (ws, req) => {
        const userWSData = new UserWSData(req.socket.remoteAddress, '');
        console.log(`New client connected from ${userWSData.getClientIP()}`);
        console.log(`Total number of clients is ${webSocketServer.clients.size}`);
        ws.on('message', (data) => {
            processUserMessage(userWSData, data, db, ws);
            db.setUserAlive(userWSData.getUserID());
        });
        ws.on('close', () => {
            sendDiconnectMessage(userWSData.getUserID(), db);
            db.setUserDisconnected(userWSData.getUserID());
            sendUpdateRoomMessages(db);
            sendUpdateWinnersMessages(db);
            console.log(`The client at ${userWSData.getUserID()} has disconnected`);
        });
        ws.on('onerror', (event) => {
            console.log(`Error occurred: ${event.message}`);
        });
    });
};
//# sourceMappingURL=index.js.map