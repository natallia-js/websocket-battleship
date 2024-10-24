/*(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD: import SeeBattle from "sea-battle";
        define(['sea-battle'], factory);
    } else {
        // globals: window.SeeBattle
        root.SeeBattle = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {*/

    import { Ship, ShipType } from '../db/dto.js';

    type ShipConfiguration = {
        maxShips: number,
        pointCount: number,
        type: ShipType,
    }

    class Bot {
        private userId: string = '';
        private roomId: string = '';
        private gameId: string = '';
        private playerId: string = '';

        private gameFieldBorderX = ['A','B','C','D','E','F','G','H','I','J'];
        private gameFieldBorderY = ['1','2','3','4','5','6','7','8','9','10'];
        private shipsConfiguration: ShipConfiguration[] = [
            { maxShips: 1, pointCount: 4, type: ShipType.huge },
            { maxShips: 2, pointCount: 3, type: ShipType.large },
            { maxShips: 3, pointCount: 2, type: ShipType.medium },
            { maxShips: 4, pointCount: 1, type: ShipType.small },
        ];

        private _hitsForWin = 0;

        /*this._pcShipsMap = null;
        this._userShipsMap = null;
        this._gameStopped = false;*/

        private CELL_WITH_SHIP = 1;
        private CELL_EMPTY = 0;

        constructor(userId: string = '') {
            this.userId = userId;
            for (let i = 0; i < this.shipsConfiguration.length; i++) {
                this._hitsForWin = +this._hitsForWin + (this.shipsConfiguration[i].maxShips*this.shipsConfiguration[i].pointCount);
            }
            this.generateShotMap(); 
        }

        public setUserId(value: string) {
            this.userId = value;
        }

        public getUserId() {
            return this.userId;
        }

        public setRoomId(value: string) {
            this.roomId = value;
        }

        public getRoomId() {
            return this.roomId;
        }

        public setGameId(value: string) {
            this.gameId = value;
        }

        public getGameId() {
            return this.gameId;
        }

        public setPlayerId(value: string) {
            this.playerId = value;
        }

        public getPlayerId() {
            return this.playerId;
        }

        /**
         * Возвращает id игровой ячейки, генериремого на базе координат
         * и типа игрового поля
         * @param {type} yPoint
         * @param {type} xPoint
         * @param {type} type
         * @return {String}
         */
        /*getPointBlockIdByCoords: function(yPoint, xPoint, type){
            if(type && type === 'user'){
                return 'user_x' + xPoint + '_y' + yPoint;
            }
            return 'pc_x' + xPoint + '_y' + yPoint;
        },*/

        

        public ships: Ship[] = [];
        public map: number[][] = [];
        private shotMap: { y: number, x: number }[] = [];

        /**
         * Генерирует массив содержащий информацию о том есть или нет корабля
         */
        public generateRandomShipMap() {
            //const ships: Ship[] = [];
            //const map: number[][] = [];
            // генерация карты расположения, включающей отрицательный координаты
            // для возможности размещения у границ
            for (let yPoint = -1; yPoint < (this.gameFieldBorderY.length + 1); yPoint++) {
                for (let xPoint = -1; xPoint < (this.gameFieldBorderX.length + 1); xPoint++) {
                    if (!this.map[yPoint]) {
                        this.map[yPoint] = [];
                    }
                    this.map[yPoint][xPoint] = this.CELL_EMPTY;
                }
            }
            // получение копии настроек кораблей для дальнейших манипуляций
            const shipsConfiguration = JSON.parse(JSON.stringify(this.shipsConfiguration));
            let allShipsPlaced = false;
            while (allShipsPlaced === false){
                let xPoint = this.getRandomInt(0, this.gameFieldBorderX.length);
                let yPoint = this.getRandomInt(0, this.gameFieldBorderY.length);
                if (this.isPointFree(this.map, xPoint, yPoint) === true) {
                    if (this.canPutHorizontal(this.map, xPoint, yPoint, shipsConfiguration[0].pointCount, this.gameFieldBorderX.length)) {
                        this.ships.push(new Ship({ x: yPoint, y: xPoint }, false, shipsConfiguration[0].pointCount, shipsConfiguration[0].type));
                        for (let i = 0; i < shipsConfiguration[0].pointCount; i++) {
                            this.map[yPoint][xPoint + i] = this.CELL_WITH_SHIP;
                        }
                    } else if (this.canPutVertical(this.map, xPoint, yPoint, shipsConfiguration[0].pointCount, this.gameFieldBorderY.length)) {
                        this.ships.push(new Ship({ x: yPoint, y: xPoint }, true, shipsConfiguration[0].pointCount, shipsConfiguration[0].type));
                        for (let i = 0; i < shipsConfiguration[0].pointCount; i++) {
                            this.map[yPoint + i][xPoint] = this.CELL_WITH_SHIP;
                        }
                    } else {
                        continue;
                    }
                    // обоновление настроек кораблей, если цикл не был пропущен
                    // и корабль стало быть расставлен
                    shipsConfiguration[0].maxShips--;
                    if (shipsConfiguration[0].maxShips < 1){
                        shipsConfiguration.splice(0, 1);
                    }
                    if (shipsConfiguration.length === 0){
                        allShipsPlaced = true;
                    }
                }
            }
        }

        private getRandomInt(min: number, max: number): number {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        /**
         * Проверка, возможно ли разместить тут однопалубный корабль
         */
        private isPointFree(map: number[][], xPoint: number, yPoint: number): boolean {
            // текущая и далее по часовй стрелке вокруг
            if (map[yPoint][xPoint] === this.CELL_EMPTY
                && map[yPoint-1][xPoint] === this.CELL_EMPTY
                && map[yPoint-1][xPoint+1] === this.CELL_EMPTY
                && map[yPoint][xPoint+1] === this.CELL_EMPTY
                && map[yPoint+1][xPoint+1] === this.CELL_EMPTY
                && map[yPoint+1][xPoint] === this.CELL_EMPTY
                && map[yPoint+1][xPoint-1] === this.CELL_EMPTY
                && map[yPoint][xPoint-1] === this.CELL_EMPTY
                && map[yPoint-1][xPoint-1] === this.CELL_EMPTY
            ) {
                return true;
            }
            return false;
        }

        /**
         * Возможно вставки корабля горизонтально
         */
        private canPutHorizontal(map: number[][], xPoint: number, yPoint: number, shipLength: number, coordLength: number) {
            let freePoints = 0;
            for(let x = xPoint; x < coordLength; x++) {
                // текущая и далее по часовй стрелке в гориз направл
                if(map[yPoint][x] === this.CELL_EMPTY
                    && map[yPoint-1][x] === this.CELL_EMPTY
                    && map[yPoint-1][x+1] === this.CELL_EMPTY
                    && map[yPoint][x+1] === this.CELL_EMPTY
                    && map[yPoint+1][x+1] === this.CELL_EMPTY
                    && map[yPoint+1][x] === this.CELL_EMPTY
                ) {
                    freePoints++;
                } else {
                    break;
                }
            }
            return freePoints >= shipLength;
        }

        /**
         * Возможно ли вставить корабль вертикально
         */
        private canPutVertical(map: number[][], xPoint: number, yPoint: number, shipLength: number, coordLength: number) {
            let freePoints = 0;
            for (let y = yPoint; y < coordLength; y++) {
                // текущая и далее по часовй стрелке в вертикальном направлении
                if (map[y][xPoint] === this.CELL_EMPTY
                    && map[y+1][xPoint] === this.CELL_EMPTY
                    && map[y+1][xPoint+1] === this.CELL_EMPTY
                    && map[y+1][xPoint] === this.CELL_EMPTY
                    && map[y][xPoint-1] === this.CELL_EMPTY
                    && map[y-1][xPoint-1] === this.CELL_EMPTY
                ) {
                    freePoints++;
                } else {
                    break;
                }
            }
            return freePoints >= shipLength;
        }

        /**
         * Создает масив с координатами полей, из которых компьютер
         * случайно выбирает координаты для обстрела
         */
        private generateShotMap() {
            for (let yPoint = 0; yPoint < this.gameFieldBorderY.length; yPoint++) {
                for (let xPoint = 0; xPoint < this.gameFieldBorderX.length; xPoint++) {
                    this.shotMap.push({ y: yPoint, x: xPoint });
                }
            }
        }

        /**
         * Обработчик клика по ячейке
         */
        /*userFire: function(event){
            if(this.isGameStopped() || this.isPCGoing()){
                return;
            }
            var e = event || window.event;
            var firedEl = e.target || e.srcElement;
            var x = firedEl.getAttribute('data-x');
            var y = firedEl.getAttribute('data-y');
            if(this._pcShipsMap[y][x] === this.CELL_EMPTY){
                firedEl.innerHTML = this.getFireFailTemplate();
                this.prepareToPcFire();
            }else{
                firedEl.innerHTML = this.getFireSuccessTemplate();
                firedEl.setAttribute('class', 'ship');
                this._userHits++;
                this.updateToolbar();
                if(this._userHits >= this._hitsForWin){
                    this.stopGame();
                }
            }
            firedEl.onclick = null;
        },
        _pcGoing: false,
        isPCGoing: function(){
            return this._pcGoing;
        },*/

        /**
         * Создает задержку перед ходом компьютрера
         * необходимую, для того чтобы успеть увидеть чей ход
         */
        /*prepareToPcFire: function(){
            this._pcGoing = true;
            this.updateToolbar();
            setTimeout(function(){
                this.pcFire();
            }.bind(this), this.pcDelay);
        },*/

        /**
         * Выстрел компьютера
         */
        public fire(){
            /*if(this.isGameStopped()){
                return;
            }*/
            // берется случайный выстрел из сгенерированной ранее карты
            var randomShotIndex = this.getRandomInt(0, this.shotMap.length);
            var randomShot = JSON.parse(JSON.stringify(this.shotMap[randomShotIndex]));
            // удаление чтобы не было выстрелов повторных
            this.shotMap.splice(randomShotIndex, 1);

            var firedEl = document.getElementById(this.getPointBlockIdByCoords(randomShot.y, randomShot.x, 'user'));
            if(this._userShipsMap[randomShot.y][randomShot.x] === this.CELL_EMPTY){
                firedEl.innerHTML = this.getFireFailTemplate();
            }else{
                firedEl.innerHTML = this.getFireSuccessTemplate();
                this._pcHits++;
                this.updateToolbar();
                if(this._pcHits >= this._hitsForWin){
                    this.stopGame();
                }else{
                    this.prepareToPcFire();
                }
            }
            this._pcGoing = false;
            this.updateToolbar();
        }
        /**
         * Остановка игры
         */
        /*stopGame: function(){
            this._gameStopped = true;
            this._pcGoing = false;
            this.startGameButton.innerHTML = 'Сыграть еще раз?';
            this.updateToolbar();
        },
        isGameStopped: function(){
            return this._gameStopped;
        },
        getFireSuccessTemplate: function(){
            return 'X';
        },
        getFireFailTemplate: function(){
            return '&#183;';
        },*/

        /**
         * Отображение текущей игровой ситуации в блоке
         */
        /*updateToolbar: function(){
            this.toolbar.innerHTML = 'Счет - ' + this._pcHits + ':' + this._userHits;
            if(this.isGameStopped()){
                if(this._userHits >= this._hitsForWin){
                    this.toolbar.innerHTML += ', вы победили';
                }else{
                    this.toolbar.innerHTML += ', победил ваш противник';
                }
            }else if(this.isPCGoing()){
                this.toolbar.innerHTML += ', ходит ваш противник';
            }else{
                this.toolbar.innerHTML += ', сейчас ваш ход';
            }
        },*/
    }


/*import { ShipType, Ship } from '../db/dto.js';

const ShipsParams = [
    { type: ShipType.small, count: 4, decks: 1 },
    { type: ShipType.medium, count: 3, decks: 2 },
    { type: ShipType.large, count: 2, decks: 3 },
    { type: ShipType.huge, count: 1, decks: 4 },
];

type ShipStartData = {
    x: number,
    y: number,
    shipDirection: number,
}

enum ShipDirection {
    vertical = 0,
    horizontal = 1,
}

class Bot {
    private ships: Ship[] = [];

    private getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }

    private checkLocationShip(obj: ShipStartData, decks: number): boolean {
        let { x, y, shipDirection } = obj;
        let kx, ky;
        if (shipDirection === ShipDirection.vertical) {
            kx = 0; ky = 1;
        } else {
            kx = 1; ky = 0;
        }
        let fromX: number;
        let toX: number | undefined = undefined;
        let fromY: number;
        let toY: number | undefined = undefined;
        // формируем индексы, ограничивающие двумерный массив по оси X (строки)
        // если координата 'x' равна нулю, то это значит, что палуба расположена в самой
        // верхней строке, т. е. примыкает к верхней границе и началом цикла будет строка
        // с индексом 0, в противном случае, нужно начать проверку со строки с индексом
        // на единицу меньшим, чем у исходной, т.е. находящейся выше исходной строки
        fromX = (x == 0) ? x : x - 1;
        // если условие истинно - это значит, что корабль расположен вертикально и его
        // последняя палуба примыкает к нижней границе игрового поля
        // поэтому координата 'x' последней палубы будет индексом конца цикла
        if (x + kx * decks == 10 && kx == 1)
            toX = x + kx * decks;
        // корабль расположен вертикально и между ним и нижней границей игрового поля
        // есть, как минимум, ещё одна строка, координата этой строки и будет
        // индексом конца цикла
        else if (x + kx * decks < 10 && kx == 1)
            toX = x + kx * decks + 1;
        // корабль расположен горизонтально вдоль нижней границы игрового поля
        else if (x == 9 && kx == 0)
            toX = x + 1;
        // корабль расположен горизонтально где-то по середине игрового поля
        else if (x < 9 && kx == 0)
            toX = x + 2;
        // формируем индексы начала и конца выборки по столбцам
        // принцип такой же, как и для строк
        fromY = (y == 0) ? y : y - 1;
        if (y + ky * decks == 10 && ky == 1)
            toY = y + ky * decks;
        else if (y + ky * decks < 10 && ky == 1)
            toY = y + ky * decks + 1;
        else if (y == 9 && ky == 0)
            toY = y + 1;
        else if (y < 9 && ky == 0)
            toY = y + 2;
    
        if (toX === undefined || toY === undefined)
            return false;
    
        // отфильтровываем ячейки получившегося двумерного массива, содержащие 1;
        // если такие ячейки существуют - возвращаем false
        if (this.matrix.slice(fromX, toX)
            .filter(arr => arr.slice(fromY, toY).includes(1))
            .length > 0)
            return false;
        return true;
    }

    private generateShipAttemptCount = 20;
    
    private generateShipInitialData(decks: number): ShipStartData | null {
        // 0 - вертикально, 1 - горизонтально
        let shipDirection: ShipDirection;
        let x, y: number;

        let attemptNumber = 1;
        while (attemptNumber < this.generateShipAttemptCount) {
            shipDirection = this.getRandomInt(1);
            // в зависимости от направления расположения генерируем начальные координаты
            if (shipDirection == ShipDirection.vertical) {
                x = this.getRandomInt(9);
                y = this.getRandomInt(10 - decks);
            } else {
                x = this.getRandomInt(10 - decks);
                y = this.getRandomInt(9);
            }
            const obj: ShipStartData = { x, y, shipDirection };
            // проверяем валидность координат всех палуб корабля
            const result = this.checkLocationShip(obj, decks);
            // если координаты невалидны, снова пробуем снегерировать корабль
            if (result)
                return obj;
            attemptNumber++;
        }
        return null;
    }

    public generateShips(): Ship[] {
        for (let shipsParams of ShipsParams) {
            for (let i = 0; i < shipsParams.count; i++) {
                // получаем координаты первой палубы и направление расположения палуб
                let options: ShipStartData = this.generateShipInitialData(shipsParams.decks);
                // создаём экземпляр корабля со свойствами, указанными в
                // объекте options
                this.ships.push(new Ship(
                    { x: options.x, y: options.y },
                    options.shipDirection === 0 ? false : true,
                    shipsParams.decks,
                    shipsParams.type
                ));
            }
        }
        return this.ships;
    }
}
*/
export default Bot;
