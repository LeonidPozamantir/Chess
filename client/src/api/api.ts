import axios from 'axios';

export const login = () => {
    return axios.get('/auth/login')
    .then(res => res.data);
};