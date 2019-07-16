import {IntervalChessPiece} from "./ChessPiece";
import {ROOK} from "../constants";

export class Rook extends IntervalChessPiece {
    getType() {
        return ROOK;
    }

    checkSquaresAtIntervals(checkSquares) {
        checkSquares(8);
        checkSquares(-8);
        checkSquares(1);
        checkSquares(-1);
    }
}