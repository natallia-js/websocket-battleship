import { Ship } from '../../../db/dto.js';
function processAddShipsMessage(userMessage, db) {
    const userGameData = JSON.parse(userMessage?.data) || {};
    const userShips = userGameData.ships?.map((shipData) => {
        return new Ship(shipData.position, shipData.direction, shipData.length, shipData.type);
    });
    const gameId = db.addUserShips(userGameData.gameId, userGameData.indexPlayer, userShips);
    return gameId;
}
export default processAddShipsMessage;
//# sourceMappingURL=processAddShipsMessage.js.map