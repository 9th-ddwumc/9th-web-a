import { useStore } from '../store/useStore.ts'; 

const Modal = () => {
  // 개별 selector로 가져오기 (최적화)
  const clearCart = useStore((state) => state.clearCart);
  const closeModal = useStore((state) => state.closeModal);

  return (
    <aside className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm text-center">
        <h4 className="text-xl font-semibold mb-6 text-gray-800">정말 삭제하시겠습니까?</h4>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 border-2 border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-50 transition font-bold"
            onClick={closeModal}
          >
            아니요
          </button>
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition font-bold"
            onClick={() => {
              clearCart();
              closeModal();
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