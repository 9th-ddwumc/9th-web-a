import DepartmentManager from './DepartmentManager';
import './index.css';

function App() {
  return (
    // 전체 화면 배경을 검은색으로 설정하여 DepartmentManager 스타일과 통일
    <div className="min-h-screen bg-black"> 
      <DepartmentManager />
    </div>
  );
}

export default App;