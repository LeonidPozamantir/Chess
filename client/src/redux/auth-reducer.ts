import { authAPI, ResultCodesEnum } from "../api/api";
import { BaseThunkType } from "./store";
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

export const login = (userName: string, password: string): ThunkType => (dispatch) => {
    return authAPI.login(userName, password)
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(setAuthData(userName, true));
        else {
            const errorMessage = data.messages && data.messages.length && data.messages[0] || 'Some error occured';
            dispatch(stopSubmit('login', {_error: errorMessage}));
        }
    });
};

export const getAuthUserData = (): ThunkType => (dispatch) => {
    return authAPI.me()
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(setAuthData(data.data.userName as string, true));
        else dispatch(setAuthData(null, false));
    });
};


type InitialStateType = typeof initialState;
type setAuthDataReturnType = ReturnType<typeof setAuthData>;
type ActionTypes = setAuthDataReturnType; // TODO
type ThunkType = BaseThunkType<ActionTypes | FormAction>;

export const setAuthData = (userName: string | null, isAuth: boolean) => ({ type: 'AUTH/SET_AUTH_DATA', userName, isAuth } as const);