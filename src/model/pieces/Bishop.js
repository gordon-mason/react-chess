import {IntervalChessPiece} from "./ChessPiece";
import {BISHOP} from "../constants";

export class Bishop extends IntervalChessPiece {

    getType() {
        return BISHOP;
    }

    checkSquaresAtIntervals(checkSquares) {
        checkSquares(9);
        checkSquares(-9);
        checkSquares(7);
        checkSquares(-7);
    }

}