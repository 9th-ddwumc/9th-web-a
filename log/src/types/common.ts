import type { PAGINATION_ORDER_TYPE } from "../enums/commmons";

export type CommonResponse = {
    status: boolean;
    statusCode: number;
    message: string;
    data?: any;
};

export type CursorBasedResponse<T> = CommonResponse & {
     status: boolean;
    statusCode: number;
    message: string;
    data?: any;
    nextCuror:number;
    hasNext:boolean;
}

export type PaginationDto = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: PAGINATION_ORDER_TYPE;
}