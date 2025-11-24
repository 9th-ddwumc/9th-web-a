// src/component/Navbar.tsx

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useLogoutMutation } from "../hooks/mutations/useAuthMutations";

interface NavbarProps {
    onMenuClick: () => void;
    // ✅ 검색 토글 상태 및 핸들러 props 추가
    isSearchOpen: boolean;
    onSearchToggle: () => void;
}

const Navbar = ({ onMenuClick, isSearchOpen, onSearchToggle }: NavbarProps) => {
    const { accessToken } = useAuth();
    const { data: userInfo } = useGetMyInfo(!!accessToken);
    const logoutMutation = useLogoutMutation();
    
    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            logoutMutation.mutate();
        }
    };
    
    return (
        <nav className="bg-black border-b border-gray-800 sticky top-0 z-50 h-16">
            <div className="w-full px-4 h-full flex items-center justify-between max-w-[1920px] mx-auto">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 hover:bg-gray-800 rounded text-white transition-colors"
                        aria-label="메뉴"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    <Link to="/" className="text-2xl font-bold text-pink-500">
                        돌려돌려LP판
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {/* ✅ 검색 토글 버튼 (돋보기 <-> 닫기 아이콘 전환) */}
                    <button 
                        onClick={onSearchToggle}
                        className="text-xl p-2 hover:bg-gray-800 rounded transition-colors text-white w-10 h-10 flex items-center justify-center"
                        aria-label={isSearchOpen ? "검색 닫기" : "검색 열기"}
                    >
                        {isSearchOpen ? (
                            // 닫기(X) 아이콘
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        ) : (
                            // 돋보기 아이콘
                            <span className="text-xl">🔍</span>
                        )}
                    </button>

                    {!accessToken ? (
                        <>
                            <Link 
                                to="/login" 
                                className="px-4 py-2 text-white hover:text-pink-500 transition-colors hidden sm:block text-sm"
                            >
                                로그인
                            </Link>
                            <Link 
                                to="/signup" 
                                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors text-sm"
                            >
                                회원가입
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300 hidden sm:block text-sm">
                                {userInfo?.name || '사용자'}님 반갑습니다.
                            </span>
                            <Link 
                                to="/my" 
                                className="px-4 py-2 text-white hover:text-pink-500 transition-colors text-sm"
                            >
                                마이페이지
                            </Link>
                            <button 
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                                className="px-4 py-2 text-white hover:text-pink-500 transition-colors text-sm disabled:opacity-50"
                            >
                                {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;