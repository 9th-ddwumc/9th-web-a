// pages/UseMemoPage.tsx
import { useState, useMemo, useCallback, type ChangeEvent } from 'react';
import PrimeList from '../components/PrimeList'; // useMemo 결과를 전달할 자식
import MyTextComponent from '../components/MyTextComponent'; // useCallback 예시 자식

// 🚨 비용이 큰 연산 함수 (컴포넌트 외부에 정의)
// 특정 숫자까지의 소수를 찾는 함수
const findPrimes = (limit: number): number[] => {
  console.time('findPrimes'); // 연산 시간 측정 시작
  const primes: number[] = [];
  const isPrime: boolean[] = new Array(limit + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let p = 2; p * p <= limit; p++) {
    if (isPrime[p]) {
      for (let i = p * p; i <= limit; i += p) {
        isPrime[i] = false;
      }
    }
  }

  for (let p = 2; p <= limit; p++) {
    if (isPrime[p]) {
      primes.push(p);
    }
  }
  console.timeEnd('findPrimes'); // 연산 시간 측정 종료
  return primes;
};

function UseMemoPage() {
  const [limit, setLimit] = useState(10000000); // 소수 계산 상한
  const [text, setText] = useState(''); // 다른 상태 (텍스트 입력)
  const [count, setCount] = useState(0); // 또 다른 상태 (카운트)

  // 1. useMemo 적용: limit 값이 변경될 때만 findPrimes 함수를 재실행
  // 텍스트 입력이나 카운트 변경 시에는 이 연산이 건너뛰어집니다.
  const primeList = useMemo(() => {
    return findPrimes(limit);
  }, [limit]); // 🚨 limit 값이 바뀔 때만 연산을 다시 수행

  // 2. useCallback 적용: textInput 핸들러 함수의 참조를 고정
  // MyTextComponent가 React.memo로 감싸져 있다면 불필요한 리렌더링 방지
  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []); // deps가 비어있으므로 참조가 고정됨

  // 3. useCallback 적용: count 증가 핸들러 함수의 참조를 고정
  const handleCountIncrease = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // deps가 비어있으므로 참조가 고정됨

  console.log('--- UseMemoPage 렌더링 ---');

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1>`useMemo` & `useCallback` 실습</h1>

      {/* 텍스트 입력 필드 */}
      <div>
        <label>텍스트 입력: </label>
        <input 
          type="text" 
          value={text} 
          onChange={handleTextChange} 
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
        <p>입력된 텍스트: {text}</p>
        {/* MyTextComponent에 메모이제이션된 핸들러 전달 */}
        <MyTextComponent onChange={handleTextChange} currentText={text} />
      </div>

      <hr />

      {/* 카운터 */}
      <div>
        <h2>카운트: {count}</h2>
        <button 
          onClick={handleCountIncrease}
          style={{ padding: '10px 20px', backgroundColor: '#e0f7fa', border: 'none', borderRadius: '5px' }}
        >
          카운트 증가
        </button>
      </div>

      <hr />

      {/* 소수 계산 상한 입력 필드 */}
      <div>
        <label>소수 계산 상한: </label>
        <input 
          type="number" 
          value={limit} 
          onChange={(e) => setLimit(Number(e.target.value))} 
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
        <p>계산된 소수 개수 (useMemo): {primeList.length}</p>
        
        {/* PrimeList 컴포넌트에 useMemo 결과 전달 */}
        <PrimeList primes={primeList} />
      </div>
    </div>
  );
}

export default UseMemoPage;