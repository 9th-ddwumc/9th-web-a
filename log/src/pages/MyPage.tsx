// MyPage.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

const MyPage = () => {
    const navigate = useNavigate();
    const { logout, accessToken } = useAuth();
    
    // ✅ useQuery로 사용자 정보 가져오기
    const { data: userInfo, isPending, isError } = useGetMyInfo(!!accessToken);

    // 로그아웃 핸들러
    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    // 로딩 상태
    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (isError || !userInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-red-600 font-medium text-center">
                            사용자 정보를 불러오는데 실패했습니다.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            로그인 페이지로 이동
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* 프로필 카드 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 헤더 */}
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-xl font-semibold text-white">프로필</h1>
                    </div>
                    
                    {/* 프로필 정보 */}
                    <div className="p-6">
                        <div className="flex items-start gap-6">
                            {/* 아바타 */}
                            <div className="flex-shrink-0">
                                {userInfo.avatar ? (
                                    <img 
                                        src={userInfo.avatar} 
                                        alt="프로필 사진" 
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                        <span className="text-3xl font-bold text-gray-500">
                                            {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* 정보 */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 font-medium">
                                        ID (이메일)
                                    </label>
                                    <p className="text-lg text-gray-900 mt-1">
                                        {userInfo.email}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="text-sm text-gray-500 font-medium">
                                        이름
                                    </label>
                                    <p className="text-lg text-gray-900 mt-1">
                                        {userInfo.name}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">
                                            계정 상태
                                        </label>
                                        <p className="text-lg text-gray-900">로그인</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 액션 버튼들 */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
                            <button 
                                className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors"
                                onClick={() => navigate('/')}
                            >
                                홈으로
                            </button>
                            
                            <button 
                                className="flex-1 bg-white border border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-50 transition-colors"
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;