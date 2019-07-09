import ChessModel from "../ChessModel";
import {ChessPiece} from "./ChessPiece";

export class King extends ChessPiece {
    getType() {
        return 'King';
    }

    legalMoves(pieceIndex, board, currentPlayer) {
        if (this.color !== currentPlayer) {
            return [];
        }
        pieceIndex = +pieceIndex;
        const x = pieceIndex % 8;
        const legalMoves = [];
        const checkSquare = (index) => {
            if (ChessModel._isLegalBounds(index)) {
                if (!board[index] || board[index].getColor() !== this.color) {
                    legalMoves.push(index);
                }
            }
        };
        if (x >= 1) { // there is space to the left of this piece
            checkSquare(pieceIndex - 1);
            if (pieceIndex >= 9) { // upper left
                checkSquare(pieceIndex - 9);
            } // lower left
            if (pieceIndex <= 55) {
                checkSquare(pieceIndex + 7)
            }
        }
        if (x <= 6) { // there is space to the right of this piece
            checkSquare(pieceIndex + 1);
            if (pieceIndex <= 54) {
                checkSquare(pieceIndex + 9);
            }
            if (pieceIndex >= 8) {
                checkSquare(pieceIndex - 7);
            }
        }
        if (pieceIndex >= 8) {
            checkSquare(pieceIndex - 8);
        }
        if (pieceIndex <= 55) {
            checkSquare(pieceIndex + 8);
        }
        return legalMoves;
    }
}