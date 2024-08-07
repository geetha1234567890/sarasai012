import axios from 'axios';
import { baseUrl } from '../../utils/baseURL';

const axiosInstance = axios.create({
    baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(async config => {
    const storedata = await localStorage.getItem('accessToken');
    const userData = storedata ? storedata : null;
    console.log(userData, 'userData');
    if (userData) {
        config.headers['authorization'] = `Bearer ${userData}`;
    }
    return config;
});

export default axiosInstance;
