import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice'; 
import { closeModal } from '../features/modal/modalSlice';

const Modal = () => {
  const dispatch = useDispatch();

  return (
    // 모달 오버레이 레이어: 전체 화면을 덮고 어두운 반투명 배경색 설정
    <aside className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center">
      {/* 모달 박스 */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm text-center">
        <h4 className="text-xl font-semibold mb-6 text-gray-800">정말 삭제하시겠습니까?</h4>
        <div className="flex justify-center gap-4">
          {/* '아니요' 버튼: closeModal() 호출 */}
          <button
            className="px-6 py-2 border-2 border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-50 transition font-bold"
            onClick={() => dispatch(closeModal())}
          >
            아니요
          </button>
          {/* '네' 버튼: clearCart() 호출 후 closeModal() 호출 */}
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition font-bold"
            onClick={() => {
              dispatch(clearCart()); // 장바구니 모두 삭제
              dispatch(closeModal()); // 모달 닫기
            }}
          >
            네
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Modal;