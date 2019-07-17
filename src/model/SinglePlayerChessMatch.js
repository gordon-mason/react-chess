import ChessMatch from "./ChessMatch";

export class SinglePlayerChessMatch extends ChessMatch {

    /**
     * {AIPlayer}
     */
    aiPlayer;

    constructor({board, player, piecesStolen, check, checkmate, pawnForPromotion, stalemate}, aiPlayer) {
        super({board, player, piecesStolen, check, checkmate, pawnForPromotion, stalemate});
        if (!aiPlayer) {
            throw new Error('single player match requires an AIPlayer');
        }
        this.aiPlayer = aiPlayer;
    }

    /**
     * Makes a move for the player and also makes a move for the AI player
     * @param {{from, to}} move
     * @returns {ChessMatch} clone after the moves have been made.
     * A clone of the current state is returned from invalid moves.
     */
    nextStateAfterMove(move) {
        let state = super.nextStateAfterMove(move);
        if (state.player === this.aiPlayer.color && !state.pawnForPromotion && !state.checkmate && !state.stalemate) {
            state = this._aiMove(state);
        }
        return new SinglePlayerChessMatch(state, this.aiPlayer);
    }

    _aiMove(state) {
        const aiMove = this.aiPlayer.getMove(state.board);
        state = state.nextStateAfterMove(aiMove);
        if (state.player === this.aiPlayer.color && !state.checkmate && !state.stalemate) {
            throw new Error('AI Player did not make a valid move! ' + JSON.stringify(aiMove));
        }
        if (state.pawnForPromotion) {
            state = state.nextStateAfterPromotion(this.aiPlayer.getPawnPromotionChoice(state.board, state.pawnForPromotion.index));
        }
        return state;
    }


    nextStateAfterPromotion(type) {
        let state = super.nextStateAfterPromotion(type);
        if (!state.checkmate && !state.stalemate && state.player === this.aiPlayer.color) {
            state = this._aiMove(state);
        }
        return new SinglePlayerChessMatch(state, this.aiPlayer);
    }
}