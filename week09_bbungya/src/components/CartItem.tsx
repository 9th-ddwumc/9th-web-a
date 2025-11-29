// src/components/CartItem.tsx
import { useAppDispatch } from "../hooks/useCustomRedux";
import { decrease, increase, removeItem } from "../slices/cartSlice";
import type { LP } from "../types/cart";

interface CartItemProps {
  lp: LP;
}

const CartItem = ({ lp }: CartItemProps) => {
  const dispatch = useAppDispatch();

  // 수량 증가
  const handleIncreaseCount = () => {
    dispatch(increase({ id: lp.id }));
  };

  // 수량 감소 (1일 때 제거 로직 포함)
  const handleDecreaseCount = () => {
    // 수량이 1일 경우, 감소 대신 제거 액션 디스패치 [05:20:05]
    if (lp.amount === 1) {
      dispatch(removeItem({ id: lp.id }));
      return;
    }
    
    // 수량이 1보다 클 경우 감소
    dispatch(decrease({ id: lp.id }));
  };

  return (
    <li className="flex items-center p-4 border-b border-gray-200">
      {/* ... (UI 구성 생략: 이미지, 제목, 가격 등) ... */}
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