function processRegMessage(userMessage, db, ws) {
    const userAuthData = JSON.parse(userMessage?.data) || { name: 'undefined', password: 'undefined' };
    return db.addUser(userAuthData.name, userAuthData.password, ws);
}
export default processRegMessage;
//# sourceMappingURL=processRegMessage.js.map