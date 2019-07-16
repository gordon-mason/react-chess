export class AIPlayer {

    constructor(name, color) {
        this.name = name;
        this.color = color;
    }

    /**
     * Choose a move given the current board state
     * @param board
     * @returns {{from: number, to: number}}
     */
    getMove(board) {
        throw new Error('getMove should be defined by subclasses');
    }


    /**
     * Choose the type of piece to promote this pawn to
     * @param board
     * @param index a number representing the pawns position on the board
     * @returns {string} a constant representing one of Queen, Rook, Bishop or Knight
     */
    getPawnPromotionChoice(board, index) {
        throw new Error('getPawnPromotionChoice should be defined by subclass');
    }
}