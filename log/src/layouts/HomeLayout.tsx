import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import LpCreateModal from '../component/LpCreateModal';

const MainLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 모달 상태

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar onMenuClick={toggleSidebar} />

            <div className="flex flex-1">
                <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-60 bg-black border-r border-gray-800 z-40 transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                    <div className="lg:hidden p-4 border-b border-gray-800">
                        <button
                            onClick={closeSidebar}
                            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                        >
                            <span className="font-medium">메뉴</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="p-4 space-y-2">
                        <button 
                            onClick={() => { navigate('/search'); closeSidebar(); }} 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-[15px]"
                        >
                            <span className="text-xl">🔍</span>
                            <span>찾기</span>
                        </button>
                        <button 
                            onClick={() => { navigate('/my'); closeSidebar(); }} 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-[15px]"
                        >
                            <span className="text-xl">👤</span>
                            <span>마이페이지</span>
                        </button>
                    </nav>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                        <button className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                            탈퇴하기
                        </button>
                    </div>
                </aside>

                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden top-16" 
                        onClick={closeSidebar} 
                    />
                )}

                <main className="flex-1 lg:ml-0">
                    <Outlet />
                </main>
            </div>

            <Footer />

            {/* ✅ LP 작성 버튼 */}
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 text-white rounded-full shadow-xl hover:bg-pink-600 transition-all hover:scale-110 flex items-center justify-center text-3xl font-light z-50"
            >
                +
            </button>

            {/* ✅ LP 작성 모달 */}
            <LpCreateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};

export default MainLayout;