export var ShipType;
(function (ShipType) {
    ShipType["small"] = "small";
    ShipType["medium"] = "medium";
    ShipType["large"] = "large";
    ShipType["huge"] = "huge";
})(ShipType || (ShipType = {}));
export var AttackStatus;
(function (AttackStatus) {
    AttackStatus["miss"] = "miss";
    AttackStatus["killed"] = "killed";
    AttackStatus["shot"] = "shot";
})(AttackStatus || (AttackStatus = {}));
export class Ship {
    position;
    direction;
    length;
    type;
    injuredPositions;
    constructor(position, direction, length, type) {
        this.position = position;
        this.direction = direction;
        this.length = length;
        this.type = type;
        this.injuredPositions = [];
    }
    attack(position) {
        if (this.direction) {
            if (position.x === this.position.x &&
                this.position.y <= position.y &&
                position.y <= this.position.y + this.length - 1) {
                this.addPointToInjuredPositions(position);
            }
            else
                return AttackStatus.miss;
        }
        else {
            if (position.y === this.position.y &&
                this.position.x <= position.x &&
                position.x <= this.position.x + this.length - 1) {
                this.addPointToInjuredPositions(position);
            }
            else
                return AttackStatus.miss;
        }
        return this.isDead() ? AttackStatus.killed : AttackStatus.shot;
    }
    addPointToInjuredPositions(point) {
        if (!this.injuredPositions.find(pos => pos.x === point.x && pos.y === point.y))
            this.injuredPositions.push(point);
    }
    isDead() {
        return this.length === this.injuredPositions.length;
    }
    getShipType() {
        return this.type;
    }
}
export class GameBoard {
    ships;
    constructor() {
        this.ships = [];
    }
    addShips(ships) {
        this.ships = ships || [];
    }
    getShipsNumber() {
        return this.ships.length;
    }
    getShips() {
        return this.ships;
    }
    attack(position) {
        let attackStatus = AttackStatus.miss;
        for (let ship of this.ships) {
            attackStatus = ship.attack(position);
            if (attackStatus !== AttackStatus.miss)
                break;
        }
        return attackStatus;
    }
    ifAllShipsAreDead() {
        return !this.ships.find(ship => !ship.isDead());
    }
}
//# sourceMappingURL=dto.js.map