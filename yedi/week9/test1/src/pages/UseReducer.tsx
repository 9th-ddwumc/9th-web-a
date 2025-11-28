import React, { useReducer, useState } from 'react';

interface IState {
  department: string;
  error: string | null;
}

interface IAction {
  type: 'CHANGE_DEPARTMENT';
  payload: string;
}

//  Reducer함수 정의 - 상태 변경 로직을 여기서 모두 처리
function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case 'CHANGE_DEPARTMENT':
      const newDepartment = action.payload;
      const isError = newDepartment !== 'Card Maker';

      if (isError) {
        return {
          ...state, // 기존 상태 유지
          error: 'Card Maker만 입력 가능',
        };
      } else {
        return {
          department: newDepartment, // 직무 변경
          error: null, 
        };
      }
    default:
      return state;
  }
}

export default function UseReducerPractice() {
  //  useReducer 훅 사용 
  const [state, dispatch] = useReducer(reducer, {
    department: 'Software Developer',
    error: null,
  });

  // 인풋 입력을 위한 로컬 State (단순 입력값은 useState가 편함)
  const [inputVal, setInputVal] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  // 버튼 클릭 시 dispatch로 액션 전달
  const handleClick = () => {
    dispatch({
      type: 'CHANGE_DEPARTMENT',
      payload: inputVal,
    });
  };

  return (
    <div className="p-10 flex flex-col gap-5 border rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">useReducer 실습: 직무 전환</h2>
      
      {/* 현재 직무 표시 */}
      <div className="flex items-center gap-2">
        <span className="font-semibold">현재 직무:</span>
        <h1 className="text-3xl font-bold text-blue-600">{state.department}</h1>
      </div>

      {/* 에러 메시지 표시 (에러가 있을 때만 렌더링) */}
      {state.error && (
        <p className="text-red-500 font-bold text-lg">🚨 {state.error}</p>
      )}

      {/* 입력 필드 */}
      <input
        type="text"
        value={inputVal}
        onChange={handleInputChange}
        placeholder="변경하고 싶은 직무 입력"
        className="border p-2 rounded text-black"
      />

      {/* 변경 버튼 */}
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        직무 변경하기
      </button>
    </div>
  );
}