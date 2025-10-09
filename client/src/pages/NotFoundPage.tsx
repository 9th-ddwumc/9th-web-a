import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center text-white text-center px-4">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">페이지를 찾을 수 없어요</h1>
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-600 transition"
      >
        이전으로 돌아가기
      </button>
    </div>
  );
}
