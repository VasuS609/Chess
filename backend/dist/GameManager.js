import { Game } from "./Game.js";
import { INIT_GAME, MOVE } from "./messages.js";
export class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            let message;
            try {
                message = JSON.parse(data.toString());
            }
            catch (_a) {
                return;
            }
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === MOVE) {
                const game = this.games.find(g => g.player1 === socket || g.player2 === socket);
                if (game && message.move !== undefined) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
