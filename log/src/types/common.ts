import type { PAGINATION_ORDER_TYPE } from "../enums/commmons";

export type CommonResponse = {
    status: boolean;
    statusCode: number;
    message: string;
    data?: any;
};

export type CursorBasedResponse<T> = CommonResponse & {
    data: T; // ✅ 타입 수정: 실제 데이터 구조를 T로 감쌉니다.
    nextCursor: number | null; // ✅ 타입 수정: 오타 수정 및 null 허용
    hasNext: boolean;
}

export type PaginationDto = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: PAGINATION_ORDER_TYPE;
}