import DB from '../../../db/index.js';
import { UserMessage } from '../../dto.js';

function processRegMessage(userId: string, userMessage: UserMessage, db: DB) {
    db.addUserAuthData(userId, userMessage.data.name, userMessage.data.password);
}

export default processRegMessage;
