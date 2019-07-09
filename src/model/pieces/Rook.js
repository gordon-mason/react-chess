import {IntervalChessPiece} from "./ChessPiece";

export class Rook extends IntervalChessPiece {
    getType() {
        return 'Rook';
    }

    checkSquaresAtIntervals(checkSquares) {
        checkSquares(8);
        checkSquares(-8);
        checkSquares(1);
        checkSquares(-1);
    }
}