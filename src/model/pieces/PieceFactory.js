import {Pawn} from "./Pawn";
import {King} from "./King";
import {Queen} from "./Queen";
import {Rook} from "./Rook";
import {Bishop} from "./Bishop";
import {Knight} from "./Knight";
import {BISHOP, BLACK, KING, KNIGHT, PAWN, QUEEN, ROOK, WHITE} from "../constants";

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

export const promotionPieces = [QUEEN, ROOK, BISHOP, KNIGHT];

export const makeNewGameBoard = () => {
    const board = {};
    for (let i = 0; i < 8; i++) {
        board[i + 8] = makePiece(PAWN, BLACK);
        board[i + 48] = makePiece(PAWN, WHITE);
    }

    board[0] = makePiece(ROOK, BLACK);
    board[1] = makePiece(KNIGHT, BLACK);
    board[2] = makePiece(BISHOP, BLACK);
    board[3] = makePiece(QUEEN, BLACK);
    board[4] = makePiece(KING, BLACK);
    board[5] = makePiece(BISHOP, BLACK);
    board[6] = makePiece(KNIGHT, BLACK);
    board[7] = makePiece(ROOK, BLACK);
    board[56] = makePiece(ROOK, WHITE);
    board[57] = makePiece(KNIGHT, WHITE);
    board[58] = makePiece(BISHOP, WHITE);
    board[59] = makePiece(QUEEN, WHITE);
    board[60] = makePiece(KING, WHITE);
    board[61] = makePiece(BISHOP, WHITE);
    board[62] = makePiece(KNIGHT, WHITE);
    board[63] = makePiece(ROOK, WHITE);
    return board;
};