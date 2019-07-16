import React from 'react';
import '../styles/Chess.css';
import ChessMatch from "../model/ChessMatch";
import {Board} from "./Board/Board";
import ChessMenu from "./ChessMenu";
import PromotePawnModal from "./PromotePawnModal";
import {BLACK, WHITE} from "../model/constants";
import {SinglePlayerChessMatch} from "../model/SinglePlayerChessMatch";
import {RandomPlayer} from "../model/ai/RandomPlayer";

export default class ChessGame extends React.Component {

	state = {model: new ChessMatch({}), newGame: true};

	render() {
		let panelClass = 'info-panel info-panel-';
		if (this.state.model.player === WHITE) {
			panelClass += 'white';
		} else {
			panelClass += 'black';
		}
		return (
			<div>
				{this.state.newGame && <ChessMenu startMatch={this.startMatch}/>}

				{this.state.model.getPawnForPromotion() && <PromotePawnModal onSelection={this.promotePawn} color={this.state.model.getPawnForPromotion().player} />}


				<div className="Chess-game">
					<Board onMove={this.onMove} model={this.state.model}/>
					<div className="Chess-info-panel">
						<div className={panelClass}>To play: {this.state.model.player}</div>
						<div className='info-panel'>Timer</div>
						<div className='info-panel'>{this.state.model.getPawnForPromotion() &&
							this.state.model.getPawnForPromotion().player + ' has reached the back row' }
							{this.state.model.stalemate && 'Stalemate - it\'s a draw'}
							{this.state.model.check && 'Check'}{this.state.model.checkmate && ' and Checkmate!'}</div>
					</div>
				</div>
			</div>

		);
	}

	startMatch = ({singlePlayer, localMatch, networkMatch,
					  name1, name2, name1isWhite, aiDifficulty, timeLimit}) => {
		if (singlePlayer) {
			this.setState({newGame: false, model: new SinglePlayerChessMatch({},
					new RandomPlayer('Name', name1isWhite ? BLACK : WHITE))});
		} else if (localMatch) {
			this.setState({newGame: false, model: new ChessMatch({})});
		} else if (networkMatch) {
			alert('Network match not implemented');
		}
	};

	onMove = async (move) => {
		await this.setState(prevState => {
			const model = prevState.model.nextStateAfterMove(move);
			const newGame = model.isGameOver();
			return {model, newGame};
		});
	};

	promotePawn = (type) => {
		if (this.state.model.getPawnForPromotion()) {
			this.setState(prevState => {
				const model = prevState.model.nextStateAfterPromotion(type);
				const newGame = model.isGameOver();
				return {model, newGame};
			});
		}
	};
}