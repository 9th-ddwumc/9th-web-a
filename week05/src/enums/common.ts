export const PAGINATION_ORDER_VALUE = {
    ASC: 'asc',
    DESC: 'desc',
    NEWEST: 'newest',
    OLDEST: 'oldest',
} as const; 

// 2. 타입 정의 (객체의 값들로 유니온 타입 생성)
export type PAGINATION_ORDER = typeof PAGINATION_ORDER_VALUE[keyof typeof PAGINATION_ORDER_VALUE];