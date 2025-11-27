import { create } from 'zustand';
import initialCartItems, { type CartItemType } from '../constants/cartItems';

// 1. Zustand 상태 및 액션 타입 정의
interface CartState {
  cartItems: CartItemType[];
  amount: number;
  total: number;
  isOpen: boolean;
}

interface StoreActions {
  calculateTotals: () => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openModal: () => void;
  closeModal: () => void;
}

// Zustand 스토어 전체 타입
type CartStore = CartState & StoreActions;

// 헬퍼 함수: 초기 총계 계산
const getInitialTotals = (items: CartItemType[]) => {
  let amount = 0;
  let total = 0;
  items.forEach((item) => {
    amount += item.amount;
    total += item.amount * Number(item.price);
  });
  return { amount, total };
};

const initialTotals = getInitialTotals(initialCartItems);

const initialState: CartState = {
  cartItems: initialCartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
  isOpen: false,
};

// 2. Zustand 스토어 생성
export const useStore = create<CartStore>((set, get) => ({
  ...initialState,
  
  // 합계 계산 로직
  calculateTotals: () =>
    set((state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * Number(item.price);
      });
      return { amount, total };
    }),

  // 수량 증가 로직
  increase: (id) => {
    set((state) => ({
      cartItems: state.cartItems.map(item =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      ),
    }));
    get().calculateTotals(); 
  },

  // 수량 감소 로직 (수량이 1일 때 자동 삭제)
  decrease: (id) => {
    set((state) => {
      const item = state.cartItems.find((item) => item.id === id);

      if (item && item.amount === 1) {
        // 수량이 1일 경우, 배열에서 해당 항목을 제거
        return {
          cartItems: state.cartItems.filter((item) => item.id !== id),
        };
      }
      
      // 수량이 1보다 많을 경우, 수량만 1 감소
      return {
        cartItems: state.cartItems.map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        ),
      };
    });
    get().calculateTotals(); 
  },
  
  // 개별 항목 삭제
  removeItem: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));
    get().calculateTotals();
  },

  // 전체 삭제 로직
  clearCart: () => {
    set({ cartItems: [] });
    get().calculateTotals();
  },

  // 모달 열기/닫기 로직
  openModal: () => set({ isOpen: true }),
  
  closeModal: () => set({ isOpen: false }),
}));