import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import { MoveType } from '../redux/gameReducer';

export const authAPI = {
    login: (userName: string, password: string, rememberMe = false) => {
        return axios.post<APIResponseType>('/auth/login', { userName, password, rememberMe })
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
        return axios.post<APIResponseType>('/auth/register', { userName, password, email, rememberMe })
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
        this.socket.on('message', (message: any) => {
            if (this.callback) {
                this.callback(message);
            }
        });
    },
    setCallback: function(callback: Function) {
        this.callback = callback;
    },
    send(message: any) {
        this.socket?.send(message);
    }
};

export const gameAPI = {
    startGame: function() {
        return axios.post<APIResponseType>('/game/start')
        .then(res => res.data);
    },
    makeMove: function(move: MoveType) {
        socketAPI.send(move);
        return Promise.resolve();
    },
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
};

type SettingsResponseDataType = {
    email?: string,
    rating?: number,
}