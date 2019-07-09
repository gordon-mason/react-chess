import React from 'react';
import '../styles/Chess.css';
import ChessModel from "../model/ChessModel";
import {Board} from "./Board/Board";
import {WHITE} from "../model/pieces/ChessPiece";
import ChessMenu from "./ChessMenu";

export default class ChessGame extends React.Component {

	state = {model: new ChessModel({}), newGame: true};

	onMove = async (move) => await this.setState({model: this.state.model.nextState(move)});
	startMatch = ({singlePlayer, localMatch, networkMatch,
					  name1, name2, name1isWhite, aiDifficulty, timeLimit}) => {
		if (singlePlayer) {
			this.setState({newGame: false});
		}
	};

	render() {
		let panelClass = 'info-panel info-panel-';
		if (this.state.model.getCurrentPlayer() === WHITE) {
			panelClass += 'white';
		} else {
			panelClass += 'black';
		}
		return (
			<div>
				{this.state.newGame && <ChessMenu startMatch={this.startMatch}/>}

				<div className="Chess-game">
					<Board onMove={this.onMove} model={this.state.model}/>
					<div className="Chess-info-panel">
						<div className={panelClass}>To play: {this.state.model.getCurrentPlayer()}</div>
						<div className='info-panel'>Timer</div>
						<div className='info-panel'>{this.state.model.isCheck() && 'CHECK'}{this.state.model.isCheckmate() && ' and CHECKMATE!'}</div>
					</div>
				</div>
			</div>

		);
	}
}