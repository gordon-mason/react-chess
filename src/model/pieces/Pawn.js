import {BLACK, ChessPiece, WHITE} from "./ChessPiece";

export class Pawn extends ChessPiece {

    isOnHomeRow(pieceIndex) {
        return (this.color === WHITE && pieceIndex > 47 && pieceIndex < 56) ||
            (this.color === BLACK && pieceIndex > 7 && pieceIndex < 16);
    }

    getType() {
        return 'Pawn';
    }

    legalMoves(pieceIndex, board, currentPlayer) {
        if (currentPlayer !== this.color) {
            return [];
        }
        let i;
        if (this.color === WHITE) {
            i = -1;
        } else {
            i = 1;
        }
        pieceIndex = +pieceIndex;
        const legalMoves = [];
        const stepForward = i * 8;
        /* One Step */
        if (!board[pieceIndex + stepForward]) {
            legalMoves.push(pieceIndex + stepForward);
            /* First Move - 2 steps */
            if (this.isOnHomeRow(pieceIndex)) {
                if (!board[pieceIndex + stepForward * 2]) {
                    legalMoves.push(pieceIndex + stepForward * 2);
                }
            }
        }

        /* Diagonals - take pieces*/
        if (pieceIndex % 8 !== 0) {  // not on left edge
            const piece = board[pieceIndex + stepForward - 1];
            if (piece && piece.getColor() !== this.color) {
                legalMoves.push(pieceIndex + stepForward - 1);
            }
        }
        if (pieceIndex % 8 !== 7) { // not on right edge
            const piece = board[pieceIndex + stepForward + 1];
            if (piece && piece.getColor() !== this.color) {
                legalMoves.push(pieceIndex + stepForward + 1);
            }
        }
        return legalMoves;
    }
}