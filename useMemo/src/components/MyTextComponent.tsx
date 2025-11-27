// components/MyTextComponent.tsx
import { memo, type ChangeEvent } from 'react';

interface MyTextComponentProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  currentText: string;
}

// 🚨 React.memo 적용: props가 동일하면 리렌더링 방지
const MyTextComponent = memo(({ onChange, currentText }: MyTextComponentProps) => {
  console.log('➡️ MyTextComponent 렌더링됨');
  return (
    <div style={{ marginTop: '10px' }}>
      <label>MyTextComponent 안에서 입력: </label>
      <input 
        type="text" 
        onChange={onChange} // useCallback으로 감싸진 핸들러 사용
        value={currentText} // 부모로부터 받은 현재 텍스트
        style={{ padding: '8px', border: '1px solid #c8e6c9' }}
      />
      <p>컴포넌트 내 텍스트: {currentText}</p>
    </div>
  );
});

export default MyTextComponent;