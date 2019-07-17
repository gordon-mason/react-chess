import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChessPawn, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessKing} from '@fortawesome/free-solid-svg-icons';
import {BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK} from "../../model/constants";

const pieceIconMap = {};
pieceIconMap[PAWN] = faChessPawn;
pieceIconMap[QUEEN] = faChessQueen;
pieceIconMap[ROOK] = faChessRook;
pieceIconMap[KING] = faChessKing;
pieceIconMap[BISHOP] = faChessBishop;
pieceIconMap[KNIGHT] = faChessKnight;


export class ChessPiece extends React.Component {

    render() {
        return <FontAwesomeIcon className='Chess-piece' color={this.props.color} icon={pieceIconMap[this.props.type]} />
    }

}