import { useSidebar } from "./hooks/useSidebar";
import { HamburgerButton } from "./components/HamburgerButton";
import { Sidebar } from "./components/Sidebar";

function App() {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-30 h-16 flex items-center px-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <HamburgerButton isOpen={isOpen} onClick={toggle} />
            <h1 className="text-xl font-bold text-gray-900">LP 사이트</h1>
          </div>
        </div>
      </header>

      {/* 사이드바 */}
      <Sidebar isOpen={isOpen} onClose={close} />

      {/* 메인 컨텐츠 */}
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">메인 컨텐츠</h2>
        <p className="text-gray-600 mb-4">
          여기에 본문 내용이 들어갑니다. 사이드바 테스트를 위해 내용을 길게 작성해보세요.
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-gray-500 mb-2">
            스크롤 테스트를 위한 더미 텍스트입니다. {i + 1}
          </p>
        ))}
      </main>
    </div>
  );
}

export default App;