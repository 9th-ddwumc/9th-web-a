// src/components/WelcomeData.tsx (TanStack Query 버전)

import { useState } from 'react';
// 1. useQuery 임포트
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

// 2. 비동기 fetch 함수 분리
const fetchUser = async (userId: number): Promise<User> => {
  console.log(`[React Query 요청]: ${userId}`);
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export function WelcomeData() {
  const [userId, setUserId] = useState(1);
  
  // 3. useQuery 사용
  const { data: user, isPending, isError } = useQuery({
    // 쿼리 키 (URL 대신 사용): userId가 바뀌면 자동 refetch 
    queryKey: ['user', userId], 
    // 쿼리 함수 (데이터 가져오기) [00:59:11]
    queryFn: () => fetchUser(userId),
    
    staleTime: 5 * 1000, // 캐시 시간 (staleTime) 
    retry: 3, // 재시도 횟수
    retryDelay: (attemptIndex) => Math.pow(2, attemptIndex) * 1000, // 지수 백오프 
  });
  
  const handleNextUser = () => setUserId((prevId) => prevId + 1);
  const handlePrevUser = () => setUserId((prevId) => (prevId > 1 ? prevId - 1 : 1));
  const handleFetchError = () => setUserId(9999);

  return (
    <div>
      <h1>TanStack Query (비교)</h1>
      <button onClick={handlePrevUser} disabled={userId === 1}>
        이전 사용자
      </button>
      <button onClick={handleNextUser}>
        다음 사용자
      </button>
      <button onClick={handleFetchError}>
        에러 테스트 (404)
      </button>

      <h2>사용자 정보 (ID: {userId})</h2>
      
      {isPending && <div>로딩 중...</div>}
      {isError && <div>데이터를 불러오는 데 실패했습니다.</div>}
      {!isPending && !isError && user && (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      )}
    </div>
  );
}