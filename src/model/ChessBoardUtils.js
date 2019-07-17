import {BLACK, KING, PAWN, WHITE} from "./constants";

export default {

    /**
     * Returns true if all moves for this player result in check - used to look for checkmate or stalemate conditions
     * @param board
     * @param player
     * @returns {boolean}
     * 
     */
    hasNoMoves(board, player) {
        for (let piece of Object.keys(board)) {
            // iterate through its legal moves
            if (board[piece].getColor() === player) {
                for (let target of board[piece].legalMoves(piece, board, board[piece].getColor())) {
                    let boardClone = Object.assign({}, board);
                    this.makeMove(boardClone, {from: piece, to: target}, []);
                    if (!this.isCheck(boardClone, player === WHITE ? BLACK : WHITE).check) {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    /**
     * Returns true if the piece is a pawn due for promotion
     * @param board
     * @param piece
     * @returns {boolean}
     * 
     */
    isPawnBackRow(board, piece) {
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
     * Returns a list of pieces that can take the king of the opposite color
     * @param board
     * @param player optional parameter specifying which players pieces to check
     * @returns {{details: [ {advantagePlayer, piece, index}... ], check: boolean}}
     * 
     */
    isCheck(board, player) {
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
                            advantagePlayer: board[piece].getColor(),
                            piece: board[piece].getType(),
                            index: piece,
                        });
                    }
                }
            }
        }
        return {check, details};
    },

    /**
     * Warning - has effects on board and does not check if the move is legal
     * @param board
     * @param move
     * @param piecesStolen
     * 
     */
    makeMove(board, move, piecesStolen) {
        if (board[move.to]) {
            piecesStolen.push(board[move.to]);
        }
        board[move.to] = board[move.from];
        delete board[move.from];
    },

    isLegalMove({from, to}, board, player) {
        if (this.isLegalBounds(from) && this.isLegalBounds(to)) {
            if (board[from] && board[from].getColor() === player) {
                if (board[from].legalMoves(from, board, player).includes(to)) {
                    return true;
                }
            }
        }
        return false;
    },

    isLegalBounds(index) {
        return (index >= 0 && index <= 63);
    },

    /**
     * List all the moves available to the player
     * @param board
     * @param player
     * @returns {Array}
     */
    listMoves(board, player) {
        return this.removeCheckMoves(Object.keys(board).filter((piece) => (board[piece].getColor() === player))
            .reduce((moves, piece) => (moves.concat(
                board[piece].legalMoves(piece, board, player).map(to => ({from: piece, to}))
            )), []), board, player);
    },


    removeCheckMoves(moves, board, player) {
        const newMoves = [];
        for (let move of moves) {
            const boardClone = Object.assign({}, board);
            this.makeMove(boardClone, move, []);
            if (!this.isCheck(boardClone, player === WHITE ? BLACK : WHITE).check) {
                newMoves.push(move);
            }
        }
        return newMoves;
    }

}