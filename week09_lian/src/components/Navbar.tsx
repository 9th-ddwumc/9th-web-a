import { useAppSelector } from '../app/hooks';

const Navbar = () => {
  const { amount } = useAppSelector((state) => state.cart);

  return (
    <nav className="bg-slate-900 text-white py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4">
        <h1 className="font-bold text-xl">Ohtani Ahn</h1>

        <div className="relative">
          <span className="text-2xl">🛒</span>
          <span className="absolute -top-2 -right-2 bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            {amount}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
