import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useLogoutMutation } from "../hooks/mutations/useAuthMutations";

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { accessToken } = useAuth();
    const { data: userInfo } = useGetMyInfo(!!accessToken);
    
    // ✅ 로그아웃 Mutation
    const logoutMutation = useLogoutMutation();
    
    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            logoutMutation.mutate();
        }
    };
    
    return (
        <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-gray-800 rounded"
                        aria-label="메뉴"
                    >
                        <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                        </svg>
                    </button>
                    
                    <Link to="/" className="text-2xl font-bold text-pink-500">
                        돌려돌려LP판
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link 
                        to="/search"
                        className="text-xl p-2 hover:bg-gray-800 rounded transition-colors"
                        aria-label="검색"
                    >
                        🔍
                    </Link>

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