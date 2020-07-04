import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import { MoveType, MessageType, GameInitialStateType, GameEventsEnum } from '../redux/gameReducer';

export const authAPI = {
    login: (userName: string, password: string, rememberMe = false) => {
        return axios.post<APIResponseType<MeResponseDataType>>('/auth/login', { userName, password, rememberMe })
        .then(res => {
            socketAPI.initSocket();
            return res.data;
        });
    },
    me: () => {
        return axios.get<APIResponseType<MeResponseDataType>>('/auth/me')
        .then(res => {
            socketAPI.initSocket();
            return res.data;
        });
    },
    logout: () => {
        return axios.post('/auth/logout')
        .then(res => res.data);
    },
    register: (userName: string, password: string, email: string, rememberMe: boolean) => {
        return axios.post<APIResponseType<MeResponseDataType>>('/auth/register', { userName, password, email, rememberMe })
        .then(res => res.data);
    },
};

export const profileAPI = {
    saveSettings: (email: string, rating: number | null) => {
        return axios.post<APIResponseType>('/profile/saveSettings', { email, rating })
        .then(res => res.data);
    },
    getProfile: () => {
        return axios.get<APIResponseType<SettingsResponseDataType>>('/profile')
        .then(res => res.data);
    },
};

export const socketAPI = {
    callback: null as Function | null,
    socket: null as SocketIOClient.Socket | null,
    initSocket: function() {
        this.socket = io();
        this.socket.on('message', (message: MessageType) => {
            if (this.callback) {
                this.callback(message);
            }
        });
    },
    setCallback: function(callback: Function) {
        this.callback = callback;
    },
    send(message: OutgoingMessageType) {
        this.socket?.send(message);
    }
};

export const gameAPI = {
    requestStartGame: function() {
        return axios.post<APIResponseType>('/game/request')
        .then(res => res.data);
    },
    makeMove: function(move: MoveType) {
        socketAPI.send({ move });
        return Promise.resolve();
    },
    getFullGameState: function() {
        return axios.get<APIResponseType<GameInitialStateType>>('/game/state')
        .then(res => res.data);
    }
};

export enum ResultCodesEnum {
    Success = 0,
    Error = 1,
};

export type APIResponseType<D = {}, RC = ResultCodesEnum> = {
    data: D,
    resultCode: RC,
    messages: Array<string>,
};

type MeResponseDataType = {
    userName?: string,
    rating?: number,
};

type SettingsResponseDataType = {
    email?: string,
    rating?: number,
};

type OutgoingMessageType = { move?: MoveType, action?: GameEventsEnum };