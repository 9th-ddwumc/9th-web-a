/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const useLocalStorage = (key: string) => {
    const setItem = (value: unknown) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch(error) {
            console.log(error);
        }
    };
    
    const getItem = (refreshToken: any) => {
        try {
            const item = window.localStorage.getItem(key);
            // null, undefined, 빈 문자열 체크
            if (!item || item === 'undefined' || item === 'null') {
                return null;
            }
            return JSON.parse(item);
        } catch(e) {
            console.log(e);
            return null;
        }
    };
    
    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch(e) {
            console.log(e);
        }
    };
    
    return { setItem, getItem, removeItem };
};