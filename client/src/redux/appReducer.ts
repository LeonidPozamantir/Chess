import { InferActionsTypes, BaseThunkType } from "./store";
import { getAuthUserData } from "./authReducer";

const initialState = {
    initialized: false,
};

export const appReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
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
    return dispatch(getAuthUserData())
    .then(() => {
        dispatch(actions.setInitialized(true));
    });
}

type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsTypes>;