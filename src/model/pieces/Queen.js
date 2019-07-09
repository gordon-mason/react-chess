import {IntervalChessPiece} from "./ChessPiece";

export class Queen extends IntervalChessPiece {

    getType() {
        return 'Queen';
    }

    checkSquaresAtIntervals(checkSquares) {
        checkSquares(8);
        checkSquares(-8);
        checkSquares(1);
        checkSquares(-1);
        checkSquares(9);
        checkSquares(-9);
        checkSquares(7);
        checkSquares(-7);
    }
}