import { Chess } from "chess.js";
import { GAME_OVER } from "./messages.js";
export class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
    }
    makeMove(socket, move) {
        // ensure correct player's turn
        const moveCount = this.moves.length;
        if (moveCount % 2 === 0 && socket !== this.player1)
            return;
        if (moveCount % 2 === 1 && socket !== this.player2)
            return;
        try {
            this.board.move(move);
            this.moves.push(`${move.from}-${move.to}`);
        }
        catch (e) {
            console.log("Invalid move:", e);
            return;
        }
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            const payload = JSON.stringify({ type: GAME_OVER, payload: { winner } });
            this.player1.send(payload);
            this.player2.send(payload);
            return;
        }
        const nextMovePayload = JSON.stringify({ type: "move", payload: move });
        if (moveCount % 2 === 0)
            this.player2.send(nextMovePayload);
        else
            this.player1.send(nextMovePayload);
    }
}
