// components/PrimeList.tsx
import { memo } from 'react';

interface PrimeListProps {
  primes: number[];
}

// 🚨 React.memo 적용: props.primes의 참조가 변하지 않으면 리렌더링 방지
const PrimeList = memo(({ primes }: PrimeListProps) => {
  console.log('➡️ PrimeList 렌더링됨 (primes.length:', primes.length, ')');
  return (
    <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #eee', padding: '10px' }}>
      <h4>소수 목록 (일부):</h4>
      <ul>
        {primes.slice(0, 10).map((prime, index) => ( // 처음 10개만 표시
          <li key={index}>{prime}</li>
        ))}
        {primes.length > 10 && <li>...외 {primes.length - 10}개</li>}
      </ul>
    </div>
  );
});

export default PrimeList;