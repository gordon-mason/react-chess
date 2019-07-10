import {makePiece} from "./pieces/PieceFactory";
import {BISHOP, BLACK, KING, KNIGHT, PAWN, QUEEN, ROOK, WHITE} from "./constants";

export default {
    _isStalemate(board, player) {
        for (let piece of Object.keys(board)) {
            // iterate through its legal moves
            if (board[piece].getColor() === player) {
                /**
                 * TODO :
                 *      update ChessPiece.legalMoves to exclude those that result in check.
                 *      return true if the number of legal moves is 0
                 */
            }
        }
    },

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
    },

    /**
     *
     * @param board
     * @param player optional parameter specifying which player
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
    },

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

    },

    _makeMove(board, move, piecesStolen) {
        if (board[move.to]) {
            piecesStolen.push(board[move.to]);
        }
        board[move.to] = board[move.from];
        delete board[move.from];
    },

    _isLegalMove({from, to}, board, player) {
        if (this._isLegalBounds(from) && this._isLegalBounds(to)) {
            if (board[from] && board[from].getColor() === player) {
                if (board[from].legalMoves(from, board, player).includes(to)) {
                    return true;
                }
            }
        }
        return false;
    },

    _isLegalBounds(index) {
        return (index >= 0 && index <= 63);
    },

    _newGameBoard() {
        const board = {};
        for (let i = 0; i < 8; i++) {
            board[i + 8] = makePiece(PAWN, BLACK);
            board[i + 48] = makePiece(PAWN, WHITE);
        }

        board[0] = makePiece(ROOK, BLACK);
        board[1] = makePiece(KNIGHT, BLACK);
        board[2] = makePiece(BISHOP, BLACK);
        board[3] = makePiece(QUEEN, BLACK);
        board[4] = makePiece(KING, BLACK);
        board[5] = makePiece(BISHOP, BLACK);
        board[6] = makePiece(KNIGHT, BLACK);
        board[7] = makePiece(ROOK, BLACK);
        board[56] = makePiece(ROOK, WHITE);
        board[57] = makePiece(KNIGHT, WHITE);
        board[58] = makePiece(BISHOP, WHITE);
        board[59] = makePiece(QUEEN, WHITE);
        board[60] = makePiece(KING, WHITE);
        board[61] = makePiece(BISHOP, WHITE);
        board[62] = makePiece(KNIGHT, WHITE);
        board[63] = makePiece(ROOK, WHITE);
        return board;
    }
}