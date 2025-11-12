// log/src/apis/auth.ts

import type { CommonResponse } from "../types/common"; // ✅ CommonResponse는 common.ts에서
import type { 
    RequestSigninDto, 
    RequestSignupDto, 
    ResponseMyInfo, 
    ResponseSigninDto, 
    ResponseSignupDto,
    RequestUserUpdateDto
} from "../types/auth"; // ✅ 나머지 auth 관련 타입은 types/auth에서
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post('/v1/auth/signup', body);
    return data;
}

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post('/v1/auth/signin', body);
    return data; 
}

export const getMyInfo = async (): Promise<ResponseMyInfo> => {
    const { data } = await axiosInstance.get('/v1/users/me');
    console.log('MyInfo API response:', data);
    
    if (data.data) {
        return {
            ...data,
            ...data.data
        };
    }
    
    return data;
}

export const postLogout = async (): Promise<void> => {
    await axiosInstance.post('/v1/auth/logout');
}

export const putUserMe = async (body: RequestUserUpdateDto): Promise<ResponseMyInfo> => {
    const { data } = await axiosInstance.put('/v1/users/me', body);
    return data;
}

export const deleteUser = async(): Promise<CommonResponse> => {
    const { data } = await axiosInstance.delete('/v1/users/me');
    return data;
}