import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager.js";

const wss = new WebSocketServer({ port: 8081 });

try {
  wss.on("listening", () => {
    console.log("WebSocket server started on port 8081");
  });
} catch (e) {
  console.log(e);
}

const gameManager = new GameManager();

wss.on("connection", (ws: WebSocket) => {
  ws.on("error", console.error);
  gameManager.addUser(ws);
  ws.on("close", () => gameManager.removeUser(ws));

  ws.send("vasu");
});
