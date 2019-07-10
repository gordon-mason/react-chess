import React from "react";
import {Square} from "./Square";
import {ChessPiece} from "./ChessPiece";
import {BLACK, WHITE} from "../../model/constants";

export class Board extends React.Component {

    state = {highlights: [], lastIndex: -1};

    onClick = (index) => {
        if (this.state.highlights.includes(index)) {
            // a move is being made
            this.props.onMove({from: this.state.lastIndex, to: index});
            this.setState({highlights: [], lastIndex: -1});
        } else {
            // a piece or square has been selected
            const highlights = this.props.model.getAvailableMoves(index);
            this.setState({highlights, lastIndex: index});
        }
    };

    _prettyStolenPieces(color) {
        let i = 0;
        return this.props.model.getTakenPieces().filter(p=>{return p.getColor() === color}).map(p=>{
            return <ChessPiece key={i++} color={p.getColor()} type={p.getType()}  />
        });
    }

    render() {
        const squares = [];
        for (let i = 0; i < 64; i++) {
            squares.push(
                <Square
                    key={i}
                    id={i}
                    highlight={this.state.highlights.includes(i)}
                    selected={this.state.lastIndex === i}
                    type={this.props.model.getTypeOfPieceAt(i)}
                    pieceColor={this.props.model.getColorOfPieceAt(i)}
                    onClick={this.onClick} />);
        }
        return (
            <div className="Chess-board">
                <div className='Taken-pieces'> {this._prettyStolenPieces(WHITE)}</div>
                <div className="Board">
                    {squares}
                </div>
                <div className='Taken-pieces'> {this._prettyStolenPieces(BLACK)}</div>
            </div>);
    }

}