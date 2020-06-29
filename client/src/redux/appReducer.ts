import { InferActionsTypes, BaseThunkType } from "./store";
import { getAuthUserData } from "./authReducer";
import ChessPosition, { classUpdate } from '../utils/ChessPosition';

const initialState = {
    initialized: false,
};

export const appReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET_INITIALIZED':
            return {...state, initialized: action.initialized};
        default:
            return state;
    }
};

const actions = {
    setInitialized: (initialized: boolean) => ({ type: 'APP/SET_INITIALIZED', initialized } as const),
};

export const initializeApp = (): ThunkType => (dispatch) => {
    return Promise.all([
        dispatch(getAuthUserData()),
        dispatch(loadScript()),
    ])
    .then(() => {
        dispatch(actions.setInitialized(true));
    });
};

const loadScript = () => () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "/libs";
        script.onload = () => {
            classUpdate((window as Window & typeof globalThis & {ChessPosition: typeof ChessPosition}).ChessPosition);
            resolve();
        }
        document.body.appendChild(script);
    });
}

type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType>;