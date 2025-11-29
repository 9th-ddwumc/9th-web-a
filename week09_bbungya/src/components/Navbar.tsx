// src/components/Navbar.tsx

import { FaShoppingCart } from "react-icons/fa"; // 아이콘
import { useAppSelector } from "../hooks/useCustomRedux";

const Navbar = () => {
  // 전역 상태에서 총 수량 (amount) 가져오기
  const { amount } = useAppSelector((state) => state.cart);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 
        className="text-3xl font-semibold cursor-pointer"
        onClick={handleLogoClick}
      >
        BBungya
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">
          {amount} {/* 총 수량 표시 */}
        </span>
      </div>
    </div>
  );
};

export default Navbar;