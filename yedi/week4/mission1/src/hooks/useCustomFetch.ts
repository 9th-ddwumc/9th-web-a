import { useState, useEffect } from 'react';
import axios from 'axios';

const useCustomFetch = <T,>(endpoint: string, params: Record<string, any> = {}) => {
  // API로부터 받아온 데이터를 저장할 state
  const [data, setData] = useState<T | null>(null);
  // 로딩 상태를 저장할 state
  const [loading, setLoading] = useState<boolean>(true);
  // 에러 상태를 저장할 state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await axios.get(
          `https://api.themoviedb.org/3${endpoint}`, // 기본 URL과 endpoint 결합
          {
            params: {
              api_key: apiKey,
              language: 'ko-KR',
              ...params, // 페이지 번호 등 추가 파라미터
            },
          }
        );
        setData(response.data);
      } catch (err) {
        setError('에러가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // endpoint나 params가 변경될 때마다 API를 다시 호출
  }, [endpoint, JSON.stringify(params)]); 

  return { data, loading, error };
};

export default useCustomFetch;