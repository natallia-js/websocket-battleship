import { httpServer } from './src/http_server/index.js';
import { startWebSocketServer } from './src/websocket_server/index.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const WSS_PORT = 3000;

console.log(`Start WebSocket server on the ${WSS_PORT} port!`);
startWebSocketServer(WSS_PORT);
