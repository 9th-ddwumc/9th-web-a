import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp";
import { useAuth } from "../../contexts/AuthContext";
import LpCardSkeleton from "./LpCardSkeleton";

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const cardClick = () => {
    if (!accessToken) {
      const confirmed = window.confirm(
        "로그인이 필요한 서비스입니다. 로그인을 해주세요!"
      );
      if (confirmed) {
        navigate("/login");
      }
    } else {
      navigate(`/lp/${lp.id}`);
    }
  };

  return (
    <div
      key={lp.id}
      onClick={cardClick}
      className="relative aspect-square overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="object-cover w-full h-full transition duration-300 hover:brightness-50"
      />
      {isHovered && (
        <div className="absolute pb-10 inset-0 z-10 bg-black/40 backdrop-brightness-75 transition-opacity duration-300 flex flex-col justify-end items-start text-white p-4 space-y-1">
          <h2 className="text-md font-bold">{lp.title}</h2>
          <p className="text-sm text-gray-300">
            {new Date(lp.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-300">{lp.likes.length} ♥️</p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2 z-0">
        <h3 className="text-white text-sm font-semibold truncate">
          {lp.title}
        </h3>
      </div>
      <LpCardSkeleton />
    </div>
  );
};

export default LpCard;