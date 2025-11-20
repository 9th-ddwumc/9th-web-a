// src/pages/MyPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useUpdateProfileMutation } from "../hooks/mutations/useUserMutations";
import { Loading, ErrorDisplay } from "../component/LoadingError"; 
import type { RequestUserUpdateDto } from "../types/auth";

const MyPage = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    
    const { data: userInfo, isPending, isError, refetch } = useGetMyInfo(!!accessToken);
    const updateProfileMutation = useUpdateProfileMutation();

    // 수정 모드 시작
    const handleStartEdit = () => {
        if (userInfo) {
            setName(userInfo.name || '');
            setBio(userInfo.bio || '');
            setAvatarUrl(userInfo.avatar || '');
            setIsEditing(true);
        }
    };

    // 프로필 저장
    const handleSaveProfile = () => {
        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }

        const updateData: RequestUserUpdateDto = {
            name: name.trim(),
            bio: bio.trim() || null,
            avatar: avatarUrl.trim() || null,
        };

        updateProfileMutation.mutate(updateData, {
            onSuccess: () => {
                setIsEditing(false);
                refetch(); // ✅ 프로필 정보 다시 불러오기
            },
        });
    };

    if (isPending) {
        return <Loading message="프로필 정보를 불러오는 중..." />;
    }

    if (isError || !userInfo) {
        return (
            <ErrorDisplay 
                message="사용자 정보를 불러오는데 실패했습니다."
                error={isError ? new Error("Load failed") : null}
                onRetry={refetch}
                retryText="재시도"
            />
        );
    }
    
    return (
        <div className="min-h-screen bg-black py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                    {/* 헤더 */}
                    <div className="bg-gradient-to-r from-pink-600 to-pink-500 px-8 py-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">내 프로필</h1>
                        {!isEditing && (
                            <button
                                onClick={handleStartEdit}
                                className="px-6 py-2 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold flex items-center gap-2"
                            >
                                <span>✏️</span>
                                <span>편집</span>
                            </button>
                        )}
                    </div>
                    
                    {/* 프로필 정보 */}
                    <div className="p-8">
                        {!isEditing ? (
                            // 보기 모드
                            <div className="flex flex-col items-center">
                                {/* 프로필 사진 */}
                                <div className="mb-6">
                                    {userInfo.avatar ? (
                                        <img 
                                            src={userInfo.avatar} 
                                            alt="프로필 사진" 
                                            className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center border-4 border-pink-500 shadow-lg">
                                            <span className="text-5xl font-bold text-white">
                                                {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="w-full max-w-md space-y-6">
                                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                        <label className="text-sm text-pink-400 font-semibold uppercase tracking-wide">이메일</label>
                                        <p className="text-xl text-white mt-2">{userInfo.email}</p>
                                    </div>
                                    
                                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                        <label className="text-sm text-pink-400 font-semibold uppercase tracking-wide">이름</label>
                                        <p className="text-xl text-white mt-2">{userInfo.name}</p>
                                    </div>
                                    
                                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                        <label className="text-sm text-pink-400 font-semibold uppercase tracking-wide">소개</label>
                                        <p className="text-lg text-gray-300 mt-2">{userInfo.bio || '소개가 없습니다.'}</p>
                                    </div>
                                    
                                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-lg text-white font-medium">활성 상태</span>
                                    </div>
                                </div>
                                
                                {/* 액션 버튼 */}
                                <button 
                                    className="w-full max-w-md mt-8 bg-pink-500 text-white rounded-xl py-4 font-semibold text-lg hover:bg-pink-600 transition-colors shadow-lg"
                                    onClick={() => navigate('/')}
                                >
                                    홈으로 돌아가기
                                </button>
                            </div>
                        ) : (
                            // 수정 모드
                            <div className="max-w-md mx-auto space-y-6">
                                {/* 프로필 사진 미리보기 */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-4 border-pink-500 shadow-lg">
                                        {avatarUrl ? (
                                            <img 
                                                src={avatarUrl} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover"
                                                onError={() => setAvatarUrl('')}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-pink-600">
                                                <span className="text-5xl font-bold text-white">
                                                    {name.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 프로필 사진 URL */}
                                <div>
                                    <label className="block text-sm font-semibold text-pink-400 mb-2 uppercase tracking-wide">
                                        프로필 사진 URL
                                    </label>
                                    <input
                                        type="url"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 bg-gray-800 text-white transition-colors"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">이미지 URL을 입력하세요 (선택사항)</p>
                                </div>

                                {/* 이름 */}
                                <div>
                                    <label className="block text-sm font-semibold text-pink-400 mb-2 uppercase tracking-wide">
                                        이름 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 bg-gray-800 text-white transition-colors"
                                        placeholder="이름을 입력하세요"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-semibold text-pink-400 mb-2 uppercase tracking-wide">
                                        소개
                                    </label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 resize-none bg-gray-800 text-white transition-colors"
                                        placeholder="자기소개를 입력하세요"
                                        rows={4}
                                    />
                                </div>

                                {/* 버튼 */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setAvatarUrl('');
                                        }}
                                        className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold border border-gray-700"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={updateProfileMutation.isPending || !name.trim()}
                                        className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold disabled:bg-gray-700 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {updateProfileMutation.isPending ? '저장 중...' : '저장'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;