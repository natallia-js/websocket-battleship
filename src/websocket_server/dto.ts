export enum UserMessageTypes {
    reg = 'reg',
    add_user_to_room = 'add_user_to_room',
    create_room = 'create_room',   
}

export enum ServerMessageTypes {
    // personal response
    reg = 'reg',

    // responses for the game room
    create_game = 'create_game',
    start_game = 'start_game',
    turn = 'turn',
    attack = 'attack',
    finish = 'finish',

    // responses for all
    update_room = 'update_room',
    update_winners = 'update_winners',
}

export type UserMessage = {
    type: string;
    data: any;
    id: number;
}
