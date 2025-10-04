import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#111] to-black text-white">
      {/* 상단 네비게이션 바 */}
      <header className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-md shadow-md">
        <Navbar />
      </header>

      {/* 넷플릭스 배너 */}
      <section className="relative h-[50vh] flex items-center justify-center bg-[url('/banner.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <h1 className="z-10 text-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix Logo"
            className="h-20 md:h-28 mx-auto"
          />
        </h1>
      </section>

      {/* 라우트 출력 위치 */}
      <main className="px-4 md:px-12 py-10">
        <Outlet />
      </main>

      {/* 푸터  */}
      <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-800">
        © Hailee
      </footer>
    </div>
  );
};

export default HomePage;
