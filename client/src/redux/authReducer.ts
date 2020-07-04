import { authAPI, ResultCodesEnum } from "../api/api";
import { BaseThunkType, InferActionsTypes } from "./store";
import { FormAction, stopSubmit } from "redux-form";

let initialState = {
    userName: null as string | null,
    rating: null as number | null,
    isAuth: false,
};

export const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch(action.type) {
        case 'AUTH/SET_AUTH_DATA':
            return {...state, userName: action.userName, rating: action.rating, isAuth: action.isAuth};
        default:
            return state;
    }
};

export const actions = {
    setAuthData: (userName: string | null, rating: number | null, isAuth: boolean) => ({ type: 'AUTH/SET_AUTH_DATA', userName, rating, isAuth } as const),
};

export const login = (userName: string, password: string, rememberMe: boolean): ThunkType => (dispatch) => {
    return authAPI.login(userName, password, rememberMe)
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(userName, data.data.rating as number, true));
        else {
            const errorMessage = data.messages && data.messages.length && data.messages[0] || 'Some error occured';
            dispatch(stopSubmit('login', { _error: errorMessage }));
        }
    });
};

export const register = (userName: string, password: string, email: string, rememberMe: boolean): ThunkType => (dispatch) => {
    return authAPI.register(userName, password, email, rememberMe)
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(userName, data.data.rating as number, true));
        else {
            const errorMessage = data.messages && data.messages.length && data.messages[0] || 'Some error occured';
            dispatch(stopSubmit('register', { _error: errorMessage }));
        }
    });
}

export const logout = (): ThunkType => (dispatch) => {
    return authAPI.logout()
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(null, null, false));
    });
};

export const getAuthUserData = (): ThunkType => (dispatch) => {
    return authAPI.me()
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(data.data.userName as string, data.data.rating as number, true));
        else dispatch(actions.setAuthData(null, null, false));
    });
};

type InitialStateType = typeof initialState;
type setAuthDataReturnType = InferActionsTypes<typeof actions>;
type ActionsType = setAuthDataReturnType; // TODO
type ThunkType = BaseThunkType<ActionsType | FormAction>;