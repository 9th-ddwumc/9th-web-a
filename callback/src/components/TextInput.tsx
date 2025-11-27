import { memo, type ChangeEvent } from 'react';

interface TextInputProps {
  onChange: (value: string) => void;
}

// 🚨 React.memo 적용: props가 동일하면 리렌더링 방지
const TextInput = memo(({ onChange }: TextInputProps) => {
  console.log('➡️ TextInput 렌더링됨');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input 
      type="text" 
      onChange={handleChange} 
      placeholder="텍스트 입력 (Memo 적용됨)"
      style={{ padding: '10px', border: '1px solid #00acc1' }}
    />
  );
});

export default TextInput;