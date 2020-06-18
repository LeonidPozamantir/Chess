import axios from 'axios';

export const authAPI = {
    login: (userName: string, password: string) => {
        return axios.post<APIResponseType>('/auth/login', {userName, password})
        .then(res => res.data);
    },
    me: () => {
        return axios.get<APIResponseType<MeResponseDataType>>('/auth/me')
        .then(res => res.data);
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