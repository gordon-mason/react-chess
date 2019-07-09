import React from "react";
import {ChessPiece} from "./ChessPiece";

function indexToCoordinates(index) {
    const x = index % 8;
    const y = parseInt(index / 8);
    return {x, y};
}

export class Square extends React.Component {

    componentWillMount() {
        const coords = indexToCoordinates(this.props.id);
        if (coords.y % 2 === 0) {
            this.color = (coords.x % 2 === 0) ? 'white' : 'grey';
        } else {
            this.color = (coords.x % 2 === 0) ? 'grey' : 'white';
        }
    }

    render() {
        let color;
        if (this.props.highlight) {
            color = 'yellow';
        } else if (this.props.selected) {
            color = 'green';
        } else {
            color = this.color;
        }
        return <div className="Board-square" style={{backgroundColor: color}}
                    onClick={() => this.props.onClick(this.props.id)}>
            {this.props.type && <ChessPiece color={this.props.pieceColor} type={this.props.type} />}
        </div>
    }

}