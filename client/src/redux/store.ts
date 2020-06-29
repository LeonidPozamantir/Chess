import { combineReducers, createStore, applyMiddleware, Action } from "redux";
import { reducer as formReducer } from "redux-form";
import thunkMiddleware, { ThunkAction } from "redux-thunk";

import { authReducer } from "./authReducer";
import { appReducer } from "./appReducer";
import { gameReducer, gameActions } from "./gameReducer";
import { profileReducer } from "./profileReducer";
import { socketAPI } from "../api/api";

const rootReducer = combineReducers({
    auth: authReducer,
    form: formReducer,
    app: appReducer,
    game: gameReducer,
    profile: profileReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

socketAPI.setCallback((message: any) => {
    store.dispatch(gameActions.makeMove(message.move));
})

export default store;

export type AppStateType = ReturnType<typeof rootReducer>;

export type BaseThunkType<A extends Action, R = Promise<void>> = ThunkAction<R, AppStateType, unknown, A>;

export type InferActionsTypes<T> = T extends { [key: string]: (...args: any) => infer U } ? U : never;