// src/components/CartList.tsx

// import { useAppSelector, useAppDispatch } from "../hooks/useCustomRedux";
// import { useEffect } from "react";
// import { calculateTotal } from "../slices/cartSlice";
import CartItem from "./CartItem";
import { useCartStore } from "../hooks/useCartStore";

const CartList = () => {

  const cartItems = useCartStore(state => state.cartItems);

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