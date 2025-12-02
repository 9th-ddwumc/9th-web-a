// src/components/Modal.tsx
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart } from '../features/cart/cartSlice';

const Modal = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.modal);

  if (!isOpen) return null; // 닫혀 있으면 아무 것도 렌더링 X

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 어두운 배경 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 모달 카드 */}
      <div className="relative bg-white rounded-xl shadow-lg px-8 py-6 w-72 text-center">
        <p className="font-semibold mb-6">정말 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-3">
          <button
            className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 text-sm hover:bg-slate-200"
            onClick={handleCancel}
          >
            아니요
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
            onClick={handleConfirm}
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
