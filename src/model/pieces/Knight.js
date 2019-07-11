import {ChessPiece} from "./ChessPiece";
import utils from "../ChessBoardUtils";

export class Knight extends ChessPiece {

    // interval = [-17, -15, -10, -6, 6, 10, 15, 17];

    getType() {
        return 'Knight';
    }

    legalMoves(pieceIndex, board, currentPlayer) {
        if (currentPlayer !== this.color) {
            return [];
        }
        pieceIndex = +pieceIndex;
        const legalMoves = [];
        const checkSquare = (index) => {
            if (utils.isLegalBounds(index) && !board[index]) {
                legalMoves.push(index);
            } else if (board[index] && board[index].getColor() !== this.color) {
                legalMoves.push(index);
            }
        };
        const x = pieceIndex % 8;
        if (x >= 2) { // space to the left
            checkSquare(pieceIndex + 6);
            checkSquare(pieceIndex - 10);
        }
        if (x <= 5) { // space to the right
            checkSquare(pieceIndex - 6);
            checkSquare( pieceIndex + 10);
        }
        if (x >= 1) {
            checkSquare(pieceIndex + 15);
            checkSquare(pieceIndex - 17);
        }
        if (x <= 6) {
            checkSquare(pieceIndex - 15);
            checkSquare(pieceIndex + 17);
        }
        return legalMoves;
    }
}