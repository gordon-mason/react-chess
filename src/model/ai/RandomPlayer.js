import {AIPlayer} from "./AIPlayer";
import utils from "../ChessBoardUtils";
import {promotionPieces} from "../pieces/PieceFactory";

const rng = (interval) => {
    return parseInt(''+(Math.random() * interval));
};

export class RandomPlayer extends AIPlayer {

    getMove(board) {
        const moves = utils.listMoves(board, this.color);
        return moves[rng(moves.length)];
    }

    getPawnPromotionChoice(board, index) {
        return promotionPieces[rng(promotionPieces.length)]
    }
}