// src/types/lp.ts
import type { CursorBasedResponse } from "./common.ts";
import type { CommonResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

// LP 생성/수정 요청 DTO 이름 통일
export type RequestLpCreateDto = {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[]; // 태그 이름 문자열 배열
    published: boolean; // ✅ published 속성 추가
};

// LpDetail 타입
export interface LpDetail {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author?: {
        id: number;
        name: string;
        avatar?: string;
    };
    tags?: Tag[];
    likes?: Likes[];
}

// LpDetail 응답 타입
export type ResponseLpDetailDto = CommonResponse & {
    data: LpDetail;
};

export type ResponseLpListDto = CursorBasedResponse<{
  data: {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[]; 
    likes: Likes[]; 
  }[];
}>;