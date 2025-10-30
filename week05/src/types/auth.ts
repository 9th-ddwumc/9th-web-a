import type { CommonResponse } from "./common";

export type RequestSignupDto ={
    name : string,
    email: string,
    password: string,
    bio?: string,
    avatar?: string,
}

export type ResponseSignupDto = CommonResponse &{
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
export type ResponseSigninDto= CommonResponse &{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}

export type ResponseMyInfo = CommonResponse &{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
}