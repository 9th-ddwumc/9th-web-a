import React, { useReducer, useState } from 'react';

// 1. 상태(State) 정의
interface IState {
  department: string; // 현재 부서/직무 (예: 'Software Developer')
  error: string | null; // 에러 메시지
}

// 2. 액션(Action) 정의
// payload를 포함하는 액션 (직무 변경 요청)
interface IAction {
  type: 'CHANGE_DEPARTMENT';
  payload: string; // 변경하려는 직무 값
}

// 3. 초기 상태 정의
const initialState: IState = {
  department: 'Software Developer',
  error: null,
};

// 4. 리듀서(Reducer) 함수 정의
// (state, action)을 받아서 새로운 state를 반환
function departmentReducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case 'CHANGE_DEPARTMENT': {
      const newDepartment = action.payload;
      
      // 비즈니스 로직: 'Card Maker'가 아니면 에러 발생
      const isInvalidJob = newDepartment !== 'Card Maker'; 

      return {
        // ⭐ 불변성(Immutable) 유지를 위해 스프레드 연산자로 기존 상태 복사
        ...state, 
        
        department: isInvalidJob 
          ? state.department // 에러 발생 시: 기존 부서 유지
          : newDepartment,  // 성공 시: 새 부서로 변경
          
        error: isInvalidJob 
          ? 'Card Maker만 입력 가능합니다.' // 에러 발생 시: 에러 메시지 설정
          : null, // 성공 시: 에러 해제
      };
    }
    default:
      // 정의되지 않은 액션이 들어오면 현재 상태를 그대로 반환
      return state;
  }
}

// 5. 컴포넌트
export default function UseReducerPage() {
  // useReducer 훅으로 상태(state)와 디스패치(dispatch) 함수 생성
  const [state, dispatch] = useReducer(departmentReducer, initialState);

  // Input 필드에 입력되는 값을 관리하는 상태 (useState 사용)
  const [newDepartmentInput, setNewDepartmentInput] = useState('');

  // Input 값 변경 핸들러
  const handleChangeDepartmentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDepartmentInput(e.target.value);
  };

  // 버튼 클릭 핸들러
  const handleJobChangeClick = () => {
    // 디스패치 함수 호출로 상태 변경 요청
    dispatch({ 
      type: 'CHANGE_DEPARTMENT', 
      payload: newDepartmentInput 
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>현재 직무: **{state.department}**</h2>
      
      {/* 에러 메시지 출력 */}
      {state.error && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          에러: {state.error}
        </p>
      )}

      <input
        type="text"
        value={newDepartmentInput}
        onChange={handleChangeDepartmentInput}
        placeholder="변경하시고 싶은 직무를 입력해 주세요"
        style={{ margin: '10px 0', padding: '5px', width: '400px', display: 'block' }}
      />
      
      <button onClick={handleJobChangeClick} style={{ padding: '8px 15px', marginTop: '5px' }}>
        직무 변경하기
      </button>

      {/* 디버깅용 현재 상태 확인 (선택) */}
      {/* <h3 style={{ marginTop: '20px' }}>현재 State 값</h3>
      <pre>{JSON.stringify(state, null, 2)}</pre> 
      */}
    </div>
  );
}

// // 상태 인터페이스
// interface ICounterState {
//   count: number;
// }

// // 액션 인터페이스 (페이로드 없는 간단한 액션)
// interface ICounterAction {
//   type: 'INCREMENT' | 'DECREMENT' | 'RESET';
// }

// // 초기 상태
// const initialCounterState: ICounterState = {
//   count: 0,
// };

// // 리듀서 함수
// function counterReducer(state: ICounterState, action: ICounterAction): ICounterState {
//   switch (action.type) {
//     case 'INCREMENT':
//       // 기존 상태 복사 후 count만 증가
//       return { ...state, count: state.count + 1 };
//     case 'DECREMENT':
//       // 기존 상태 복사 후 count만 감소
//       return { ...state, count: state.count - 1 };
//     case 'RESET':
//       // 기존 상태 복사 후 count를 0으로 초기화
//       return { ...state, count: 0 };
//     default:
//       return state;
//   }
// }

// // 컴포넌트
// export default function ReducerCounter() {
//   const [state, dispatch] = useReducer(counterReducer, initialCounterState);

//   return (
//     <div>
//       <h3>Count: {state.count}</h3>
//       <button onClick={() => dispatch({ type: 'INCREMENT' })}>
//         Increment
//       </button>
//       <button onClick={() => dispatch({ type: 'DECREMENT' })} style={{ margin: '0 5px' }}>
//         Decrement
//       </button>
//       <button onClick={() => dispatch({ type: 'RESET' })}>
//         Reset
//       </button>
//     </div>
//   );
// }