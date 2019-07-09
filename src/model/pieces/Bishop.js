import {IntervalChessPiece} from "./ChessPiece";

export class Bishop extends IntervalChessPiece {

    getType() {
        return 'Bishop';
    }

    checkSquaresAtIntervals(checkSquares) {
        checkSquares(9);
        checkSquares(-9);
        checkSquares(7);
        checkSquares(-7);
    }

}