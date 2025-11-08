// constants/key.ts
export const LOCAL_STORAGE_KEY = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
} as const;

export const QUERY_KEY = {
    lps: 'lps',
    lpDetail: 'lpDetail',      // ✅ 추가
    myInfo: 'myInfo',           // ✅ 추가
} as const;