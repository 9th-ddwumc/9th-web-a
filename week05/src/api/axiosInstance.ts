import axios, { type AxiosInstance } from 'axios';

// 💡 API 통신을 위한 기본 설정
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { axiosInstance };