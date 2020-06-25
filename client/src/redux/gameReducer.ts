import { InferActionsTypes } from "./store";
import { PieceType } from "../utils/pieceImages";
import ChessPosition from "../utils/ChessPosition";

const initialState = {
    position: new ChessPosition(),
};

export const gameReducer = (state = initialState, action: ActionTypes): InitialStateType => {
    switch(action.type) {
        case 'GAME/MAKE_MOVE':
            return {...state, position: state.position.makeMove(action.move)};
        case 'GAME/SET_DEFAULT_POSITION':
            let cp = new ChessPosition();
            cp.setPiecesList(true);
            return {...state, position: cp};
        case 'GAME/CHOOSE_PROMOTION':
            return {...state, position: state.position.choosePromotion(action.pt)};
        default:
            return state;
    }
};

export const gameActions = {
    makeMove: (move: MoveType) => ({type: 'GAME/MAKE_MOVE', move} as const),
    setDefaultPosition: () => ({type: 'GAME/SET_DEFAULT_POSITION'} as const),
    choosePromotion: (pt: PromotionPieceType) => ({type: 'GAME/CHOOSE_PROMOTION', pt} as const),
};

type InitialStateType = typeof initialState;
type ActionTypes = InferActionsTypes<typeof gameActions>;
export type PiecePositionType = {type: PieceType, x: number, y: number};
export type PiecesListType = Array<PiecePositionType>;
export type PositionType = {
    piecesList: PiecesListType,
    promotionChoice: {x: number, y: number} | null,
};
export type MoveType = {fromX: number, fromY: number, toX: number, toY: number};
export type PromotionPieceType = 'q' | 'r' | 'b' | 'n';
export type Color = 'w' | 'b';