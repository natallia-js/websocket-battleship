import WebSocket from 'ws';
import processServerMessage from './processServerMessage.js';
import sendRegMessage from './messages_to_server/sendRegMessage.js';
import Bot from './bot.js';

let socket: WebSocket | null;
let reopen = true;
let bot: Bot = new Bot();

// playerId - the id of the real player to play with
export function startBotWebsocket(playerId: string) {
    socket = new WebSocket('ws://localhost:3000');
    reopen = true;

    socket.onopen = function() {
        console.log('Bot successfully created');
        if (socket)
            sendRegMessage(socket);
    };
    
    socket.onclose = function() {
        socket = null;
        if (reopen)
            setTimeout(() => startBotWebsocket(playerId), 5000);
    };

    socket.onmessage = function(event) {
        console.log(`Bot received data: ${event.data}`);
        if (socket)
            processServerMessage(event.data, socket, bot);
    };

    socket.onerror = function(error) {
        console.log(`Bot socket error: ${error.message}`);
    };
}

export function closeBotWebsocket() {
    reopen = false;
    socket?.close();
}
