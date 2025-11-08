import { useNavigate } from "react-router-dom";

interface FloatingButtonProps {
  to: string; // 이동할 경로
}

const FloatingButton = ({ to }: FloatingButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className='fixed bottom-18 right-6 w-14 h-14 bg-pink-600 text-white rounded-full
        flex items-center justify-center text-3xl hover:bg-pink-700 transition-colors z-50 text-center'
    >
      +
    </button>
  );
};

export default FloatingButton;