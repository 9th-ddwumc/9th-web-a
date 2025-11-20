// src/layouts/HomeLayout.tsx

import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import LpCreateModal from '../component/LpCreateModal';
import SearchOverlay from '../component/SearchOverlay';
import { useAuth } from '../context/AuthContext';
import DeleteAccountConfirmationModal from '../component/DeleteAccountConfirmationModal';

const HomeLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = useAuth();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLpModalOpen, setIsLpModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        setIsSearchOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleCreateLpClick = () => {
        if (!accessToken) {
            if(window.confirm('LP를 작성하려면 로그인이 필요합니다. 로그인 하시겠습니까?')) {
                navigate('/login');
            }
            return;
        }
        setIsLpModalOpen(true);
    };

    const handleSidebarNavigation = (path: string) => {
        navigate(path);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col w-full relative">
            <Navbar 
                onMenuClick={toggleSidebar} 
                isSearchOpen={isSearchOpen} 
                onSearchToggle={toggleSearch} 
            />

            {/* ✅ isSidebarOpen prop 전달 */}
            {isSearchOpen && <SearchOverlay isSidebarOpen={isSidebarOpen} />}

            <div className="flex flex-1 relative w-full">
                <aside 
                    className={`
                        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-black border-r border-gray-800 z-40 
                        transition-transform duration-300 ease-in-out
                    `}
                    style={{ 
                        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    }}
                >
                    <div className="p-4 border-b border-gray-800 flex items-center">
                        <h2 className="text-lg font-semibold text-white pl-2">메뉴</h2>
                    </div>
                    
                    <nav className="p-4 space-y-2">
                        <button 
                            onClick={() => {
                                toggleSearch();
                                if (window.innerWidth < 1024) setIsSidebarOpen(false);
                            }} 
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
                    
                    {accessToken && (
                        <div className="absolute bottom-4 left-4 right-4">
                            <button 
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                }} 
                                className="w-full px-4 py-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
                            >
                                회원 탈퇴
                            </button>
                        </div>
                    )}
                </aside>

                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        style={{ top: '4rem' }}
                        onClick={toggleSidebar} 
                    />
                )}

                <main 
                    className={`
                        flex-1 transition-all duration-300 ease-in-out w-full min-w-0
                        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
                    `}
                >
                    <Outlet />
                </main>
            </div>

            <Footer />

            {!isSearchOpen && (
                <button 
                    onClick={handleCreateLpClick} 
                    className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 text-white rounded-full shadow-xl hover:bg-pink-600 transition-all hover:scale-110 flex items-center justify-center text-3xl font-light z-50"
                >
                    +
                </button>
            )}

            <LpCreateModal 
                isOpen={isLpModalOpen} 
                onClose={() => setIsLpModalOpen(false)} 
            />
            
            <DeleteAccountConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

export default HomeLayout;