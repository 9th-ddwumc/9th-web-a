import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar"; // 너의 Navbar는 named export

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 md:px-12 py-8">
        <Outlet />
      </main>
    </div>
  );
}
