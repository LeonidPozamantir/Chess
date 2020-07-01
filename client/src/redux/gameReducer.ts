import { InferActionsTypes, BaseThunkType } from "./store";
import { PieceType } from "../utils/pieceImages";
import ChessPosition from "../utils/ChessPosition";
import { gameAPI, ResultCodesEnum } from "../api/api";

export enum GameStatusEnum {
    NotStarted = 0,
    InProgress = 1,
    Finished = 2,
};

export enum GameResultEnum {
    NotFinished = 0,
    WhiteWonByCheckmate = 1,
    BlackWonByCheckmate = 2,
    WhiteResigned = 3,
    BlackResigned = 4,
    WhiteLostByTime = 5,
    BlackLostByTime = 6,
    DrawAccepted = 7,
    DrawByRepetion = 8,
    DrawBy50Moves = 9,
    DrawByStalemate = 10,
    DrawByInsufficientMaterial = 11,
};

export enum GameActionEnum {
    StartGame = 0,
}

const initialState = {
    isWaitingForGameStart: false,
    gameStatus: GameStatusEnum.NotStarted,
    gameResult: GameResultEnum.NotFinished,
    position: new ChessPosition(),
    playerColor: 'w' as Color,
    opponentId: null as number | null,
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
        case 'GAME/SET_GAME_RESULT':
            return {...state, gameResult: action.gameResult};
        case 'GAME/SET_IS_WAITING_FOR_GAME_START':
            return {...state, isWaitingForGameStart: action.isWaitingForGameStart};
        case 'GAME/SET_GAME_DETAILS':
            return {...state, playerColor: action.color, opponentId: action.opponentId};
        default:
            return state;
    }
};

export const gameActions = {
    makeMove: (move: MoveType) => ({ type: 'GAME/MAKE_MOVE', move } as const),
    setDefaultPosition: () => ({ type: 'GAME/SET_DEFAULT_POSITION' } as const),
    choosePromotion: (pt: PromotionPieceType) => ({ type: 'GAME/CHOOSE_PROMOTION', pt } as const),
    setGameStatus: (gameStatus: GameStatusEnum) => ({ type: 'GAME/SET_GAME_STATUS', gameStatus } as const),
    setGameResult: (gameResult: GameResultEnum) => ({ type: 'GAME/SET_GAME_RESULT', gameResult } as const),
    setIsWaitingForGameStart: (isWaitingForGameStart: boolean) => ({ type: 'GAME/SET_IS_WAITING_FOR_GAME_START', isWaitingForGameStart } as const),
    setGameDetails: (color: Color, opponentId: number) => ({ type: 'GAME/SET_GAME_DETAILS', color, opponentId } as const),
};

export const requestStartGame = (): ThunkType => dispatch => {
    dispatch(gameActions.setIsWaitingForGameStart(true));
    return gameAPI.requestStartGame()
    .then((data => {}));
}

export const processMessage = (message: MessageType): BaseThunkType<ActionsType, void> => (dispatch) => {
    if (message.move) dispatch(makeMoveAndUpdateGameStatus(message.move));
    if (message.action) dispatch(processAction(message.action));
};

export const makeMoveAndUpdateGameStatus = (move: MoveType): BaseThunkType<ActionsType, void> => (dispatch, getState) => {
    dispatch(gameActions.makeMove(move));
    const position = getState().game.position;
    if (position.isCheckmate()) {
        dispatch(gameActions.setGameStatus(GameStatusEnum.Finished));
        if (position.sideToMove === 'w') dispatch(gameActions.setGameResult(GameResultEnum.BlackWonByCheckmate));
        else dispatch(gameActions.setGameResult(GameResultEnum.WhiteWonByCheckmate));
    }
    if (position.isStalemate()) {
        dispatch(gameActions.setGameStatus(GameStatusEnum.Finished));
        dispatch(gameActions.setGameResult(GameResultEnum.DrawByStalemate));
    }
}

export const sendMove = (move: MoveType): ThunkType => (dispatch, getState) => {
    let position = getState().game.position;
    if (!position.isMoveLegal(move)) return Promise.resolve();
    dispatch(makeMoveAndUpdateGameStatus(move));
    position = getState().game.position;
    if (!position.promotionChoice) return gameAPI.makeMove(move);
    return Promise.resolve();
};

export const choosePromotion = (pt: PromotionPieceType): ThunkType => (dispatch, getState) => {
    const move = getState().game.position.promotionChoice;
    if (!move) return Promise.resolve();
    dispatch(gameActions.choosePromotion(pt));
    move.promoteTo = pt;
    return gameAPI.makeMove(move);
};

export const processAction = (action: ActionMessageType): BaseThunkType<ActionsType, void> => (dispatch) => {
    switch (action.actionType) {
        case GameActionEnum.StartGame:
            dispatch(gameActions.setDefaultPosition());
            dispatch(gameActions.setGameStatus(GameStatusEnum.InProgress));
            dispatch(gameActions.setGameDetails(action.color, action.opponentId));
            dispatch(gameActions.setIsWaitingForGameStart(false));
    }
};

type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof gameActions>;
type ThunkType = BaseThunkType<ActionsType>;
export type PiecePositionType = {type: PieceType, x: number, y: number};
export type PiecesListType = Array<PiecePositionType>;
export type PositionType = {
    piecesList: PiecesListType,
    promotionChoice: MoveType | null,
};
export type MoveType = {fromX: number, fromY: number, toX: number, toY: number, promoteTo? : PromotionPieceType};
export type PromotionPieceType = 'q' | 'r' | 'b' | 'n';
export type Color = 'w' | 'b';

type StartGameMessageType = {
    actionType: GameActionEnum.StartGame,
    opponentId: number,
    color: Color,
};
type ActionMessageType = StartGameMessageType;
export type MessageType = { move?: MoveType, action?: ActionMessageType };