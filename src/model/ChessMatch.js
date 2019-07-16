import {makeNewGameBoard, makePiece} from "./pieces/PieceFactory";
import Utils from './ChessBoardUtils';
import {BLACK, WHITE} from "./constants";

export default class ChessMatch {

    board; // {0:{ChessPiece},15:{ChessPiece}...}
    piecesStolen; // []
    player; // BLACK || WHITE
    check; // bool
    checkmate; // bool
    stalemate; // bool
    pawnForPromotion; // false || {player, index: 0 to 63}

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
            this.pawnForPromotion = pawnHomeRow ? Object.assign(pawnHomeRow) : false;
        }
    }

    _init() {
        this.player = WHITE;
        this.board = makeNewGameBoard();
        this.check = false;
        this.checkmate = false;
        this.stalemate = false;
        this.pawnForPromotion = false;
        this.piecesStolen = [];
    }

    _cloneState() {
        let board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate;
        board = Object.assign({}, this.board);
        player = this.player;
        piecesStolen = this.piecesStolen.slice();
        check = this.check;
        checkmate = this.checkmate;
        pawnHomeRow = this.getPawnForPromotion();
        stalemate = this.stalemate;
        return {board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate};
    }

    /**
     * @param {{from, to}} move
     * @returns {ChessMatch} clone after the move has been made.
     * A clone of the current state is returned from invalid moves.
     */
    nextStateAfterMove(move) {
        let {board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate} = this._cloneState();
        if (move && Utils.isLegalMove(move, board, player) && !pawnHomeRow && !checkmate && !stalemate) {
            Utils.makeMove(board, move, piecesStolen);
            if (Utils.isPawnBackRow(board, move.to)) {
                pawnHomeRow = {
                    player: board[move.to].getColor(),
                    index: move.to
                }
            } else {
                pawnHomeRow = false;
            }
            player = player === WHITE ? BLACK : WHITE;
            const result = Utils.isCheck(board);
            check = result.check;
            if (check) {
                for (let c of result.details) {
                    // if the attempted move would result in check, or fail to protect the king from check it is illegal
                    if (c.advantagePlayer === player) {
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
                checkmate = Utils.hasNoMoves(board, player);
            } else {
                stalemate = Utils.hasNoMoves(board, player);
            }
        }
        return new ChessMatch({board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate});
    }

    nextStateAfterPromotion(type) {
        let {board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate} = this._cloneState();
        if (this.pawnForPromotion) {
            board[this.pawnForPromotion.index] = makePiece(type, board[this.pawnForPromotion.index].getColor());
            pawnHomeRow = false;
            const result = Utils.isCheck(board);
            check = result.check;
            if (check) {
                checkmate = Utils.hasNoMoves(board, player);
            } else {
                // If player has no legal moves available at this point it is stalemate
                stalemate = Utils.hasNoMoves(board, player);
            }
        }

        return new ChessMatch({board, player, piecesStolen, check, checkmate, pawnHomeRow, stalemate});
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

    getPawnForPromotion() {
        return this.pawnForPromotion ? Object.assign({}, this.pawnForPromotion) : false;
    }

    isGameOver() {
        return this.checkmate || this.stalemate;
    }

}