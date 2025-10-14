import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
