import {IntervalChessPiece} from "./ChessPiece";
import {QUEEN} from "../constants";

export class Queen extends IntervalChessPiece {

    getType() {
        return QUEEN;
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