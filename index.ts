import { httpServer } from './src/http_server/index.js';
import { startWebSocketServer } from './src/websocket_server/index.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on port ${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);

const WSS_PORT = 3000;

console.log(`Start WebSocket server on port ${WSS_PORT}`);
startWebSocketServer(WSS_PORT);
