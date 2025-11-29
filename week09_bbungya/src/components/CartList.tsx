// src/components/CartList.tsx

import { useAppSelector, useAppDispatch } from "../hooks/useCustomRedux";
import { useEffect } from "react";
import { calculateTotal } from "../slices/cartSlice";
import CartItem from "./CartItem";

const CartList = () => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  // cartItems가 변경될 때마다 총액과 수량을 재계산 [05:58:00]
  useEffect(() => {
    dispatch(calculateTotal()); 
  }, [dispatch, cartItems]); // 디펜던시 배열에 cartItems를 추가

  return (
    <div className="flex flex-col items-center justify-center mt-8 w-full px-4">
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">장바구니가 비어 있습니다.</p>
      ) : (
        <ul className="w-full max-w-2xl space-y-4">
          {cartItems.map((item) => (
            <li key={item.id}>
              <CartItem lp={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartList;