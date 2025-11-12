import type { CursorBasedResponse } from "./common.ts";
import type { CommonResponse } from "./common"; // CommonResponse 타입 추가

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

// ✅ 추가: LP 생성/수정 요청 DTO
export type RequestLpCreateDto = {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[]; // 태그 이름 문자열 배열
};

// ✅ 추가: LpDetail 타입
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

// ✅ 추가: LpDetail 응답 타입
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