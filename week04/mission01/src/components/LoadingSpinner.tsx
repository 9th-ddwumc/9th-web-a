// src/components/LoadingSpinner.tsx

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen w-screen absolute inset-0 bg-white bg-opacity-70 z-50">
      <div 
        className="w-12 h-12 border-4 border-t-4 border-t-transparent 
                   border-[#bedb01] rounded-full animate-spin" // Tailwind CSS 애니메이션
        role="status" // 접근성을 위한 역할 지정
        aria-label="로딩 중" 
      >
        <span className="sr-only">로딩 중...</span> {/* 시각적으로 숨기고 스크린 리더에서만 읽힘 */}
      </div>
    </div>
  );
}