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

export const GameEvents = {
    StartGame: 0,
    OfferDraw: 1,
    AcceptDraw: 2,
    DeclineDraw: 3,
    Resign: 4,
    Timeout: 5,
} as const;
export enum GameEventsEnum {
    StartGame = 0,
    OfferDraw = 1,
    AcceptDraw = 2,
    DeclineDraw = 3,
    Resign = 4,
    Timeout = 5,
};


const initialState = {
    isWaitingForGameStart: false,
    gameStatus: GameStatusEnum.NotStarted,
    gameResult: GameResultEnum.NotFinished,
    position: new ChessPosition(),
    playerColor: 'w' as Color,
    opponentId: null as number | null,
    opponentName: null as string | null,
    opponentRating: null as number | null,
    opponentProfilePicture: null as string | null,
    lastMove: null as MoveType | null,
    whiteRemainingTime: null as number | null,
    blackRemainingTime: null as number | null,
    timer: null as NodeJS.Timeout | null,
    wasDrawOffered: false,
    opponentOfferedDraw: false,
    moves: [] as Array<{w?: MoveRecordType, b?: MoveRecordType}>,
};

export const gameReducer = (state = initialState, action: ActionsType): GameInitialStateType => {
    switch(action.type) {
        case 'GAME/MAKE_MOVE':
            return { ...state, position: state.position.makeMove(action.move), lastMove: action.move };
        case 'GAME/SET_DEFAULT_POSITION':
            let cp = new ChessPosition();
            cp.setPiecesList(true);
            return { ...state, position: cp, lastMove: null };
        case 'GAME/SET_POSITION':
            return { ...state, position: state.position.copy(action.position), lastMove: action.lastMove };
        case 'GAME/CHOOSE_PROMOTION':
            return { ...state, position: state.position.choosePromotion(action.pt) };
        case 'GAME/SET_GAME_STATUS':
            return { ...state, gameStatus: action.gameStatus };
        case 'GAME/SET_GAME_RESULT':
            return { ...state, gameResult: action.gameResult };
        case 'GAME/SET_IS_WAITING_FOR_GAME_START':
            return { ...state, isWaitingForGameStart: action.isWaitingForGameStart };
        case 'GAME/SET_GAME_DETAILS':
            return { ...state, playerColor: action.color, opponentId: action.opponentId, opponentName: action.opponentName, opponentRating: action.opponentRating, opponentProfilePicture: action.opponentProfilePicture };
        case 'GAME/SET_REMAINING_TIME':
            if (action.color === 'w') return { ...state, whiteRemainingTime: action.time }; else return { ...state, blackRemainingTime: action.time };
        case 'GAME/SET_TIMER':
            return { ...state, timer: action.timer };
        case 'GAME/SET_DRAW_OFFERED':
            return { ...state, wasDrawOffered: action.wasDrawOffered }
        case 'GAME/SET_OPPONENT_OFFERED_DRAW':
            return { ...state, opponentOfferedDraw: action.opponentOfferedDraw };
        case 'GAME/ADD_MOVE_RECORD':
            let newMoves = [...state.moves];
            const sideToMove = action.sideToMove || state.position.sideToMove;
            if (sideToMove === 'w' || newMoves.length === 0) newMoves.push({});
            newMoves[newMoves.length - 1][sideToMove] = { move: action.move, notation: action.notation };
            return { ...state, moves: newMoves };
        case 'GAME/RESET_MOVES_LIST':
            return { ...state, moves: action.moves };
        default:
            return state;
    }
};

export const gameActions = {
    makeMove: (move: MoveType) => ({ type: 'GAME/MAKE_MOVE', move } as const),
    setDefaultPosition: () => ({ type: 'GAME/SET_DEFAULT_POSITION' } as const),
    setPosition: (position: ChessPosition, lastMove: MoveType | null) => ({ type: 'GAME/SET_POSITION', position, lastMove } as const),
    choosePromotion: (pt: PromotionPieceType) => ({ type: 'GAME/CHOOSE_PROMOTION', pt } as const),
    setGameStatus: (gameStatus: GameStatusEnum) => ({ type: 'GAME/SET_GAME_STATUS', gameStatus } as const),
    setGameResult: (gameResult: GameResultEnum) => ({ type: 'GAME/SET_GAME_RESULT', gameResult } as const),
    setIsWaitingForGameStart: (isWaitingForGameStart: boolean) => ({ type: 'GAME/SET_IS_WAITING_FOR_GAME_START', isWaitingForGameStart } as const),
    setGameDetails: (color: Color, opponentId: number | null, opponentName: string | null, opponentRating: number | null, opponentProfilePicture: string | null) => ({ type: 'GAME/SET_GAME_DETAILS', color, opponentId, opponentName, opponentRating, opponentProfilePicture } as const),
    setRemainingTime: (color: Color, time: number | null) => ({ type: 'GAME/SET_REMAINING_TIME', color, time } as const),
    setTimer: (timer: NodeJS.Timeout | null) => ({ type: 'GAME/SET_TIMER', timer } as const),
    setDrawOffered: (wasDrawOffered: boolean) => ({ type: 'GAME/SET_DRAW_OFFERED', wasDrawOffered } as const),
    setOpponentOfferedDraw: (opponentOfferedDraw: boolean) => ({ type: 'GAME/SET_OPPONENT_OFFERED_DRAW', opponentOfferedDraw } as const),
    addMoveRecord: (move: MoveType, notation: string, sideToMove?: Color) => ({ type: 'GAME/ADD_MOVE_RECORD', move, notation, sideToMove } as const),
    setMovesList: (moves: Array<{w?: MoveRecordType, b?: MoveRecordType}>) => ({ type: 'GAME/RESET_MOVES_LIST', moves } as const),
};

export const requestStartGame = (): ThunkType => dispatch => {
    dispatch(gameActions.setIsWaitingForGameStart(true));
    return gameAPI.requestStartGame()
    .then((data => {}));
}

export const processMessage = (message: MessageType): BaseThunkType<ActionsType, void> => (dispatch, getState) => {
    if (message.type === 'move') {
        dispatch(gameActions.setRemainingTime('w', message.whiteRemainingTime));
        dispatch(gameActions.setRemainingTime('b', message.blackRemainingTime));
        dispatch(gameActions.addMoveRecord(message.move, getState().game.position.getMoveNotation(message.move)));
        dispatch(makeMoveAndUpdateGameStatus(message.move));
    }
    if (message.type === 'event') dispatch(processEvent(message));
};

export const getFullGameState = (): ThunkType => (dispatch) => {
    return gameAPI.getFullGameState()
    .then(data => {
        if (data.resultCode === 0) {
            const gameData = data.data;
            if (gameData.isWaitingForGameStart) {
                dispatch(gameActions.setIsWaitingForGameStart(true));
                return;
            }
            if (gameData.gameStatus === GameStatusEnum.InProgress) {
                dispatch(gameActions.setPosition(gameData.position, gameData.lastMove));
                dispatch(gameActions.setGameDetails(gameData.playerColor, gameData.opponentId, gameData.opponentName, gameData.opponentRating, gameData.opponentProfilePicture));
                dispatch(gameActions.setGameStatus(GameStatusEnum.InProgress));
                dispatch(gameActions.setGameResult(GameResultEnum.NotFinished));
                dispatch(gameActions.setRemainingTime('w', gameData.whiteRemainingTime));
                dispatch(gameActions.setRemainingTime('b', gameData.blackRemainingTime));
                dispatch(gameActions.setDrawOffered(gameData.wasDrawOffered));
                dispatch(gameActions.setOpponentOfferedDraw(gameData.opponentOfferedDraw));
                dispatch(gameActions.setMovesList(gameData.moves));
                dispatch(launchTimer(gameData.position.sideToMove));
            }
        }
    });
}

export const makeMoveAndUpdateGameStatus = (move: MoveType): BaseThunkType<ActionsType, void> => (dispatch, getState) => {
    if (getState().game.gameStatus !== GameStatusEnum.InProgress) return;
    dispatch(gameActions.makeMove(move));
    dispatch(gameActions.setOpponentOfferedDraw(false));
    const position = getState().game.position;
    if (position.isCheckmate()) {
        const gameResult = position.sideToMove === 'w' ? GameResultEnum.BlackWonByCheckmate : GameResultEnum.WhiteWonByCheckmate;
        dispatch(finishGame(gameResult));
        return;
    }
    if (position.isStalemate()) {
        dispatch(finishGame(GameResultEnum.DrawByStalemate));
        return;
    }
    dispatch(launchTimer(position.sideToMove));
}

export const playerMakeMove = (move: MoveType): ThunkType => (dispatch, getState) => {
    if (getState().game.gameStatus !== GameStatusEnum.InProgress) return Promise.resolve();
    let position = getState().game.position;
    if (!position.isMoveLegal(move)) return Promise.resolve();
    const moveNotation = position.getMoveNotation(move);
    const sideToMove = position.sideToMove;
    dispatch(makeMoveAndUpdateGameStatus(move));
    position = getState().game.position;
    if (!position.promotionChoice) {
        dispatch(gameActions.addMoveRecord(move, moveNotation, sideToMove));
        return gameAPI.makeMove(move);
    }
    return Promise.resolve();
};

export const choosePromotion = (pt: PromotionPieceType): ThunkType => (dispatch, getState) => {
    const move = getState().game.position.promotionChoice;
    if (!move) return Promise.resolve();
    move.promoteTo = pt;
    dispatch(gameActions.addMoveRecord(move, getState().game.position.getMoveNotation(move)));
    dispatch(gameActions.choosePromotion(pt));
    const position = getState().game.position;
    dispatch(launchTimer(position.sideToMove));
    return gameAPI.makeMove(move);
};

export const offerDraw = (): BaseThunkType<ActionsType, void> => (dispatch) => {
    gameAPI.offerDraw();
    dispatch(gameActions.setDrawOffered(true));
};

export const acceptDraw = (): BaseThunkType<ActionsType, void> => (dispatch) => {
    gameAPI.acceptDraw();
    dispatch(gameActions.setOpponentOfferedDraw(false));
};

export const declineDraw = (): BaseThunkType<ActionsType, void> => (dispatch) => {
    gameAPI.declineDraw();
    dispatch(gameActions.setOpponentOfferedDraw(false));
};

export const resign = (): BaseThunkType<ActionsType, void> => () => {
    gameAPI.resign();
};

const launchTimer = (color: Color): BaseThunkType<ActionsType, void> => (dispatch, getState) => {
    if (getState().game.gameStatus !== GameStatusEnum.InProgress) return;
    const timer = setInterval(() => {
        let remTime = color === 'w' ? getState().game.whiteRemainingTime : getState().game.blackRemainingTime;
        if (!remTime) return;
        remTime = Math.max(remTime - 100, 0);
        dispatch(gameActions.setRemainingTime(color, remTime));
    }, 100);
    const curTimer = getState().game.timer;
    if (curTimer) clearInterval(curTimer);
    dispatch(gameActions.setTimer(timer));
};

export const processEvent = (event: EventMessageType): BaseThunkType<ActionsType, void> => (dispatch) => {
    switch (event.eventType) {
        case GameEvents.StartGame:
            dispatch(gameActions.setDefaultPosition());
            dispatch(gameActions.setGameStatus(GameStatusEnum.InProgress));
            dispatch(gameActions.setGameResult(GameResultEnum.NotFinished));
            dispatch(gameActions.setGameDetails(event.color, event.opponentId, event.opponentName, event.opponentRating, event.opponentProfilePicture));
            dispatch(gameActions.setIsWaitingForGameStart(false));
            dispatch(gameActions.setRemainingTime('w', event.timeControl.game * 60 * 1000));
            dispatch(gameActions.setRemainingTime('b', event.timeControl.game * 60 * 1000));
            dispatch(gameActions.setDrawOffered(false));
            dispatch(gameActions.setOpponentOfferedDraw(false));
            dispatch(gameActions.setMovesList([]));
            dispatch(launchTimer('w'));
            break;
        case GameEvents.Timeout:
            dispatch(gameActions.setRemainingTime('w', event.whiteRemainingTime));
            dispatch(gameActions.setRemainingTime('b', event.blackRemainingTime));
            dispatch(finishGame(event.gameResult));
            break;
        case GameEvents.OfferDraw:
            dispatch(gameActions.setOpponentOfferedDraw(true));
            break;
        case GameEvents.AcceptDraw:
            dispatch(finishGame(GameResultEnum.DrawAccepted));
            break;
        case GameEvents.Resign:
            dispatch(finishGame(event.gameResult));
            break;
    }
};

const finishGame = (gameResult: GameResultEnum): BaseThunkType<ActionsType, void> => (dispatch, getState) => {
    dispatch(gameActions.setGameStatus(GameStatusEnum.Finished));
    dispatch(gameActions.setGameResult(gameResult));
    const curTimer = getState().game.timer;
    if (curTimer) clearInterval(curTimer);
};

export type GameInitialStateType = typeof initialState;
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

type MoveMessageType = {
    type: 'move',
    move: MoveType,
    whiteRemainingTime: number | null,
    blackRemainingTime: number | null,
}
type StartGameMessageType = {
    eventType: typeof GameEvents.StartGame,
    opponentId: number,
    opponentName: string,
    opponentRating: number,
    opponentProfilePicture: string,
    color: Color,
    timeControl: { game: number },
};
type TimeoutMessageType = {
    eventType: typeof GameEvents.Timeout,
    opponentId: number,
    gameResult: GameResultEnum,
    whiteRemainingTime: number,
    blackRemainingTime: number,
};
type OfferDrawMessageType = {
    eventType: typeof GameEvents.OfferDraw,
    opponentId: number,
};
type AcceptDrawMessageType = {
    eventType: typeof GameEvents.AcceptDraw,
    opponentId: number,
};
type DeclineDrawMessageType = {
    eventType: typeof GameEvents.DeclineDraw,
    opponentId: number,
};
type ResignMessageType = {
    eventType: typeof GameEvents.Resign,
    opponentId: number,
    gameResult: GameResultEnum,
};
type EventMessageType = { type: 'event' } & (StartGameMessageType | TimeoutMessageType | OfferDrawMessageType | AcceptDrawMessageType | DeclineDrawMessageType | ResignMessageType);
export type MessageType = MoveMessageType | EventMessageType;
type MoveRecordType = {
    move: MoveType,
    notation: string,
};