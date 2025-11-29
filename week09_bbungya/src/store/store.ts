// src/store.ts

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import modalReducer from '../slices/modalSlice';

// 스토어 생성 함수 (싱글톤 패턴)
const createStore = () => {
  const store = configureStore({
    reducer: {
      // 슬라이스 이름과 리듀서 연결
      cart: cartReducer, 
      modal: modalReducer,
    },
  });
  return store;
};

// 스토어 인스턴스 생성 및 내보내기
export const store = createStore();

// 타입스크립트 타입 추론을 위한 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;