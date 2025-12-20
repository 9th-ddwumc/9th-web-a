/* eslint-disable no-irregular-whitespace */
// src/components/CartItem.tsx
import { useShallow } from "zustand/shallow";
import { useCartStore } from "../hooks/useCartStore";
import type { LP } from "../types/cart";

interface CartItemProps {
  lp: LP;
}

const CartItem: React.FC<CartItemProps> = ({ lp }) => {
  // const { increase, decrease, removeItem } = useCartStore.getState();
  const { increase, decrease, removeItem } = useCartStore(
    useShallow((state) => ({
      increase: state.increase,
      decrease: state.decrease,
      removeItem: state.removeItem
    }))
  );

  // 수량 증가
  const handleIncreaseCount = () => {
    increase(lp.id);
  };

  // 수량 감소 (제거 로직은 decrease 액션 내에서 처리됨)
  const handleDecreaseCount = () => {

    // 1이면 빠지도록
    if (lp.amount == 1) {
      removeItem(lp.id);
      return;
    }

    decrease(lp.id);
  }

  return (
    <li className="flex items-center p-4 border-b border-gray-200">
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{lp.title}</h3>
        <p className="text-sm text-gray-600">{lp.singer}</p>
        <p className="text-md font-bold text-gray-600 mt-2">
          {lp.price.toLocaleString()}원
        </p>
      </div>
      
      {/* 수량 조절 버튼 */}
      <div className="flex items-center">
        <button
          className="bg-gray-300 text-gray-800 rounded-l p-1.5 px-3 hover:bg-gray-400 cursor-pointer"
          onClick={handleDecreaseCount}
        >
          -
        </button>
        <span className="p-1.5 px-3 border-t border-b border-gray-300">
          {lp.amount}
        </span>
        <button
          className="bg-gray-300 text-gray-800 rounded-r p-1.5 px-3 hover:bg-gray-400 cursor-pointer"
          onClick={handleIncreaseCount}
        >
          +
        </button>
      </div>
    </li>
  );
};

export default CartItem;