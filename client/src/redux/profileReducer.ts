import { InferActionsTypes, BaseThunkType } from "./store";
import { FormAction } from "redux-form";

const initialState = {

};

export const profileReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch(action.type) {
        default:
            return state;
    }
};

export const actions = {
    fakeAction: () => ({ type: 'fake' })
};


type InitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actions>;
type ThunkType = BaseThunkType<ActionsType & FormAction>