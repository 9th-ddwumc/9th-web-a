// src/components/Modal.tsx

import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useCustomRedux';
import { closeModal } from '../slices/modalSlice'; // modalSlice 액션
import { clearCart } from '../slices/cartSlice'; // cartSlice 액션 (장바구니 비우기 재활용)

const Modal: React.FC = () => {
  const dispatch = useAppDispatch();
  // Redux 상태에서 모달의 열림 상태를 구독 (useState 사용 안함)
  const { isOpen } = useAppSelector((state) => state.modal); 

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  // 아니요 버튼 핸들러: 모달 닫기
  const handleClose = () => {
    dispatch(closeModal()); 
  };

  // 네 버튼 핸들러: 장바구니 비우기 액션 호출 후 모달 닫기
  const handleConfirmClear = () => {
    dispatch(clearCart()); // 1. 장바구니 비우기
    dispatch(closeModal()); // 2. 모달 닫기
  };

  return (
    // 1. 오버레이 레이어 (전체 화면 덮기, 어두운 반투명 배경)
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
      
      {/* 2. 모달 박스 */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800">장바구니 비우기 확인</h2>
        <p className="text-gray-600 mb-6">정말로 장바구니의 모든 아이템을 삭제하시겠습니까?</p>
        
        {/* 3. 버튼 영역 */}
        <div className="flex justify-end space-x-3">
          {/* 아니요 버튼: closeModal() 호출 */}
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            아니요
          </button>
          
          {/* 네 버튼: clearCart() 후 closeModal() 호출 */}
          <button
            onClick={handleConfirmClear}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;