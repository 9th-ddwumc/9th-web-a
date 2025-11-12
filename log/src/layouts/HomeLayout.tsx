// src/layouts/HomeLayout.tsx

import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import LpCreateModal from '../component/LpCreateModal';
import { useAuth } from '../context/AuthContext';
import DeleteAccountConfirmationModal from '../component/DeleteAccountConfirmationModal';

const MainLayout = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLpModalOpen, setIsLpModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 탈퇴 모달 상태

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    
    // LP 작성 버튼 클릭 핸들러: 로그인 상태 확인
    const handleCreateLpClick = () => {
        if (!accessToken) {
            alert('LP를 작성하려면 로그인이 필요합니다.');
            navigate('/login'); 
            return;
        }
        setIsLpModalOpen(true);
    };

    // 사이드바 항목 클릭 핸들러
    const handleSidebarNavigation = (path: string) => {
        navigate(path);
        closeSidebar(); // 네비게이션 후 사이드바 닫기
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar onMenuClick={toggleSidebar} />

            <div className="flex flex-1">
                {/* 사이드바 */}
                <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-60 bg-black border-r border-gray-800 z-40 transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                    
                    <nav className="p-4 space-y-2">
                        <button 
                            onClick={() => handleSidebarNavigation('/search')} 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-[15px]"
                        >
                            <span className="text-xl">🔍</span>
                            <span>찾기</span>
                        </button>
                        {accessToken && ( 
                            <button 
                                onClick={() => handleSidebarNavigation('/my')} 
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-[15px]"
                            >
                                <span className="text-xl">👤</span>
                                <span>마이페이지</span>
                            </button>
                        )}
                        
                    </nav>
                    
                    {/* 회원 탈퇴 버튼 (로그인 상태일 때만 표시) */}
                    {accessToken && (
                        <div className="absolute bottom-4 left-4 right-4">
                            <button 
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    closeSidebar(); // 버튼 클릭 시 사이드바 닫기
                                }} 
                                className="w-full px-4 py-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
                            >
                                회원 탈퇴
                            </button>
                        </div>
                    )}
                </aside>

                {/* 사이드바 오버레이 (클릭 시 닫기) */}
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

            {/* LP 작성 버튼 */}
            <button 
                onClick={handleCreateLpClick} 
                className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 text-white rounded-full shadow-xl hover:bg-pink-600 transition-all hover:scale-110 flex items-center justify-center text-3xl font-light z-50"
            >
                +
            </button>

            {/* LP 작성 모달 */}
            <LpCreateModal 
                isOpen={isLpModalOpen} 
                onClose={() => setIsLpModalOpen(false)} 
            />
            
            {/* 회원 탈퇴 확인 모달 */}
            <DeleteAccountConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

export default MainLayout;