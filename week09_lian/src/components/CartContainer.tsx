// src/components/CartContainer.tsx

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import CartItem from './CartItem';
import { calculateTotals } from '../features/cart/cartSlice';
import { openModal } from '../features/modal/modalSlice';

const CartContainer = () => {
  const dispatch = useAppDispatch();
  const { cartItems, amount, total } = useAppSelector((state) => state.cart);

  // cartItems가 바뀔 때마다 합계 다시 계산
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  // 장바구니가 비었을 때 UI
  if (cartItems.length === 0) {
    return (
      <section className="bg-white shadow rounded-lg p-6 mt-6 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold">장바구니</h2>
        <p className="text-slate-500 text-sm mt-2">장바구니가 비어 있어요 🥲</p>
      </section>
    );
  }

  return (
    <section className="bg-white shadow rounded-lg p-6 mt-6 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">장바구니</h2>

      {/* 아이템 리스트 */}
      <div>
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* 총합 영역 */}
      <div className="border-t border-slate-200 mt-4 pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span>총 수량</span>
          <span className="font-semibold">{amount} 개</span>
        </div>

        <div className="flex justify-between text-base">
          <span>총 금액</span>
          <span className="font-bold text-blue-600">
            ₩{total.toLocaleString('ko-KR')}
          </span>
        </div>
      </div>

      {/* 전체 삭제 버튼 → 모달 열기 */}
      <button
        onClick={() => dispatch(openModal())}
        className="mt-5 w-full border border-slate-300 rounded-lg py-2 text-sm hover:bg-slate-50"
      >
        전체 삭제
      </button>
    </section>
  );
};

export default CartContainer;
