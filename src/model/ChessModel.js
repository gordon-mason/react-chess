import {BISHOP, BLACK, KING, KNIGHT, PAWN, QUEEN, ROOK, WHITE} from "./pieces/ChessPiece";
import {makePiece} from "./pieces/PieceFactory";

export default class ChessModel {

    board;
    piecesStolen;
    player;
    check;
    checkmate;
    stalemate;
    pawnHomeRow;

    /* Todo :
    *   refactor this class */
    constructor({board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate}) {
        if (!board) {
            this._init();
        } else {
            this.board = Object.assign({}, board);
            this.player = player;
            this.piecesStolen = Array.from(piecesStolen);
            this.check = check === true;
            this.checkmate = checkmate === true;
            this.stalemate = stalemate === true;
            this.pawnHomeRow = pawnHomeRow ? Object.assign(pawnHomeRow) : false;
        }
    }

    _init() {
        this.player = WHITE;
        this.board = {};
        for (let i = 0; i < 8; i++) {
            this.board[i + 8] = makePiece(PAWN, BLACK);
            this.board[i + 48] = makePiece(PAWN, WHITE);
        }
        this.board[8] = makePiece(PAWN, WHITE); /* FIXME REMOVE AFTER TESTING*/

        this.board[0] = makePiece(ROOK, BLACK);
        this.board[1] = makePiece(KNIGHT, BLACK);
        this.board[2] = makePiece(BISHOP, BLACK);
        this.board[3] = makePiece(QUEEN, BLACK);
        this.board[4] = makePiece(KING, BLACK);
        this.board[5] = makePiece(BISHOP, BLACK);
        this.board[6] = makePiece(KNIGHT, BLACK);
        this.board[7] = makePiece(ROOK, BLACK);
        this.board[56] = makePiece(ROOK, WHITE);
        this.board[57] = makePiece(KNIGHT, WHITE);
        this.board[58] = makePiece(BISHOP, WHITE);
        this.board[59] = makePiece(QUEEN, WHITE);
        this.board[60] = makePiece(KING, WHITE);
        this.board[61] = makePiece(BISHOP, WHITE);
        this.board[62] = makePiece(KNIGHT, WHITE);
        this.board[63] = makePiece(ROOK, WHITE);
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

    getPawnHomeRow() {
        return this.pawnHomeRow ? Object.assign({}, this.pawnHomeRow) : false;
    }


    nextStateAfterPromotion(type) {
        let board, player, piecesStolen, check, checkmate, pawnHomeRow;
        const reset = () => {
            board = Object.assign({}, this.board);
            player = this.player;
            piecesStolen = this.piecesStolen.slice();
            check = this.check;
            checkmate = this.checkmate;
            pawnHomeRow = this.getPawnHomeRow();
        };
        reset();
        if (this.pawnHomeRow) {
            board[this.pawnHomeRow.index] = makePiece(type, board[this.pawnHomeRow.index].getColor());
            pawnHomeRow = false;
        }

        return new ChessModel({board, player, piecesStolen, check, checkmate, pawnHomeRow});
    }

    /**
     * @param {{from, to}} move
     * @returns {ChessModel} clone after the move has been made.
     * A clone of the current state is returned from invalid moves.
     */
    nextState(move) {
        let board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate;
        const reset = () => {
            board = Object.assign({}, this.board);
            player = this.player;
            piecesStolen = this.piecesStolen.slice();
            check = this.check;
            checkmate = this.checkmate;
            pawnHomeRow = this.getPawnHomeRow();
            stalemate = this.stalemate;
        };
        reset();

        if (move && ChessModel._isLegalMove(move, this.board, this.player) && !pawnHomeRow && !stalemate) {
            this._makeMove(board, move, piecesStolen);
            if (this._isPawnBackRow(board, move.to)) {
                pawnHomeRow = {
                    player: board[move.to].getColor(),
                    index: move.to
                }
            } else {
                pawnHomeRow = false;
            }
            player = player === WHITE ? BLACK : WHITE;
            const result = this._isCheck(board);
            check = result.check;
            if (check) {
                for (let c of result.details) {
                    // if the attempted move would result in check, or fail to protect the king from check it is illegal
                    if (c.checkMove === player) {
                        reset();
                        break;
                    }
                }
                checkmate = this._isCheckMate(board, player);
            } else {
                // If player has no legal moves available at this point it is stalemate
                stalemate = this._isStalemate(board, player);
            }
        }
        return new ChessModel({board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate});
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
    _isCheck(board, player) {
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

    _isCheckMate(board, defendingPlayer) {
        console.log('checking for checkmate ' + defendingPlayer);
        for (let piece of Object.keys(board)) {
            // iterate through its legal moves
            if (board[piece].getColor() === defendingPlayer) {
                for (let target of board[piece].legalMoves(piece, board, board[piece].getColor())) {
                    // at this point the player is in a check situation
                    // if all of these moves are still in a check situation then we are checkmate.
                    const boardCopy = Object.assign({}, board);
                    this._makeMove(boardCopy, {from: piece, to: target}, []);
                    if (!this._isCheck(boardCopy, defendingPlayer === WHITE ? BLACK : WHITE).check) {
                        return false;
                    }
                }
            }
        }
        return true;


    }

    _isPawnBackRow(board, piece) {
        if (board[piece] && board[piece].getType() === PAWN){
            const row = parseInt(piece / 8);
            if (row === 0 && board[piece].getColor() === WHITE) {
                return true;
            }
            if (row === 7 && board[piece].getColor() === BLACK) {
                return true;
            }
        }
        return false;
    }

    _isStalemate(board, player) {
        for (let piece of Object.keys(board)) {
            // iterate through its legal moves
            if (board[piece].getColor() === player) {
                /**
                 * TODO :
                 *      Refactor board utility functions - allow pieces to exclude moves that would result in check and checkmate (keeping immutability!)
                 *      return true if the number of legal moves is 0
                 */
            }
        }
    }
}