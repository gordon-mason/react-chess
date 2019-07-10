import React from 'react';
import '../styles/Chess.css';
import ChessModel from "../model/ChessModel";
import {Board} from "./Board/Board";
import ChessMenu from "./ChessMenu";
import PromotePawnModal from "./PromotePawnModal";
import {WHITE} from "../model/constants";

export default class ChessGame extends React.Component {

	state = {model: new ChessModel({}), newGame: true};

	onMove = async (move) => await this.setState({model: this.state.model.nextState(move)});

	startMatch = ({singlePlayer, localMatch, networkMatch,
					  name1, name2, name1isWhite, aiDifficulty, timeLimit}) => {
		if (singlePlayer) {
			this.setState({newGame: false});
		}
	};

	_promotePawn = (type) => {
		if (this.state.model.getPawnHomeRow()) {
			this.setState(prevState => ({model: prevState.model.nextStateAfterPromotion(type)}));
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

				{this.state.model.getPawnHomeRow() && <PromotePawnModal onSelection={this._promotePawn} color={this.state.model.getPawnHomeRow().player} />}

				<div className="Chess-game">
					<Board onMove={this.onMove} model={this.state.model}/>
					<div className="Chess-info-panel">
						<div className={panelClass}>To play: {this.state.model.getCurrentPlayer()}</div>
						<div className='info-panel'>Timer</div>
						<div className='info-panel'>{this.state.model.getPawnHomeRow() &&
							this.state.model.getPawnHomeRow().player + ' has reached the back row' }
							{this.state.model.isCheck() && 'Check'}{this.state.model.isCheckmate() && ' and Checkmate!'}</div>
					</div>
				</div>
			</div>

		);
	}
}