import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChessPawn, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessKing} from '@fortawesome/free-solid-svg-icons';

const pieceIconMap = {};
pieceIconMap['Pawn'] = faChessPawn;
pieceIconMap['Queen'] = faChessQueen;
pieceIconMap['Rook'] = faChessRook;
pieceIconMap['King'] = faChessKing;
pieceIconMap['Bishop'] = faChessBishop;
pieceIconMap['Knight'] = faChessKnight;


export class ChessPiece extends React.Component {

    render() {
        return <FontAwesomeIcon className='Chess-piece' color={this.props.color} icon={pieceIconMap[this.props.type]} />
    }

}