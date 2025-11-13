export const PAGINATION_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

// 타입으로 사용할 유니온 타입
export type PAGINATION_ORDER_TYPE = typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER];