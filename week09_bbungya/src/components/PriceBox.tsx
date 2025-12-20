// src/components/PriceBox.tsx

// import { useAppSelector, useAppDispatch } from "../hooks/useCustomRedux";
import { useCartInfo } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore";
// import { openModal } from "../slices/modalSlice";

const PriceBox = () => {
  const openModal = useModalStore((state) => state.openModal);

  // 전역 상태에서 총 가격 (total) 가져오기
//   const { total } = useAppSelector((state) => state.cart);
//   const dispatch = useAppDispatch();
  const { total } = useCartInfo();

  // 장바구니 초기화 (비우기)
  const handleInitializeCart = () => {
    openModal();
  };

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="bg-white rounded-lg p-6 flex items-center justify-between w-[90%] max-w-2xl">
        {/* 총 가격 표시 */}
        <div className="text-lg font-bold text-gray-800">
          총 가격{" "}
          <span className="text-blue-600">{total.toLocaleString()}원</span>
        </div>
        
        {/* 장바구니 초기화 버튼 */}
        <button
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          onClick={handleInitializeCart}
        >
          장바구니 초기화
        </button>
      </div>
    </div>
  );
};

export default PriceBox;