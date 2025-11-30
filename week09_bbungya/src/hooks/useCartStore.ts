// src/stores/useCartStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { LP } from '../types/cart'; 
import initialCartItems from '../constants/cartItems'; // 목 데이터 임포트 가정
import { useShallow } from 'zustand/shallow';

// 상태 및 액션 인터페이스 통합
interface CartState {
  cartItems: LP[];
  amount: number;
  total: number;
}

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotal: () => void;
}

export const useCartStore = create<CartState & CartActions>()(
  immer((set, get) => ({
    // 초기 상태
    cartItems: initialCartItems,
    amount: 0,
    total: 0,

    // 액션 구현 (Immer 사용으로 불변성 관리 없이 상태 직접 수정)
    increase: (id) =>
      set((state) => {
        const item = state.cartItems.find((i) => i.id === id);
        if (item) {
          item.amount += 1;
        }
        get().calculateTotal(); // 상태 변경 후 총액 재계산
      }),

    decrease: (id) =>
      set((state) => {
        const item = state.cartItems.find((i) => i.id === id);
        if (item) {
          // 수량이 1일 경우 제거 로직을 타기 위해 별도 처리
          if (item.amount === 1) {
            // Zustand에서는 액션 내에서 다른 액션을 호출하지 않고,
            // 필터링하여 새로운 배열을 반환하는 것이 일반적입니다.
            state.cartItems = state.cartItems.filter((i) => i.id !== id);
          } else {
            item.amount -= 1;
          }
        }
        get().calculateTotal();
      }),

    removeItem: (id) =>
      set((state) => {
        state.cartItems = state.cartItems.filter((i) => i.id !== id);
        get().calculateTotal();
      }),

    clearCart: () =>
      set((state) => {
        state.cartItems = [];
        get().calculateTotal();
      }),

    calculateTotal: () =>
      set((state) => {
        let newAmount = 0;
        let newTotal = 0;

        state.cartItems.forEach((item) => {
          newAmount += item.amount;
          newTotal += item.amount * item.price;
        });

        state.amount = newAmount;
        state.total = newTotal;
      }),
  }))
);

export const useCartInfo = () =>
  useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
    }))
  );

  useCartStore.getState().calculateTotal();