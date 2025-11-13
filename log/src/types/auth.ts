// log/src/types/auth.ts

import type { CommonResponse } from "./common";

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
export type RequestUserUpdateDto = {
    name?: string;
    bio?: string | null; // ✅ null 허용
    avatar?: string | null;
}

// ✅ 타입 정의 외의 API 함수 선언/정의는 모두 제거합니다.