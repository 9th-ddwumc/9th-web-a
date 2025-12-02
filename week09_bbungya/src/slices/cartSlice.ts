// src/slices/cartSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartState } from "../types/cart";
import cartItems from "../constants/cartItems";

// 초기 상태
const initialState: CartState = {
  cartItems: cartItems, // 초기 음반 데이터 (목 데이터)
  amount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart', // 슬라이스 이름
  initialState,
  reducers: {
    // 1. 수량 증가
    increase: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        item.amount += 1; // Immer 덕분에 불변성 관리 없이 직접 수정 가능
      }
    },

    // 2. 수량 감소
    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        item.amount -= 1;
      }
    },

    // 3. 아이템 제거
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);
    },

    // 4. 장바구니 비우기
    clearCart: (state) => {
      state.cartItems = [];
    },

    // 5. 총액 및 총 수량 계산 (Payload 없음)
    calculateTotal: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.amount = amount;
      state.total = total;
    },
  },
});

// Duck Pattern: Action 생성자 및 Reducer 내보내기
export const { increase, decrease, removeItem, clearCart, calculateTotal } = cartSlice.actions;
export default cartSlice.reducer;