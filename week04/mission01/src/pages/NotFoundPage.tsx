// src/pages/NotFoundPage.tsx

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
      <p className="text-3xl font-semibold text-gray-800 mb-8">
        페이지를 찾을 수 없습니다.
      </p>
      <p className="text-xl text-gray-600">
        "못 찾겠다 꾀꼬리..." 
      </p>
      <a href="/" className="mt-8 text-blue-600 hover:text-blue-800 text-lg font-medium underline">
        홈으로 돌아가기
      </a>
    </div>
  );
}