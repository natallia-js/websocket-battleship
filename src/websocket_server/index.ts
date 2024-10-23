import WebSocket, { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

import DB from '../db/index.js';
import processUserMessage from './process_messages/index.js';

export const startWebSocketServer = (port: number) => {
    const webSocketServer = new WebSocketServer({
        port,
        clientTracking: true,
    });

    const db = new DB();

    webSocketServer.on('connection', (ws: WebSocket, req: IncomingMessage) => {
        const userId = db.addUser(req.socket.remoteAddress || 'unknown');
        console.log(`New client with id = ${userId} connected from ${db.getUser(userId)?.clientIP || '?'}`);
       
        ws.on('message', (data: any) => {
            db.setUserAlive(userId);
            processUserMessage(userId, data, db, ws);
        });

        ws.on('close', () => {
            console.log(`The client with id = ${userId} (at ${db.getUser(userId)?.clientIP || '?'}) has disconnected`);
        });

        ws.on('onerror', (event: WebSocket.ErrorEvent) => {
            console.log(`Error occurred: ${event.message}`);
        });
    });
};


