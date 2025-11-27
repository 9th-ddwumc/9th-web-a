
import UseCallbackPage from './pages/UseCallbackPage'; 
// 만약 pages 디렉토리 없이 src 바로 밑에 UseCallbackPage가 있다면 경로를 조정하세요.
// import UseCallbackPage from './UseCallbackPage'; 

function App() {
  return (
    <div className="App">
      {/* 최적화 실습 메인 컴포넌트 렌더링 */}
      <UseCallbackPage />
    </div>
  );
}

export default App;