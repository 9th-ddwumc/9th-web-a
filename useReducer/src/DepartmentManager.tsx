import React, { useReducer, useState, type KeyboardEvent } from 'react';

// 1. 상태 및 액션 인터페이스 정의
interface IState {
  department: string;
  error: string | null;
}

type Action = 
  | { type: 'CHANGE_DEPARTMENT'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null };

// 2. 초기 상태 정의
const initialState: IState = {
  department: 'CARD MAKER', 
  error: null,
};

// 3. 리듀서 함수 작성 - 모든 직무 허용으로 변경
function reducer(state: IState, action: Action): IState {
  switch (action.type) {
    case 'CHANGE_DEPARTMENT': {
      const newDepartment = action.payload.trim();
      
      // 빈 값 체크만 수행
      if (newDepartment === '') {
        return {
          ...state,
          error: '직무명을 입력해 주세요.',
        };
      }
      
      // 모든 직무 허용
      return {
        ...state, 
        department: newDepartment.toUpperCase(),
        error: null,
      };
    }
    
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
      };
    }

    default:
      return state;
  }
}

// 4. 컴포넌트 작성
const DepartmentManager: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputDepartment, setInputDepartment] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDepartment(e.target.value);
    if (state.error) {
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  };

  const handleChangeDepartment = () => {
    const trimmedInput = inputDepartment.trim();
    
    if (trimmedInput === '') {
      dispatch({ type: 'SET_ERROR', payload: '직무명을 입력해 주세요.' });
      return;
    }
    
    dispatch({ type: 'CHANGE_DEPARTMENT', payload: trimmedInput });
    setInputDepartment('');
  };

  // 엔터키 입력 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputDepartment.trim()) {
      handleChangeDepartment();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      
      {/* 현재 직무 표시 */}
      <h1 className="text-3xl md:text-5xl font-light mb-2 text-center text-gray-400">
        현재 직무:
      </h1>
      <p className="text-6xl md:text-8xl font-extrabold mb-12 text-center tracking-tight text-yellow-400 uppercase">
        {state.department}
      </p>
      
      {/* 에러 메시지 */}
      {state.error && (
        <p className="text-lg font-medium p-4 bg-red-800 text-red-200 border border-red-500 rounded-lg mb-8 w-full max-w-xl text-center">
          {state.error}
        </p>
      )}

      {/* 입력 섹션 */}
      <div className="flex space-x-4 w-full max-w-xl">
        <input
          type="text"
          value={inputDepartment}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} 
          placeholder="변경할 직무명을 입력해 주세요 (Enter 입력 가능)"
          className="flex-grow p-4 text-xl bg-gray-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition duration-200"
        />
        <button 
          onClick={handleChangeDepartment}
          className="px-6 py-4 bg-blue-600 text-white text-xl font-semibold rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-700 disabled:text-gray-400"
          disabled={!inputDepartment.trim()}
        >
          직무 변경
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-12 max-w-lg text-center">
        * 이 예제는 복잡한 상태 변경(직무 변경과 에러 처리)을 `useReducer`로 관리합니다. <br/>
        (모든 직무 변경이 자유롭게 허용됩니다.)
      </p>
    </div>
  );
};

export default DepartmentManager;