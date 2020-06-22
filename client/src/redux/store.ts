import { combineReducers, createStore, applyMiddleware, Action } from "redux";
import { reducer as formReducer } from "redux-form";
import thunkMiddleware, { ThunkAction } from "redux-thunk";

import { authReducer } from "./authReducer";
import { appReducer } from "./appReducer";
import { gameReducer } from "./gameReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    form: formReducer,
    app: appReducer,
    game: gameReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;

export type AppStateType = ReturnType<typeof rootReducer>;

export type BaseThunkType<A extends Action, R = Promise<void>> = ThunkAction<R, AppStateType, unknown, A>;

export type InferActionsTypes<T> = T extends { [key: string]: (...args: any) => infer U } ? U : never;