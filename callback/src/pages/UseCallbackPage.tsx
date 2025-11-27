import { useState, useCallback } from 'react';
import CountButton from '../components/CountButton'; 
import TextInput from '../components/TextInput';     

function UseCallbackPage() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 1. 카운트 증가 핸들러: 함수형 업데이트를 사용하여 외부 상태(count)에 의존하지 않으므로, 
  // deps를 비워 참조를 완벽히 고정합니다. (Stale Closure 문제 회피)
  const handleIncreaseCount = useCallback((delta: number) => {
    setCount(prevCount => prevCount + delta);
  }, []);

  // 2. 텍스트 변경 핸들러: 외부 상태에 의존하지 않으므로 deps를 비워 참조를 고정합니다.
  const handleTextChange = useCallback((value: string) => {
    setText(value);
  }, []);

  console.log('--- UseCallbackPage 렌더링 ---');

  return (
    <div style={{ padding: '20px' }}>
      <h1>React 렌더링 최적화 실습</h1>
      
      <h2>카운트: {count}</h2>
      {/* handleIncreaseCount의 참조가 고정되어 count가 아닌 text가 변해도 리렌더링되지 않음 */}
      <CountButton 
        onClick={handleIncreaseCount} 
        number={10}
      />
      
      <hr style={{ margin: '20px 0' }} />
      
      <h2>텍스트: {text}</h2>
      {/* handleTextChange의 참조가 고정되어 text가 아닌 count가 변해도 리렌더링되지 않음 */}
      <TextInput 
        onChange={handleTextChange} 
      />
    </div>
  );
}

export default UseCallbackPage;