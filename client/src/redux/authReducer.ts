import { authAPI, ResultCodesEnum } from "../api/api";
import { BaseThunkType, InferActionsTypes } from "./store";
import { FormAction, stopSubmit } from "redux-form";

let initialState = {
    userName: null as string | null,
    email: null as string | null,
    rating: null as number | null,
    profilePicture: null as string | null,
    isAuth: false,
    wasSaved: false,
    errorMessageSavingPicture: null as string | null,
};

export const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch(action.type) {
        case 'AUTH/SET_AUTH_DATA':
            return {...state, userName: action.userName, email: action.email, rating: action.rating, profilePicture: action.profilePicture, isAuth: action.isAuth};
        case 'AUTH/SET_USER_SETTINGS':
            return { ...state, email: action.email, rating: action.rating };
        case 'AUTH/SET_SETTINGS_SAVED':
            return { ...state, wasSaved: action.wasSaved };
        case 'AUTH/SET_PROFILE_PICTURE':
            return { ...state, profilePicture: action.profilePicture };
        case 'AUTH/SET_ERROR_SAVING_PICTURE':
            return { ...state, errorMessageSavingPicture: action.errorMessageSavingPicture };
        default:
            return state;
    }
};

export const actions = {
    setAuthData: (userName: string | null, email: string | null, rating: number | null, profilePicture: string | null, isAuth: boolean) => ({ type: 'AUTH/SET_AUTH_DATA', userName, email, rating, profilePicture, isAuth } as const),
    setUserSettings: (email: string, rating: number | null) => ({ type: 'AUTH/SET_USER_SETTINGS', email, rating } as const),
    setProfileSaved: (wasSaved: boolean) => ({ type: 'AUTH/SET_SETTINGS_SAVED', wasSaved } as const),
    setProfilePicture: (profilePicture: string) => ({ type: 'AUTH/SET_PROFILE_PICTURE', profilePicture } as const),
    setErrorSavingPicture: (errorMessageSavingPicture: string | null) => ({ type: 'AUTH/SET_ERROR_SAVING_PICTURE', errorMessageSavingPicture } as const),
};

export const login = (userName: string, password: string, rememberMe: boolean): ThunkType => (dispatch) => {
    return authAPI.login(userName, password, rememberMe)
    .then(data => {
        const { userName, email, rating, profilePicture } = data.data;
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(userName as string, email as string, rating as number, profilePicture as string | null, true));
        else {
            const errorMessage = data.messages && data.messages.length && data.messages[0] || 'Some error occured';
            dispatch(stopSubmit('login', { _error: errorMessage }));
        }
    });
};

export const register = (userName: string, password: string, email: string, rememberMe: boolean): ThunkType => (dispatch) => {
    return authAPI.register(userName, password, email, rememberMe)
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(userName, email, data.data.rating as number, null, true));
        else {
            const errorMessage = data.messages && data.messages.length && data.messages[0] || 'Some error occured';
            dispatch(stopSubmit('register', { _error: errorMessage }));
        }
    });
}

export const logout = (): ThunkType => (dispatch) => {
    return authAPI.logout()
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) dispatch(actions.setAuthData(null, null, null, null, false));
    });
};

export const getAuthUserData = (): ThunkType => (dispatch) => {
    return authAPI.me()
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) {
            const { userName, email, rating, profilePicture } = data.data;
            dispatch(actions.setAuthData(userName as string, email as string, rating as number, profilePicture as string | null, true));
        }
        else dispatch(actions.setAuthData(null, null, null, null, false));
    });
};

export const saveSettings = (email: string, rating: number | null): ThunkType => dispatch => {
    return authAPI.saveSettings(email, rating)
    .then(data => {
        dispatch(actions.setUserSettings(email, rating));
        dispatch(actions.setProfileSaved(true));
    })
    .catch(e => {
        console.log(e);
    });
};

export const saveProfilePicture = (file: File): ThunkType => dispatch => {
    return authAPI.saveProfilePicture(file)
    .then(data => {
        if (data.resultCode === ResultCodesEnum.Success) {
            dispatch(actions.setProfilePicture(data.data.fileLink));
            dispatch(actions.setErrorSavingPicture(null));
        } else {
            const errorMessage = data.messages && data.messages.length && data.messages[0] || 'Some error occured';
            dispatch(actions.setErrorSavingPicture(errorMessage));
        }
    })
    .catch(err => {
        dispatch(actions.setErrorSavingPicture('Some error occured'));
        console.log(err)
    });
};


type InitialStateType = typeof initialState;
type setAuthDataReturnType = InferActionsTypes<typeof actions>;
type ActionsType = setAuthDataReturnType; // TODO
type ThunkType = BaseThunkType<ActionsType | FormAction>;