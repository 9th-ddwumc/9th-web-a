import ThemeContent from "./useContext/ThemeContent";
import ThemeToggleButton from "./useContext/ThemeToggleButton";

function App() {
  return (
    // 전체 화면 높이를 채우고, 내용을 중앙 정렬하거나 상하로 배치하기 위한 구조
    <div className="min-h-screen w-full flex flex-col">
      <ThemeToggleButton />
      <ThemeContent />
    </div>
  );
}

export default App;