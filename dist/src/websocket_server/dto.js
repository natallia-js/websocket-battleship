export var UserMessageTypes;
(function (UserMessageTypes) {
    UserMessageTypes["reg"] = "reg";
    UserMessageTypes["add_user_to_room"] = "add_user_to_room";
    UserMessageTypes["create_room"] = "create_room";
    UserMessageTypes["add_ships"] = "add_ships";
    UserMessageTypes["attack"] = "attack";
    UserMessageTypes["randomAttack"] = "randomAttack";
})(UserMessageTypes || (UserMessageTypes = {}));
export var ServerMessageTypes;
(function (ServerMessageTypes) {
    ServerMessageTypes["reg"] = "reg";
    ServerMessageTypes["create_game"] = "create_game";
    ServerMessageTypes["start_game"] = "start_game";
    ServerMessageTypes["turn"] = "turn";
    ServerMessageTypes["attack"] = "attack";
    ServerMessageTypes["finish"] = "finish";
    ServerMessageTypes["diconnect"] = "diconnect";
    ServerMessageTypes["update_room"] = "update_room";
    ServerMessageTypes["update_winners"] = "update_winners";
})(ServerMessageTypes || (ServerMessageTypes = {}));
export class UserWSData {
    clientIP;
    userId;
    constructor(clientIP, userId) {
        this.setClientIP(clientIP);
        this.setUserID(userId);
    }
    setClientIP(clientIP) {
        this.clientIP = clientIP || '?';
    }
    setUserID(userId) {
        this.userId = userId || '';
    }
    getClientIP() {
        return this.clientIP;
    }
    getUserID() {
        return this.userId;
    }
}
//# sourceMappingURL=dto.js.map