import WebSocket, { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import DB from '../db/index.js';
import processUserMessage from './process_messages/index.js';
import sendDiconnectMessage from './process_messages/messages_to_user/sendDiconnectMessage.js';
import sendUpdateRoomMessages from './process_messages/messages_to_user/sendUpdateRoomMessages.js';
import sendUpdateWinnersMessages from './process_messages/messages_to_user/sendUpdateWinnersMessages.js';
import { UserWSData } from './dto.js';

export const startWebSocketServer = (port: number) => {
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

    webSocketServer.on('connection', (ws: WebSocket , req: IncomingMessage) => {
        const userWSData = new UserWSData(req.socket.remoteAddress, '');
        console.log(`New client connected from ${userWSData.getClientIP()}`);
        console.log(`Total number of clients is ${webSocketServer.clients.size}`);
       
        ws.on('message', (data: any) => {
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

        ws.on('onerror', (event: WebSocket.ErrorEvent) => {
            console.log(`Error occurred: ${event.message}`);
        });
    });
};


