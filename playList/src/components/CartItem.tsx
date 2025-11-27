import { useDispatch } from 'react-redux';
import { increase, decrease, removeItem } from '../features/cart/cartSlice';
import { type CartItemType } from '../constants/cartItems';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const CartItem = ({ id, title, singer, price, img, amount }: CartItemType) => {
  const dispatch = useDispatch();

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
          onClick={() => dispatch(increase(id))}
        >
          <FaChevronUp />
        </button>
        <p className="text-lg font-medium my-1">{amount}</p>
        <button
          className="text-indigo-500 hover:text-indigo-700 transition"
          onClick={() => {
            if (amount === 1) {
              dispatch(removeItem(id));
              return;
            }
            dispatch(decrease(id));
          }}
        >
          <FaChevronDown />
        </button>
      </div>
    </article>
  );
};

export default CartItem;