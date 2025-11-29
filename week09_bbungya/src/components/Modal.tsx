// src/components/Modal.tsx

import React from 'react';
// import { useAppDispatch, useAppSelector } from '../hooks/useCustomRedux';
// import { closeModal } from '../slices/modalSlice'; // modalSlice 액션
// import { clearCart } from '../slices/cartSlice'; // cartSlice 액션 (장바구니 비우기 재활용)
import { useModalStore } from '../hooks/useModalStore';
import { useCartStore } from '../hooks/useCartStore';

const Modal: React.FC = () => {
  // 1. 모달 상태 및 닫기 액션 구독
  const { isOpen, closeModal } = useModalStore(); 
  
  // 2. 장바구니 초기화 액션 구독
  const clearCart = useCartStore((state) => state.clearCart);

  // 모달이 닫혀있으면 렌더링하지 않음 (렌더링 제어)
  if (!isOpen) {
    return null;
  }

  // "아니요" 버튼 핸들러: 모달만 닫기
  const handleClose = () => {
    closeModal();
  };

  // "네" 버튼 핸들러: 장바구니 비우고 모달 닫기
  const handleConfirmClear = () => {
    clearCart(); // 장바구니 아이템 모두 삭제 (액션 재활용)
    closeModal(); // 모달 닫기
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