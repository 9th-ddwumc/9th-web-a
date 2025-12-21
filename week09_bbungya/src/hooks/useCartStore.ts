/* eslint-disable no-irregular-whitespace */
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

const getInitialTotals = (items: LP[]) => {
  let initialAmount = 0;
  let initialTotal = 0;

  items.forEach((item) => {
    initialAmount += item.amount;
    initialTotal += item.amount * item.price;
  });
  return { initialAmount, initialTotal };
};

const { initialAmount, initialTotal } = getInitialTotals(initialCartItems);

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const calculateTotals = (state: CartState) => {
  let amount = 0;
  let total = 0;

  state.cartItems.forEach((item) => {
    amount += item.amount;
    total += item.amount * item.price;
  });

  state.amount = amount;
  state.total = total;
};

export const useCartStore = create<CartState & CartActions>()(
  immer((set, get) => ({
    // 초기 상태
    cartItems: initialCartItems,
    amount: initialAmount,
    total: initialTotal,

    // 액션 구현 (Immer 사용으로 불변성 관리 없이 상태 직접 수정)
    increase: (id) =>
      set((state) => {
        const item = state.cartItems.find((i) => i.id === id);
        if (item) {
          item.amount += 1;
        }
        calculateTotals(state);
      }),

    decrease: (id) =>
      set((state) => {
        const item = state.cartItems.find((i) => i.id === id);
        if (item) {
          if (item.amount > 1) { 
            item.amount -= 1;
          }
        }
        calculateTotals(state);
      }),

    removeItem: (id) =>
      set((state) => {
        state.cartItems = state.cartItems.filter((i) => i.id !== id);
        calculateTotals(state);
      }),

    clearCart: () =>
      set((state) => {
        state.cartItems = [];
        calculateTotals(state);
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