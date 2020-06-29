import store, { InferActionsTypes, BaseThunkType } from "./store";
import { PieceType } from "../utils/pieceImages";
import ChessPosition from "../utils/ChessPosition";
import { gameAPI, ResultCodesEnum, socketAPI } from "../api/api";

export enum GameStatusEnum {
    NotStarted = 0,
    InProgress = 1,
    Finished = 2,
};

const initialState = {
    gameStatus: GameStatusEnum.NotStarted,
    position: new ChessPosition(),
};

export const gameReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch(action.type) {
        case 'GAME/MAKE_MOVE':
            return {...state, position: state.position.makeMove(action.move)};
        case 'GAME/SET_DEFAULT_POSITION':
            let cp = new ChessPosition();
            cp.setPiecesList(true);
            return {...state, position: cp};
        case 'GAME/CHOOSE_PROMOTION':
            return {...state, position: state.position.choosePromotion(action.pt)};
        case 'GAME/SET_GAME_STATUS':
            return {...state, gameStatus: action.gameStatus};
        default:
            return state;
    }
};

export const gameActions = {
    makeMove: (move: MoveType) => ({ type: 'GAME/MAKE_MOVE', move } as const),
    setDefaultPosition: () => ({ type: 'GAME/SET_DEFAULT_POSITION' } as const),
    choosePromotion: (pt: PromotionPieceType) => ({ type: 'GAME/CHOOSE_PROMOTION', pt } as const),
    setGameStatus: (gameStatus: GameStatusEnum) => ({ type: 'GAME/SET_GAME_STATUS', gameStatus } as const),
};

export const startGame = (): ThunkType => dispatch => {
    return gameAPI.startGame()
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) {
            dispatch(gameActions.setDefaultPosition());
            dispatch(gameActions.setGameStatus(GameStatusEnum.InProgress));
        }
    });
}

export const makeMove = (move: MoveType): ThunkType => dispatch => {
    dispatch(gameActions.makeMove(move));
    return gameAPI.makeMove(move);
}

type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof gameActions>;
type ThunkType = BaseThunkType<ActionsType>;
export type PiecePositionType = {type: PieceType, x: number, y: number};
export type PiecesListType = Array<PiecePositionType>;
export type PositionType = {
    piecesList: PiecesListType,
    promotionChoice: {x: number, y: number} | null,
};
export type MoveType = {fromX: number, fromY: number, toX: number, toY: number};
export type PromotionPieceType = 'q' | 'r' | 'b' | 'n';
export type Color = 'w' | 'b';
