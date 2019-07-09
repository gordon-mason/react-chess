import ChessModel from "../ChessModel";

export const BLACK = 'Black';
export const WHITE = 'White';
export const PAWN = 'Pawn';
export const KING = 'King';
export const QUEEN = 'Queen';
export const BISHOP = 'Bishop';
export const KNIGHT = 'Knight';
export const ROOK = 'Rook';

export class ChessPiece {

    color;

    constructor(color) {
        this.color = color;
    }

    /**
     * returns a list of legal moves given the coords & board state - taking into account the direction for color
     * */
    legalMoves(pieceIndex, board, currentPlayer) {
        throw Error('legalMove not defined');
    }

    /* eg 'Pawn', 'Knight'...*/
    getType() {
        throw Error('Type of piece not defined');
    }

    getColor() {
        return this.color;
    }
}

/*
* A class for pieces that move any number of steps in a straight line or diagonally across the chess board.
* */
export class IntervalChessPiece extends ChessPiece {


    leftMoves = [-9, -1, 7];
    rightMoves = [9, 1, -7];

    /**
     * Fixed template method - subclasses should define behaviour in checkSquaresAtIntervals
     * @param pieceIndex
     * @param board
     * @param currentPlayer
     * @returns {Array}
     */
    legalMoves(pieceIndex, board, currentPlayer) {
        if (currentPlayer !== this.color) {
            return [];
        }
        pieceIndex = +pieceIndex;
        const legalMoves = [];
        const checkSquares = (step) => {
            let limit;
            if (step % 8 === 0) {
                limit = 8;
            } else if (this.leftMoves.includes(step)) {
                limit = pieceIndex % 8 + 1;
            } else if (this.rightMoves.includes(step)) {
                limit = 8 - pieceIndex % 8;
            } else {
                throw new Error('invalid value given to checkSquares - argument must be one of: -9, -8, -7, -1, 1, 7, 8, 9');
            }
            for (let n = 1; n < limit; n++) {
                let nextStep = pieceIndex + (step * n);
                if (ChessModel._isLegalBounds(nextStep) && !board[nextStep]) {
                    legalMoves.push(nextStep);
                } else {
                    if (ChessModel._isLegalBounds(nextStep) && board[nextStep] && board[nextStep].getColor() !== this.color) {
                        legalMoves.push(nextStep);
                    }
                    break;
                }
            }
        };
        this.checkSquaresAtIntervals(checkSquares);
        return legalMoves;
    }

    /**
     * Variable template method which must be defined by subclasses.
     * @param checkSquares a function which takes a single argument indicating the direction of steps to take on the board
     * 1 is to the right
     * -1 is to the left
     * 8 is top to bottom
     * -8 is bottom to top
     * 7 is diagonal top to bottom left
     * etc
     */
    checkSquaresAtIntervals(checkSquares) {
        throw new Error('checkSquaresAtIntervals should be defined by subclasses of IntervalChessPiece');
    }
}