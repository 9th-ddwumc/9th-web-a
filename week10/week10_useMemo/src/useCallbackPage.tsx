import React, { useState, useCallback } from 'react';
import CountButton from './countButton';
import TextInput from './TextInput';

export default function UseCallbackPage() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>('');

  // [핵심 1] useCallback으로 함수 재생성 방지
  // 의존성 배열에 [count]를 넣어, count가 변할 때만 함수를 새로 만듦
  const handleIncreaseCount = useCallback(() => {
    setCount((prev) => prev + 10); 
    // 영상에서는 setCount(count + 10)과 [count] 의존성을 사용했지만,
    // 최신 리액트 패턴인 함수형 업데이트(prev => prev + 10)를 쓰면 의존성을 비울 수도 있습니다.
    // 영상의 최종 흐름에 맞춰 [count] 의존성을 유지하는 형태로 작성했습니다.
  }, [count]);

  // [핵심 2] 텍스트 변경 핸들러
  // 의존성 배열이 []이므로 컴포넌트가 리렌더링 되어도 함수는 재생성되지 않음 (주소 유지)
  const handleText = useCallback((text: string) => {
    setText(text);
  }, []);

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <h1 className='text-2xl font-bold mb-4'>같이 배우는 리액트 : useCallback 편</h1>
      
      <h2 className='text-xl'>Count: {count}</h2>
      {/* Memoized된 컴포넌트에 Memoized된 함수 전달 */}
      <CountButton onClick={handleIncreaseCount} count={count} />

      <div className='mt-4 flex flex-col items-center gap-2'>
        <h2 className='text-xl'>Text: {text}</h2>
        {/* Memoized된 컴포넌트에 Memoized된 함수 전달 */}
        <TextInput onChange={handleText} />
      </div>
    </div>
  );
}