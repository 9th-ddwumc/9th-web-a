import { type CartItemType } from '../constants/cartItems';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useStore } from '../store/useStore.ts'; 

const CartItem = ({ id, title, singer, price, img, amount }: CartItemType) => {
  // 개별 selector로 가져오기 (최적화)
  const increase = useStore((state) => state.increase);
  const decrease = useStore((state) => state.decrease);

  return (
    <article className="flex justify-between items-center mb-6 shadow-sm p-4 bg-white rounded-lg">
      <div className="flex gap-6 items-center">
        <img
          src={img}
          alt={title}
          className="w-20 h-20 object-cover rounded-md shadow-md"
        />
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-1">{title}</h4>
          <h4 className="text-sm text-gray-500 mb-1">{singer}</h4>
          <h4 className="text-gray-600 font-medium">₩ {Number(price).toLocaleString()}</h4>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button
          className="text-indigo-500 hover:text-indigo-700 transition"
          onClick={() => increase(id)}
        >
          <FaChevronUp />
        </button>
        <p className="text-lg font-medium my-1">{amount}</p>
        <button
          className="text-indigo-500 hover:text-indigo-700 transition"
          onClick={() => decrease(id)}
        >
          <FaChevronDown />
        </button>
      </div>
    </article>
  );
};

export default CartItem;