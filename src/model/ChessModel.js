import {King} from "./pieces/King";
import {BLACK, KING, WHITE} from "./pieces/ChessPiece";
import {Pawn} from "./pieces/Pawn";
import {Rook} from "./pieces/Rook";
import {Knight} from "./pieces/Knight";
import {Bishop} from "./pieces/Bishop";
import {Queen} from "./pieces/Queen";

export default class ChessModel {

    board;
    piecesStolen;
    player;
    check;
    checkmate;

    /* Todo :
    *   refactor this class
    *   change type of pawns on reaching home row */
    constructor({board, player, piecesStolen, check, checkmate}) {
        if (!board) {
            this._init();
        } else {
            this.board = Object.assign({}, board);
            this.player = player;
            this.piecesStolen = Array.from(piecesStolen);
            this.check = check === true;
            this.checkmate = checkmate === true;
        }
    }

    _init() {
        this.player = WHITE;
        this.board = {};
        for (let i = 0; i < 8; i++) {
            this.board[i + 8] = new Pawn(BLACK);
            this.board[i + 48] = new Pawn(WHITE);
        }
        this.board[0] = new Rook(BLACK);
        this.board[1] = new Knight(BLACK);
        this.board[2] = new Bishop(BLACK);
        this.board[3] = new Queen(BLACK);
        this.board[4] = new King(BLACK);
        this.board[5] = new Bishop(BLACK);
        this.board[6] = new Knight(BLACK);
        this.board[7] = new Rook(BLACK);
        this.board[56] = new Rook(WHITE);
        this.board[57] = new Knight(WHITE);
        this.board[58] = new Bishop(WHITE);
        this.board[59] = new Queen(WHITE);
        this.board[60] = new King(WHITE);
        this.board[61] = new Bishop(WHITE);
        this.board[62] = new Knight(WHITE);
        this.board[63] = new Rook(WHITE);
        this.check = false;
        this.checkmate = false;
        this.piecesStolen = [];
    }

    static _isLegalMove({from, to}, board, player) {
        if (ChessModel._isLegalBounds(from) && ChessModel._isLegalBounds(to)) {
            if (board[from] && board[from].getColor() === player) {
                if (board[from].legalMoves(from, board, player).includes(to)) {
                    return true;
                }
            }
        }
        return false;
    }

    static _isLegalBounds(index) {
        return (index >= 0 && index <= 63);
    }

    getTypeOfPieceAt(index) {
        if (this.board[index]) {
            return this.board[index].getType();
        } else {
            return '';
        }
    }

    getColorOfPieceAt(index) {
        if (this.board[index]) {
            return this.board[index].getColor();
        } else {
            return '';
        }
    }

    getAvailableMoves(index) {
        const piece = this.board[index];
        if (piece) {
            return piece.legalMoves(index, this.board, this.player);
        } else {
            return [];
        }
    }

    getTakenPieces() {
        return (this.piecesStolen).slice();
    }

    getCurrentPlayer() {
        return this.player;
    }

    isCheckmate() {
        return this.checkmate;
    }

    isCheck() {
        return this.check;
    }

    /**
     * @param {{from, to}} move
     * @returns {ChessModel} clone after the move has been made.
     * A clone of the current state is returned from invalid moves.
     */
    nextState(move) {
        let board, player, piecesStolen, check, checkmate;
        const reset = () => {
            board = Object.assign({}, this.board);
            player = this.player;
            piecesStolen = this.piecesStolen.slice();
            check = this.check;
            checkmate = this.checkmate;
        };
        reset();

        if (move && ChessModel._isLegalMove(move, this.board, this.player)) {
            this._makeMove(board, move, piecesStolen);
            player = player === WHITE ? BLACK : WHITE;
            // TODO handle stalemate
            const result = this._checkForCheck(board);
            check = result.check;
            if (check) {
                for (let c of result.details) {
                    // if the attempted move would result in check, or fail to protect the king from check it is illegal
                    if (c.checkMove === player) {
                        reset();
                        break;
                    }
                }
                checkmate = this._checkForCheckMate(board, player);
            }
        }
        return new ChessModel({board, player, piecesStolen, check, checkmate});
    }

    _makeMove(board, move, piecesStolen) {
        if (board[move.to]) {
            piecesStolen.push(board[move.to]);
        }
        board[move.to] = board[move.from];
        delete board[move.from];
    }


    /**
     *
     * @param board
     * @param player
     * @returns {{details: Array, check: boolean}}
     * @private
     */
    _checkForCheck(board, player) {
        let check = false;
        const details = [];
        // iterate through the pieces on the board
        for (let piece of Object.keys(board)) {
            // iterate through its legal moves
            if (board[piece].getColor() === player || player === undefined) {
                for (let target of board[piece].legalMoves(piece, board, board[piece].getColor())) {
                    // if this piece can take the opposite players king, we have check
                    if (board[target] && board[target].getType() === KING && board[target].getColor() !== board[piece].getColor()) {
                        check = true;
                        details.push({
                            checkMove: board[piece].getColor(),
                            piece: board[piece].getType(),
                            index: piece,
                        });
                    }
                }
            }
        }
        return {check, details};
    }

    _checkForCheckMate(board, defendingPlayer) {
        console.log('checking for checkmate ' + defendingPlayer);
        for (let piece of Object.keys(board)) {
            // iterate through its legal moves
            if (board[piece].getColor() === defendingPlayer) {
                for (let target of board[piece].legalMoves(piece, board, board[piece].getColor())) {
                    // at this point the player is in a check situation
                    // if all of these moves are still in a check situation then we are checkmate.
                    const boardCopy = Object.assign({}, board);
                    this._makeMove(boardCopy, {from: piece, to: target}, []);
                    if (!this._checkForCheck(boardCopy, defendingPlayer === WHITE ? BLACK : WHITE).check) {
                        return false;
                    }
                }
            }
        }
        console.log('checkmate!');
        return true;


    }
}

