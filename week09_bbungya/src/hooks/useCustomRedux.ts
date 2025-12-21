// src/hooks/useCustomRedux.ts

import { useSelector, useDispatch } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

// 타입이 적용된 useDispatch 훅
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 타입이 적용된 useSelector 훅
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;