// src/types/cart.ts
export interface LP {
  id: string;
  title: string;
  singer: string;
  price: number;
  img: string;
  amount: number; // 카트에 담긴 해당 아이템의 수량
}

export interface CartState {
  cartItems: LP[]; // LP 목록 (현재 장바구니 목록)
  amount: number; // 전체 카트에 담긴 총 아이템 개수 (Navbar에 표시)
  total: number; // 총 가격
}