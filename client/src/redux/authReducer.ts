import { authAPI, ResultCodesEnum } from "../api/api";
import { BaseThunkType, InferActionsTypes } from "./store";
import { FormAction, stopSubmit } from "redux-form";

let initialState = {
    userName: null as string | null,
    isAuth: false,
};

export const authReducer = (state = initialState, action: ActionTypes): InitialStateType => {
    switch(action.type) {
        case 'AUTH/SET_AUTH_DATA':
            return {...state, userName: action.userName, isAuth: action.isAuth};
        default:
            return state;
    }
};

export const actions = {
    setAuthData: (userName: string | null, isAuth: boolean) => ({ type: 'AUTH/SET_AUTH_DATA', userName, isAuth } as const),
};

export const login = (userName: string, password: string, rememberMe: boolean): ThunkType => (dispatch) => {
    return authAPI.login(userName, password, rememberMe)
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(userName, true));
        else {
            const errorMessage = data.messages && data.messages.length && data.messages[0] || 'Some error occured';
            dispatch(stopSubmit('login', {_error: errorMessage}));
        }
    });
};

export const logout = (): ThunkType => (dispatch) => {
    return authAPI.logout()
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(null, false));
    });
};

export const getAuthUserData = (): ThunkType => (dispatch) => {
    return authAPI.me()
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(data.data.userName as string, true));
        else dispatch(actions.setAuthData(null, false));
    });
};

type InitialStateType = typeof initialState;
type setAuthDataReturnType = InferActionsTypes<typeof actions>;
type ActionTypes = setAuthDataReturnType; // TODO
type ThunkType = BaseThunkType<ActionTypes | FormAction>;