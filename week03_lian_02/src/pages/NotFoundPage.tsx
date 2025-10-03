import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-white text-center px-4"
      style={{
        backgroundColor: "black",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-2xl md:text-4xl font-bold mb-6">
        서비스 이용에 불편을 드려 죄송합니다
      </h1>

      <p className="text-md md:text-lg mb-6">
        죄송합니다. 지금은 요청을 처리할 수 없습니다.
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          이전으로 돌아가기
        </button>
      </div>
    </div>
  );
}
