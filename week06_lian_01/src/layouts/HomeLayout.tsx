import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import FloatingButton from '../components/FloatingButton';

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className='h-dvh flex flex-col bg-black'>
      <Navbar onMenuClick={() => setIsSidebarOpen(true)}/>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className='flex-1 overflow-y-auto'>
          <Outlet />
          <FloatingButton to="/create" />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default HomeLayout;