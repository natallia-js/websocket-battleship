import DB from '../../../db/index.js';
import { UserMessage } from '../../dto.js';
import { Ship } from '../../../db/dto.js';

function processAddShipsMessage(userMessage: UserMessage, db: DB) {
    const userGameData = JSON.parse(userMessage?.data) || {};
    const userShips = userGameData.ships?.map((shipData: any) => {
        //shipData.position.x = shipData.position.x - 1;
        //shipData.position.y = shipData.position.y - 1;
        return new Ship(shipData.position, shipData.direction, shipData.length, shipData.type);
    });;
    const gameId = db.addUserShips(userGameData.gameId, userGameData.indexPlayer, userShips);
    return gameId;
}

export default processAddShipsMessage;