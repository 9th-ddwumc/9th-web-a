import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateTotals } from './features/cart/cartSlice'; // clearCart 제거
import { openModal } from './features/modal/modalSlice'; // openModal 임포트
import { type RootState } from './store/store';
import CartItem from './components/CartItem';
import Modal from './components/Modal'; // Modal 컴포넌트 임포트

function App() {
  const dispatch = useDispatch();
  const { cartItems, total, amount } = useSelector((state: RootState) => state.cart);
  const { isOpen } = useSelector((state: RootState) => state.modal); // modal 상태 가져오기

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <main className="bg-slate-50 min-h-screen pb-20">
      {/* 1. isOpen 상태에 따라 Modal 컴포넌트 렌더링 */}
      {isOpen && <Modal />}

      {/* Navbar */}
      <nav className="bg-indigo-600 py-4 px-8 text-white mb-10 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h3 className="text-2xl font-bold">UMC PlayList</h3>
          <div className="relative cursor-pointer">
            {/* 장바구니 아이콘 (React Icons 사용 시) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <div className="absolute -top-2 -right-2 bg-red-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
              {amount}
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Content */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="uppercase text-center text-3xl font-bold mb-10 text-gray-700">
          당신이 선택한 음반
        </h2>
        
        {cartItems.length < 1 ? (
          <header className="text-center mt-20">
            <h4 className="text-xl text-gray-500">장바구니가 비어있습니다.</h4>
          </header>
        ) : (
          <>
            <div>
              {cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>

            <footer className="mt-12 border-t-2 border-gray-200 pt-6">
              <div className="flex justify-between text-xl font-bold mb-6 text-gray-800">
                <h4>총 가격</h4>
                <span>₩ {total.toLocaleString()}원</span>
              </div>
              <div className="text-center">
                <button
                  className="btn border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all border-2 px-6 py-2 rounded-md font-bold uppercase tracking-widest text-sm"
                  // 2. '장바구니 비우기' 클릭 시 openModal()을 dispatch
                  onClick={() => dispatch(openModal())}
                >
                  장바구니 비우기
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </main>
  );
}

export default App;