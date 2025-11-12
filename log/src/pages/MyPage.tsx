import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useUpdateProfileMutation } from "../hooks/mutations/useUserMutations";

const MyPage = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const { data: userInfo, isPending, isError } = useGetMyInfo(!!accessToken);
    const updateProfileMutation = useUpdateProfileMutation();

    // 수정 모드 시작
    const handleStartEdit = () => {
        if (userInfo) {
            setName(userInfo.name || '');
            setBio(userInfo.bio || '');
            setPreviewUrl(userInfo.avatar || null);
            setIsEditing(true);
        }
    };

    // 파일 선택
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 프로필 저장
    const handleSaveProfile = () => {
        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }

        updateProfileMutation.mutate(
            { name, bio, avatar: avatarFile },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setAvatarFile(null);
                },
            }
        );
    };

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
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 헤더 */}
                    <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-white">프로필</h1>
                        {!isEditing && (
                            <button
                                onClick={handleStartEdit}
                                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                            >
                                ⚙️ 설정
                            </button>
                        )}
                    </div>
                    
                    {/* 프로필 정보 */}
                    <div className="p-6">
                        {!isEditing ? (
                            // ✅ 보기 모드
                            <div className="flex items-start gap-6">
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
                                
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">ID (이메일)</label>
                                        <p className="text-lg text-gray-900 mt-1">{userInfo.email}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">이름</label>
                                        <p className="text-lg text-gray-900 mt-1">{userInfo.name}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">소개</label>
                                        <p className="text-lg text-gray-900 mt-1">{userInfo.bio || '소개가 없습니다.'}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <label className="text-sm text-gray-500 font-medium">계정 상태</label>
                                        <p className="text-lg text-gray-900">로그인</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // ✅ 수정 모드
                            <div className="space-y-6">
                                {/* 프로필 사진 */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-4xl font-bold text-gray-500">
                                                    {name.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-600"
                                    />
                                    <p className="text-xs text-gray-500">프로필 사진 (선택사항)</p>
                                </div>

                                {/* 이름 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        이름 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="이름을 입력하세요"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        소개 (선택사항)
                                    </label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                                        placeholder="자기소개를 입력하세요"
                                        rows={4}
                                    />
                                </div>

                                {/* 버튼 */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setAvatarFile(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={updateProfileMutation.isPending}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {updateProfileMutation.isPending ? '저장 중...' : '저장'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 액션 버튼들 (보기 모드에만 표시) */}
                        {!isEditing && (
                            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
                                <button 
                                    className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors"
                                    onClick={() => navigate('/')}
                                >
                                    홈으로
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;