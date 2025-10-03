import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#111] to-black text-white">

      {/* 라우트 출력 위치 */}
      <main className="px-4 md:px-12 py-10">
        <Outlet />
      </main>

    </div>
  );
};

export default HomePage;
