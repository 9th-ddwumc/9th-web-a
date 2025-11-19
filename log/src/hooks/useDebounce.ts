// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value
 * Useful for search inputs to avoid excessive API calls
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

// Usage example in HomePage.tsx:
/*
import useDebounce from '../hooks/useDebounce';

const MainPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    
    const { data, isLoading } = useGetInfiniteLpList({ 
        search: debouncedSearch,  // Use debounced value
        order, 
        limit: 20 
    });
    
    // Now typing in the search box won't trigger API calls 
    // until user stops typing for 500ms
}
*/