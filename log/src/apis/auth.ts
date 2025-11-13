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

// ✅ PATCH /v1/users (유저 정보 수정)
export const putUserMe = async (body: RequestUserUpdateDto): Promise<ResponseMyInfo> => {
    const { data } = await axiosInstance.patch('/v1/users', body);
    return data;
}

// ✅ DELETE /v1/users (회원 탈퇴)
export const deleteUser = async(): Promise<CommonResponse> => {
    const { data } = await axiosInstance.delete('/v1/users');
    return data;
}