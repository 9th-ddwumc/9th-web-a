import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import modalReducer from '../features/modal/modalSlice'; // 1. modalSlice 임포트

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer, // 2. modal 리듀서 등록
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;