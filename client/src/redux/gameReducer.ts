import { InferActionsTypes } from "./store";
import { PieceTypeType } from "../utils/pieceImages";

const initialState = {
    position: {
        piecesList: [
            {type: 'wr', x: 1, y: 1},
            {type: 'wn', x: 2, y: 1},
            {type: 'wb', x: 3, y: 1},
            {type: 'wq', x: 4, y: 1},
            {type: 'wk', x: 5, y: 1},
            {type: 'wb', x: 6, y: 1},
            {type: 'wn', x: 7, y: 1},
            {type: 'wr', x: 8, y: 1},
            {type: 'wp', x: 1, y: 2},
            {type: 'wp', x: 2, y: 2},
            {type: 'wp', x: 3, y: 2},
            {type: 'wp', x: 4, y: 2},
            {type: 'wp', x: 5, y: 2},
            {type: 'wp', x: 6, y: 2},
            {type: 'wp', x: 7, y: 2},
            {type: 'wp', x: 8, y: 2},
            {type: 'br', x: 1, y: 8},
            {type: 'bn', x: 2, y: 8},
            {type: 'bb', x: 3, y: 8},
            {type: 'bq', x: 4, y: 8},
            {type: 'bk', x: 5, y: 8},
            {type: 'bb', x: 6, y: 8},
            {type: 'bn', x: 7, y: 8},
            {type: 'br', x: 8, y: 8},
            {type: 'bp', x: 1, y: 7},
            {type: 'bp', x: 2, y: 7},
            {type: 'bp', x: 3, y: 7},
            {type: 'bp', x: 4, y: 7},
            {type: 'bp', x: 5, y: 7},
            {type: 'bp', x: 6, y: 7},
            {type: 'bp', x: 7, y: 7},
            {type: 'bp', x: 8, y: 7},
        ] as PiecesListType,
    },
    
};

export const gameReducer = (state = initialState, action: ActionTypes): InitialStateType => {
    switch(action.type) {
        case 'GAME/MAKE_MOVE':
            let pl = [...state.position.piecesList];
            pl.forEach(p=> {
                if (p.x === action.fromX && p.y === action.fromY) {
                    p.x = action.toX;
                    p.y = action.toY;
                }
            });
            return {...state, position: {piecesList: pl}};
        default:
            return state;
    }
};

export const gameActions = {
    makeMove: (fromX: number, fromY: number, toX: number, toY: number) => ({type: 'GAME/MAKE_MOVE', fromX, fromY, toX, toY} as const),
};

type InitialStateType = typeof initialState;
type ActionTypes = InferActionsTypes<typeof gameActions>;
export type PieceType = {type: PieceTypeType, x: number, y: number};
type PiecesListType = Array<PieceType>;
export type PositionType = {
    piecesList: PiecesListType,
};