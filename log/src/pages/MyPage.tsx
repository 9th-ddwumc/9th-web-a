// log/src/pages/MyPage.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putUserMe } from "../apis/auth"; 
import type { RequestUserUpdateDto, ResponseMyInfo } from "../types/auth"; 
import { useState, type FormEvent } from "react"; // FormEvent 추가
import { QUERY_KEY } from "../constants/key";
import { Loading } from "../component/LoadingError"; 

// =========================================================================
// 프로필 수정 폼 컴포넌트 (MyPage 내부에 정의)
// userInfo가 non-nullable임을 가정하고 정의합니다.
// =========================================================================
interface ProfileEditFormProps {
    userInfo: NonNullable<ResponseMyInfo>; // ResponseMyInfo가 null이 아님을 보장
    onCancel: () => void;
    queryClient: ReturnType<typeof useQueryClient>;
}

const ProfileEditForm = ({ userInfo, onCancel, queryClient }: ProfileEditFormProps) => {
    // userInfo 객체에 null이 아닌 데이터가 들어왔음을 가정하고 상태 초기화
    const [name, setName] = useState(userInfo.name || '');
    const [bio, setBio] = useState(userInfo.bio || '');
    const [avatar, setAvatar] = useState(userInfo.avatar || '');

    // useMutation 정의
    const updateProfileMutation = useMutation({
        mutationFn: (data: RequestUserUpdateDto) => putUserMe(data),
        onSuccess: () => {
            alert('프로필 정보가 수정되었습니다.');
            onCancel();
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || '프로필 수정에 실패했습니다.');
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            alert('이름은 필수 입력 항목입니다.');
            return;
        }

        const updateData: RequestUserUpdateDto = {
            name: name.trim(),
            bio: bio.trim() || null, 
            avatar: avatar.trim() || null,
        };
        
        updateProfileMutation.mutate(updateData);
    };
    
    const isPending = updateProfileMutation.isPending;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">프로필 수정</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 이름 (필수) */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1" htmlFor="name">이름 (필수)</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                        disabled={isPending}
                    />
                </div>
                
                {/* Bio (옵션) */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1" htmlFor="bio">Bio (옵션)</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[80px] resize-none text-gray-900"
                        disabled={isPending}
                    />
                </div>
                
                {/* 프로필 사진 URL (옵션) */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1" htmlFor="avatar">프로필 사진 URL (옵션)</label>
                    <input
                        id="avatar"
                        type="url"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                        placeholder="이미지 URL을 입력하세요"
                        disabled={isPending}
                    />
                    {avatar && (
                        <div className="mt-2 flex items-center gap-3">
                            <img src={avatar} alt="미리보기" className="w-12 h-12 rounded-full object-cover" />
                            <button 
                                type="button" 
                                onClick={() => setAvatar('')}
                                className="text-sm text-red-500 hover:text-red-700"
                                disabled={isPending}
                            >
                                이미지 제거
                            </button>
                        </div>
                    )}
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 pt-4">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-50 transition-colors"
                        disabled={isPending}
                    >
                        취소
                    </button>
                    <button 
                        type="submit"
                        className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500"
                        disabled={isPending || !name.trim()}
                    >
                        {isPending ? '저장 중...' : '저장'}
                    </button>
                </div>
            </form>
        </div>
    );
};
// =========================================================================

const MyPage = () => {
    const navigate = useNavigate();
    const { logout, accessToken } = useAuth();
    const queryClient = useQueryClient(); 

    const [isEditMode, setIsEditMode] = useState(false);
    
    const { data: userInfo, isPending, isError } = useGetMyInfo(!!accessToken);

    // 로그아웃 핸들러
    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    // 로딩 상태
    if (isPending) {
        return <Loading message="프로필 정보를 불러오는 중..." />;
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
    
    // ✅ 수정 모드일 경우 수정 폼 렌더링
    if (isEditMode) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* userInfo가 null이 아님을 보장하는 로직이 상단에 있으므로 ! 또는 NonNullable 사용 가능 */}
                    <ProfileEditForm 
                        // userInfo는 if (!userInfo) { return ... } 로직에 의해 null이 아님이 보장됩니다.
                        userInfo={userInfo}
                        onCancel={() => setIsEditMode(false)}
                        queryClient={queryClient}
                    />
                </div>
            </div>
        );
    }

    // 기본 프로필 뷰
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* 프로필 카드 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 헤더 */}
                    <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-white">프로필</h1>
                        {/* 설정 버튼 */}
                        <button
                            onClick={() => setIsEditMode(true)}
                            className="text-white hover:text-gray-200 transition-colors text-lg"
                            title="설정"
                        >
                            ⚙️
                        </button>
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
                                
                                <div>
                                    <label className="text-sm text-gray-500 font-medium">
                                        Bio
                                    </label>
                                    <p className="text-lg text-gray-900 mt-1 whitespace-pre-wrap">
                                        {userInfo.bio || '작성된 Bio가 없습니다.'}
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