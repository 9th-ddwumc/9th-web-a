// Axios 인스턴스 및 타입 정의가 필요합니다.

import type { RequestSigninDto, RequestSignupDto, ResponseMyInfo, ResponseSigninDto, ResponseSignupDto } from "../types/auth";
import { axiosInstance } from "./axiosInstance";

export const postSignup = async(body: RequestSignupDto): Promise<ResponseSignupDto> =>{
    const {data} = await axiosInstance.post ('/v1/auth/signup', body)
    return data;
}
export const postSignin = async(body: RequestSigninDto): Promise<ResponseSigninDto> =>{
    const {data} = await axiosInstance.post('/v1/auth/signin', body)
    return data;
}
export const getMyInfo = async():Promise<ResponseMyInfo> =>{
    const {data} = await axiosInstance.post('/v1/users/me');
    return data;
}

export const postLogout = () => {
    return axiosInstance.post('/v1/auth/logout'); // 예시 경로: /auth/logout
};