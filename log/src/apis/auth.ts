import type { RequestSigninDto, RequestSignupDto, ResponseMyInfo, ResponseSigninDto, ResponseSignupDto } from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post('/v1/auth/signup', body);
    return data;
}

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post('/v1/auth/signin', body);
    console.log('Signin API response:', data);
    return data;
}

export const getMyInfo = async (): Promise<ResponseMyInfo> => {
    const { data } = await axiosInstance.get('/v1/users/me');
    console.log('MyInfo API response:', data);
    
    // ✅ CommonResponse 구조 처리
    if (data.data) {
        return {
            ...data,
            ...data.data
        };
    }
    
    return data;
}

export const postLogout = async (): Promise<void> => {
    // ✅ 로그아웃은 서버 응답이 중요하지 않으므로 try-catch로 감싸지 않음
    await axiosInstance.post('/v1/auth/logout');
}