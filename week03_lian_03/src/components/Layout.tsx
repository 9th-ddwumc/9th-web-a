// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="px-4 md:px-12 py-8">
        <Outlet />
      </main>
    </div>
  );
}
