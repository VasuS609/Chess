import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager.js";
const wss = new WebSocketServer({ port: 8081 });
try {
    wss.on("listening", () => {
        console.log("WebSocket server started on port 8081");
    });
}
catch (e) {
    console.log(e);
}
const gameManager = new GameManager();
wss.on("connection", (ws) => {
    ws.on("error", console.error);
    // Register the user with the game manager on connect
    gameManager.addUser(ws);
    // Remove user when the socket closes
    ws.on("close", () => gameManager.removeUser(ws));
    ws.send("vasu");
});
