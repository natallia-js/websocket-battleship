import WebSocket from 'ws';
import DB from '../../../db/index.js';
import { UserMessage } from '../../dto.js';

function processRegMessage(userMessage: UserMessage, db: DB, ws: WebSocket | undefined): string | undefined {
    const userAuthData = JSON.parse(userMessage?.data) || { name: 'undefined', password: 'undefined' };
    return db.addUser(userAuthData.name, userAuthData.password, ws);
}

export default processRegMessage;
