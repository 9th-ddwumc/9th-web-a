import React, { memo } from 'react';

interface ITextInput {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ITextInput) => {
  console.log("TextInput 렌더링!"); // 렌더링 확인용 로그

  return (
    <input
      className='border p-2 rounded-lg mt-2'
      type="text"
      placeholder="텍스트를 입력하세요"
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

// [핵심] React.memo로 감싸서 불필요한 렌더링 방지
export default memo(TextInput);