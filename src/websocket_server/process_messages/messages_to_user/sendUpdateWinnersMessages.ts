import { ServerMessageTypes } from '../../dto.js';
import DB from '../../../db/index.js';

function sendUpdateWinnersMessages(db: DB) {
    const users = db.getAllUsers();
    if (!users?.length) return;
    users.forEach(user => {
        const messageToUser = {
            type: ServerMessageTypes.update_winners,
            data: users.filter(user => user.isAlive).map(user => ({
                name: user.login,
                wins: user.wins,
            })),
            id: 0,
        };
        user.ws.send(JSON.stringify(messageToUser));
        console.log(`Sending message:\r\n${JSON.stringify(messageToUser)}`);
    });
}

export default sendUpdateWinnersMessages;