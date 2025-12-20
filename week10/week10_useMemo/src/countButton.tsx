import React, { memo } from 'react';

interface ICountButton {
  onClick: () => void;
  count: number;
}

const CountButton = ({ onClick, count }: ICountButton) => {
  console.log("CountButton 렌더링!"); // 렌더링 확인용 로그

  return (
    <button 
      className='border p-2 rounded-lg bg-blue-500 text-white mt-2'
      onClick={onClick}
    >
      카운트 증가 (+10)
    </button>
  );
};

// [핵심] React.memo로 감싸서 불필요한 렌더링 방지
export default memo(CountButton);