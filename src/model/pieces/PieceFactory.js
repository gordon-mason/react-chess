import {BISHOP, BLACK, KING, KNIGHT, PAWN, QUEEN, ROOK, WHITE} from "./ChessPiece";
import {Pawn} from "./Pawn";
import {King} from "./King";
import {Queen} from "./Queen";
import {Rook} from "./Rook";
import {Bishop} from "./Bishop";
import {Knight} from "./Knight";

export const makePiece = (type, color) => {
    if (!(color === WHITE || color === BLACK)) {
        throw new Error('Pieces must be Black or White, ' + color + ' is not defined');
    }
    if (type === PAWN) {
        return new Pawn(color);
    }
    if (type === KING) {
        return new King(color);
    }
    if (type === QUEEN) {
        return new Queen(color);
    }
    if (type === ROOK) {
        return new Rook(color);
    }
    if (type === BISHOP) {
        return new Bishop(color);
    }
    if (type === KNIGHT) {
        return new Knight(color);
    }
    throw new Error('Type of piece ' + type + ' is not defined');
};