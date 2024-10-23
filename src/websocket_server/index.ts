import WebSocket, { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import DB from '../db/index.js';
import processUserMessage from './process_messages/index.js';
import sendDiconnectMessage from './process_messages/messages_to_user/sendDiconnectMessage.js';
import sendUpdateRoomMessages from './process_messages/messages_to_user/sendUpdateRoomMessages.js';
import sendUpdateWinnersMessages from './process_messages/messages_to_user/sendUpdateWinnersMessages.js';

export const startWebSocketServer = (port: number) => {
    const webSocketServer = new WebSocketServer({
        port,
        clientTracking: true,
    });

    const db = new DB();

    setInterval(() => {
        const minutes = 1;
        db.deleteNonAliveUsers(new Date((new Date()).getTime() - minutes * 60000));
    }, 10000);

    webSocketServer.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        const userId = db.addUser(req.socket.remoteAddress || 'unknown', ws);
        console.log(`New client with id = ${userId} connected from ${db.getUser(userId)?.clientIP || '?'}`);
        console.log(`Total number of clients is ${webSocketServer.clients.size}`);
       
        ws.on('message', (data: any) => {
            db.setUserAlive(userId);
            processUserMessage(userId, data, db, ws);
        });

        ws.on('close', () => {
            sendDiconnectMessage(userId, db);
            db.setUserDisconnected(userId);
            sendUpdateRoomMessages(db);
            sendUpdateWinnersMessages(db);
            console.log(`The client with id = ${userId} (at ${db.getUser(userId)?.clientIP || '?'}) has disconnected`);
        });

        ws.on('onerror', (event: WebSocket.ErrorEvent) => {
            console.log(`Error occurred: ${event.message}`);
        });
    });
};


