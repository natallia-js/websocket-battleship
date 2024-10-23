import DB from '../../../db/index.js';
import { UserMessage } from '../../dto.js';

function processRegMessage(userId: string, userMessage: UserMessage, db: DB) {
    const userAuthData = JSON.parse(userMessage?.data) || { name: 'undefined', password: 'undefined' };
    db.addUserAuthData(userId, userAuthData.name, userAuthData.password);
}

export default processRegMessage;
