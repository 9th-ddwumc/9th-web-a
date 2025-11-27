import { memo } from 'react';

interface CountButtonProps {
  onClick: (number: number) => void;
  number: number;
}

// 🚨 React.memo 적용: props가 동일하면 리렌더링 방지
const CountButton = memo(({ onClick, number }: CountButtonProps) => {
  console.log('➡️ CountButton 렌더링됨');

  return (
    <button 
      onClick={() => onClick(number)} 
      style={{ padding: '10px 20px', backgroundColor: '#e0f7fa' }}
    >
      카운트 {number} 증가 (Memo 적용됨)
    </button>
  );
});

export default CountButton;