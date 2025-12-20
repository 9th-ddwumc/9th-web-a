import React, { useState, useMemo, useCallback } from 'react';
import TextInput from './components/TextInput'; // 아래 3번 코드 참조
import { findPrimes } from './utils/math'; // 위 1번 코드 참조

export default function UseMemoPage() {
  const [limit, setLimit] = useState<number>(10000); // 소수 찾기 범위
  const [text, setText] = useState<string>('');      // 무관한 텍스트 입력

  // [핵심 1] useMemo를 통한 연산 결과 캐싱
  // limit 값이 변할 때만 무거운 findPrimes 함수를 재실행합니다.
  // text가 변해서 컴포넌트가 리렌더링 되어도 이 연산은 건너뜁니다.
  const primes = useMemo(() => {
    return findPrimes(limit);
  }, [limit]); 

  // [부가 최적화] 자식 컴포넌트(TextInput) 렌더링 방지용
  const handleTextChange = useCallback((text: string) => {
    setText(text);
  }, []);

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(e.target.value));
  };

  return (
    <div className='flex flex-col justify-center items-center min-h-screen p-10'>
      <h1 className='text-2xl font-bold mb-4'>
        같이 배우는 리액트 : useMemo 편
      </h1>

      {/* 1. 숫자 입력 (소수 찾기 범위) */}
      <div className='flex flex-col gap-2 mb-4'>
        <label className='font-bold'>숫자 입력 (소수 찾기 범위)</label>
        <input 
          type="number" 
          value={limit} 
          onChange={handleLimitChange}
          className='border p-2 rounded-lg'
        />
      </div>

      {/* 2. 텍스트 입력 (리렌더링 유발 테스트용) */}
      <div className='flex flex-col gap-2 mb-4'>
        <label className='font-bold'>다른 텍스트 입력 (렌더링 테스트)</label>
        <TextInput onChange={handleTextChange} />
        <p>입력된 텍스트: {text}</p>
      </div>

      {/* 3. 소수 리스트 출력 */}
      <h2 className='text-xl font-bold mb-2'>소수 리스트 ({primes.length}개)</h2>
      <div className='flex flex-wrap gap-2 w-full break-all'>
        {primes.map((prime) => (
          <span key={prime} className='bg-gray-200 p-1 rounded text-sm'>
            {prime}
          </span>
        ))}
      </div>
    </div>
  );
}