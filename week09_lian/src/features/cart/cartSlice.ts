import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../../constants/cartItems';

export interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

export interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

// ⬇️ 이름 변경됨!
const calculateAllTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.total += item.amount * Number(item.price);
      return acc;
    },
    { amount: 0, total: 0 }
  );
};

const initialTotals = calculateAllTotals(cartItems);

const initialState: CartState = {
  cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (item) item.amount++;
    },

    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((i) => i.id === action.payload);
      if (!item) return;
      if (item.amount === 1) {
        state.cartItems = state.cartItems.filter((i) => i.id !== item.id);
      } else {
        item.amount--;
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },

    // ⬇️ reducer 이름은 그대로 `calculateTotals` 유지
    calculateTotals: (state) => {
      const { amount, total } = calculateAllTotals(state.cartItems);
      state.amount = amount;
      state.total = total;
    },
  },
});

export const {
  increase,
  decrease,
  removeItem,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
