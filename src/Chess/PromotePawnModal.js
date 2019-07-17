import React from 'react';
import '../styles/Chess.css';
import {ChessPiece} from "./Board/ChessPiece";
import {BISHOP, KNIGHT, QUEEN, ROOK} from "../model/constants";

export default class PromotePawnModal extends React.Component {

    types = [ROOK, QUEEN, KNIGHT, BISHOP];

    render() {

        return (
            <div className="Chess-menu">
                <div className='Chess-menu-content'>
                    {this._renderPawnSelector()}
                </div>
            </div>
        );
    }

    _renderPawnSelector() {
        const selections = [];
        let i = 0;
        for (let type of this.types) {
            selections.push(<div className='Pawn-promotion' onClick={this._createSelectionFunction(type)} key={i++}>
                <ChessPiece color={this.props.color} type={type} />
            </div>)
        }
        return (<div>
            <div>{this.props.color} has reached the home row - select a piece to upgrade to!</div>
            {selections}
        </div>);
    }


    _createSelectionFunction(type) {
        return () => {
            this.props.onSelection(type);
        }
    }
}