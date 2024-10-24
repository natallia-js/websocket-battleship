"use strict";
class Bot {
    gameFieldBorderX = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    gameFieldBorderY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    shipsConfiguration = [
        { maxShips: 1, pointCount: 4 },
        { maxShips: 2, pointCount: 3 },
        { maxShips: 3, pointCount: 2 },
        { maxShips: 4, pointCount: 1 }
    ];
    _hitsForWin = 0;
    CELL_WITH_SHIP = 1;
    CELL_EMPTY = 0;
    constructor() {
        for (let i = 0; i < this.shipsConfiguration.length; i++) {
            this._hitsForWin = +this._hitsForWin + (this.shipsConfiguration[i].maxShips * this.shipsConfiguration[i].pointCount);
        }
    }
    generateRandomShipMap() {
        const map = [];
        for (let yPoint = -1; yPoint < (this.gameFieldBorderY.length + 1); yPoint++) {
            for (let xPoint = -1; xPoint < (this.gameFieldBorderX.length + 1); xPoint++) {
                if (!map[yPoint]) {
                    map[yPoint] = [];
                }
                map[yPoint][xPoint] = this.CELL_EMPTY;
            }
        }
        const shipsConfiguration = JSON.parse(JSON.stringify(this.shipsConfiguration));
        let allShipsPlaced = false;
        while (allShipsPlaced === false) {
            var xPoint = this.getRandomInt(0, this.gameFieldBorderX.length);
            var yPoint = this.getRandomInt(0, this.gameFieldBorderY.length);
            if (this.isPointFree(map, xPoint, yPoint) === true) {
                if (this.canPutHorizontal(map, xPoint, yPoint, shipsConfiguration[0].pointCount, this.gameFieldBorderX.length)) {
                    for (let i = 0; i < shipsConfiguration[0].pointCount; i++) {
                        map[yPoint][xPoint + i] = this.CELL_WITH_SHIP;
                    }
                }
                else if (this.canPutVertical(map, xPoint, yPoint, shipsConfiguration[0].pointCount, this.gameFieldBorderY.length)) {
                    for (let i = 0; i < shipsConfiguration[0].pointCount; i++) {
                        map[yPoint + i][xPoint] = this.CELL_WITH_SHIP;
                    }
                }
                else {
                    continue;
                }
                shipsConfiguration[0].maxShips--;
                if (shipsConfiguration[0].maxShips < 1) {
                    shipsConfiguration.splice(0, 1);
                }
                if (shipsConfiguration.length === 0) {
                    allShipsPlaced = true;
                }
            }
        }
        return map;
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    isPointFree(map, xPoint, yPoint) {
        if (map[yPoint][xPoint] === this.CELL_EMPTY
            && map[yPoint - 1][xPoint] === this.CELL_EMPTY
            && map[yPoint - 1][xPoint + 1] === this.CELL_EMPTY
            && map[yPoint][xPoint + 1] === this.CELL_EMPTY
            && map[yPoint + 1][xPoint + 1] === this.CELL_EMPTY
            && map[yPoint + 1][xPoint] === this.CELL_EMPTY
            && map[yPoint + 1][xPoint - 1] === this.CELL_EMPTY
            && map[yPoint][xPoint - 1] === this.CELL_EMPTY
            && map[yPoint - 1][xPoint - 1] === this.CELL_EMPTY) {
            return true;
        }
        return false;
    }
    canPutHorizontal(map, xPoint, yPoint, shipLength, coordLength) {
        let freePoints = 0;
        for (let x = xPoint; x < coordLength; x++) {
            if (map[yPoint][x] === this.CELL_EMPTY
                && map[yPoint - 1][x] === this.CELL_EMPTY
                && map[yPoint - 1][x + 1] === this.CELL_EMPTY
                && map[yPoint][x + 1] === this.CELL_EMPTY
                && map[yPoint + 1][x + 1] === this.CELL_EMPTY
                && map[yPoint + 1][x] === this.CELL_EMPTY) {
                freePoints++;
            }
            else {
                break;
            }
        }
        return freePoints >= shipLength;
    }
    canPutVertical(map, xPoint, yPoint, shipLength, coordLength) {
        let freePoints = 0;
        for (let y = yPoint; y < coordLength; y++) {
            if (map[y][xPoint] === this.CELL_EMPTY
                && map[y + 1][xPoint] === this.CELL_EMPTY
                && map[y + 1][xPoint + 1] === this.CELL_EMPTY
                && map[y + 1][xPoint] === this.CELL_EMPTY
                && map[y][xPoint - 1] === this.CELL_EMPTY
                && map[y - 1][xPoint - 1] === this.CELL_EMPTY) {
                freePoints++;
            }
            else {
                break;
            }
        }
        return freePoints >= shipLength;
    }
}
;
return SeeBattle;
;
//# sourceMappingURL=bot.js.map