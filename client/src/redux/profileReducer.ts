import { InferActionsTypes, BaseThunkType } from "./store";
import { profileAPI } from "../api/api";
import { FormAction } from "redux-form";

const initialState = {
    email: null as string | null,
    rating: null as number | null,
    wasSaved: false,
};

export const profileReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch(action.type) {
        case 'PROFILE/SET_USER_PROFILE':
            return { ...state, email: action.email, rating: action.rating };
        case 'PROFILE/SET_PROFILE_SAVED':
            return { ...state, wasSaved: action.wasSaved };
        default:
            return state;
    }
};

export const actions = {
    setUserProfile: (email: string, rating: number | null) => ({ type: 'PROFILE/SET_USER_PROFILE', email, rating } as const),
    setProfileSaved: (wasSaved: boolean) => ({ type: 'PROFILE/SET_PROFILE_SAVED', wasSaved } as const),
};

export const getUserProfile = (): ThunkType => dispatch => {
    return profileAPI.getProfile()
    .then(data => {
        if(data.resultCode === 0) {
            dispatch(actions.setUserProfile(data.data.email as string, data.data.rating as number));
        }
    });
};

export const saveSettings = (email: string, rating: number | null): ThunkType => dispatch => {
    return profileAPI.saveSettings(email, rating)
    .then(data => {
        dispatch(actions.setUserProfile(email, rating));
        dispatch(actions.setProfileSaved(true));
    })
    .catch(e => {
        console.log(e);
    });
}

type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType & FormAction>