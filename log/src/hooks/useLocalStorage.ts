export const useLocalStorage = (key: string) => {
    const setItem = (value: unknown) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('LocalStorage setItem error:', error);
        }
    };
    
    // ✅ 불필요한 파라미터 제거
    const getItem = (defaultValue: any = null) => {
        try {
            const item = window.localStorage.getItem(key);
            // null, undefined, 빈 문자열 체크
            if (!item || item === 'undefined' || item === 'null') {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (error) {
            console.error('LocalStorage getItem error:', error);
            return defaultValue;
        }
    };
    
    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error('LocalStorage removeItem error:', error);
        }
    };
    
    return { setItem, getItem, removeItem };
};