import type { CartItem as CartItemType } from '../features/cart/cartSlice';
import { increase, decrease, removeItem } from '../features/cart/cartSlice';
import { useAppDispatch } from '../app/hooks';

interface Props {
  item: CartItemType;
}

const CartItem = ({ item }: Props) => {
  const dispatch = useAppDispatch();
  const { id, title, singer, img, price, amount } = item;

  return (
    <article className="flex items-center justify-between py-4 border-b border-slate-200">
      {/* 왼쪽: 이미지 + 정보 */}
      <div className="flex items-center gap-4">
        <img
          src={img}
          alt={title}
          className="w-16 h-16 object-cover rounded-md shadow"
        />

        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-slate-500">{singer}</p>
          <p className="font-bold text-blue-600">
            ₩{Number(price).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>

      {/* 오른쪽: 수량 버튼 */}
      <div className="flex items-center gap-2">
        <button
          className="w-7 h-7 border border-slate-300 rounded hover:bg-slate-100"
          onClick={() => dispatch(decrease(id))}
        >
          -
        </button>

        <span className="w-6 text-center">{amount}</span>

        <button
          className="w-7 h-7 border border-slate-300 rounded hover:bg-slate-100"
          onClick={() => dispatch(increase(id))}
        >
          +
        </button>
      </div>

      <button
        className="ml-3 text-xs text-red-500 hover:text-red-600"
        onClick={() => dispatch(removeItem(id))}
      >
        삭제
      </button>
    </article>
  );
};

export default CartItem;
