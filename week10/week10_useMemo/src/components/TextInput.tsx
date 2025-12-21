import React, { memo } from 'react';

interface ITextInput {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ITextInput) => {
  console.log("TextInput 렌더링!"); // 렌더링 확인용

  return (
    <input
      type="text"
      className='border p-2 rounded-lg'
      placeholder="텍스트를 입력하세요"
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

// React.memo로 감싸서 props(onChange)가 안 바뀌면 리렌더링 방지
export default memo(TextInput);