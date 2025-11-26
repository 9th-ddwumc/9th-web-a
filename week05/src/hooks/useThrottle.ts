import { useEffect, useRef, useState } from 'react';

function useThrottle(callback: () => void, delay = 500): () => void {
    const lastExecuted = useRef(0);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    return () => {
        const now = Date.now();

        if (now - lastExecuted.current >= delay) {
        lastExecuted.current = now;
        callback();
        } else {
        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            lastExecuted.current = Date.now();
            callback();
        }, delay - (now - lastExecuted.current));
        }
    };
}

export default useThrottle;