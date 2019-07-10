import {makePiece} from "./pieces/PieceFactory";
import Utils from './ChessBoardUtils';
import {BLACK, WHITE} from "./constants";

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
        this.board = Utils._newGameBoard();
        this.check = false;
        this.checkmate = false;
        this.piecesStolen = [];
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

    _cloneState() {
        let board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate;
        board = Object.assign({}, this.board);
        player = this.player;
        piecesStolen = this.piecesStolen.slice();
        check = this.check;
        checkmate = this.checkmate;
        pawnHomeRow = this.getPawnHomeRow();
        stalemate = this.stalemate;
        return {board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate};
    }

    nextStateAfterPromotion(type) {
        let {board, player, piecesStolen, check, checkmate, pawnHomeRow} = this._cloneState();
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
        let {board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate} = this._cloneState();
        if (move && Utils._isLegalMove(move, this.board, this.player) && !pawnHomeRow && !stalemate) {
            Utils._makeMove(board, move, piecesStolen);
            if (Utils._isPawnBackRow(board, move.to)) {
                pawnHomeRow = {
                    player: board[move.to].getColor(),
                    index: move.to
                }
            } else {
                pawnHomeRow = false;
            }
            player = player === WHITE ? BLACK : WHITE;
            const result = Utils._isCheck(board);
            check = result.check;
            if (check) {
                for (let c of result.details) {
                    // if the attempted move would result in check, or fail to protect the king from check it is illegal
                    if (c.checkMove === player) {
                        const state = this._cloneState();
                        board = state.board;
                        player = state.player;
                        piecesStolen = state.piecesStolen;
                        check = state.check;
                        checkmate = state.checkmate;
                        pawnHomeRow = state.pawnHomeRow;
                        break;
                    }
                }
                checkmate = Utils._isCheckMate(board, player);
            } else {
                // If player has no legal moves available at this point it is stalemate
                stalemate = Utils._isStalemate(board, player);
            }
        }
        return new ChessModel({board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate});
    }

}