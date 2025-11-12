// src/apis/auth.ts

import type { CommonResponse } from "../types/common";
import type { 
    RequestSigninDto, 
    RequestSignupDto, 
    ResponseMyInfo, 
    ResponseSigninDto, 
    ResponseSignupDto,
    RequestUserUpdateDto
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post('/v1/auth/signup', body);
    return data;
}

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post('/v1/auth/signin', body);
    // 응답 객체 전체를 반환하여 AuthContext에서 유연하게 토큰을 찾도록 함
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