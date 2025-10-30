import { axiosInstance } from "../apis/axios";
import type { CommonResponse } from "./common"

export type RequestSignupDto = {
    name: string,
    email: string,
    password: string,
    bio?: string,
    avatar?: string,
}

export type ResponseSignupDto = CommonResponse & {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type RequestSigninDto = {
    email: string;
    password: string
}

export type ResponseSigninDto = CommonResponse & {
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}

export type ResponseMyInfo = CommonResponse & {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
}

export const postSignup = async(body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post('/v1/auth/signup', body);
    return data;
}

export const postSignin = async(body: RequestSigninDto): Promise<ResponseSigninDto> => {
    try {
        const response = await axiosInstance.post('/v1/auth/signin', body);
        console.log('Signin response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Signin error:', error.response?.data || error.message);
        throw error;
    }
}

export const getMyInfo = async (): Promise<ResponseMyInfo> => {
    const { data } = await axiosInstance.get('/v1/users/me');
    console.log('MyInfo API response:', data); // 디버깅용
    
    // CommonResponse 구조인 경우 data.data에서 정보 추출
    if (data.data) {
        return {
            ...data,
            ...data.data
        };
    }
    
    // 이미 평탄화된 구조인 경우 그대로 반환
    return data;
}

export const postLogout = async(): Promise<CommonResponse> => {
    const { data } = await axiosInstance.post('/v1/auth/logout');
    return data;
}