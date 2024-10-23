export interface User {
    login: string,
    password: string,
    isAlive: boolean,
    clientIP: string,
    wins: number;
}

export interface IdentifiedUser extends User {
    id: string,
}

export type GameBoard = {
    shipsPositions: any;
}

export type Room = {
    id: string,
    users: string[];
    whoseTurn: string | null,
    gameBoard: GameBoard | null;
}