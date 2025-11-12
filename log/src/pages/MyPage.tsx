// src/pages/MyPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useUpdateProfileMutation } from "../hooks/mutations/useUserMutations";
import { Loading, ErrorDisplay } from "../component/LoadingError"; 

const MyPage = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null); 
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(null); // 초기 아바타 URL 저장
    
    const { data: userInfo, isPending, isError, refetch } = useGetMyInfo(!!accessToken);
    const updateProfileMutation = useUpdateProfileMutation(); 
    
    // 수정 모드 시작
    const handleStartEdit = () => {
        if (userInfo) {
            setName(userInfo.name || '');
            setBio(userInfo.bio || '');
            setAvatarFile(null); 
            setPreviewUrl(userInfo.avatar || null); 
            setInitialAvatarUrl(userInfo.avatar || null); // 초기값 저장
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
        } else {
            // 파일을 선택 취소한 경우 (input reset 또는 같은 파일 재선택)
            setAvatarFile(null);
            setPreviewUrl(initialAvatarUrl); 
        }
    };

    // 아바타 미리보기 제거 버튼
    const handleRemoveAvatar = () => {
        setAvatarFile(null); 
        setPreviewUrl(null); 
    };
    
    // 프로필 저장
    const handleSaveProfile = () => {
        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }

        const updateData = {
            name: name.trim(),
            bio: bio.trim() || null,
            avatarFile: avatarFile, 
            // 아바타 URL 제거 요청 여부 (boolean)
            avatarUrlToRemove: !!(initialAvatarUrl && previewUrl === null && avatarFile === null),
        };
        
        updateProfileMutation.mutate(
            updateData,
            {
                onSuccess: (data) => {
                    setIsEditing(false);
                    setAvatarFile(null);
                    // 서버 응답에서 최종 아바타 URL을 받아 initialAvatarUrl 업데이트
                    setInitialAvatarUrl(data.avatar || null); 
                },
                onError: () => {
                    setIsEditing(false); 
                    setAvatarFile(null);
                    setPreviewUrl(initialAvatarUrl); 
                }
            }
        );
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
        <div className="min-h-screen bg-black py-8 px-4"> 
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-800"> 
                    {/* 헤더 */}
                    <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700"> 
                        <h1 className="text-xl font-semibold text-white">프로필</h1>
                        {!isEditing && (
                            <button
                                onClick={handleStartEdit}
                                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium" 
                            >
                                ⚙️ 설정
                            </button>
                        )}
                    </div>
                    
                    {/* 프로필 정보 */}
                    <div className="p-6">
                        {!isEditing ? (
                            // 보기 모드
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    {userInfo.avatar ? (
                                        <img 
                                            src={userInfo.avatar} 
                                            alt="프로필 사진" 
                                            className="w-24 h-24 rounded-full object-cover border-2 border-pink-500" 
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                                            <span className="text-3xl font-bold text-white">
                                                {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 space-y-4 text-gray-300"> 
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">ID (이메일)</label>
                                        <p className="text-lg text-white mt-1">{userInfo.email}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">이름</label>
                                        <p className="text-lg text-white mt-1">{userInfo.name}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm text-gray-500 font-medium">소개</label>
                                        <p className="text-lg text-white mt-1">{userInfo.bio || '소개가 없습니다.'}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <label className="text-sm text-gray-500 font-medium">계정 상태</label>
                                        <p className="text-lg text-white">로그인</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // 수정 모드
                            <div className="space-y-6">
                                {/* 프로필 사진 */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-2 border-pink-500">
                                        {previewUrl ? (
                                            <img 
                                                src={previewUrl} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-4xl font-bold text-white">
                                                    {name.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-500 file:text-white file:cursor-pointer hover:file:bg-pink-600" 
                                    />
                                    {/* 아바타 제거 버튼 (기존 URL이 있었거나 새 파일이 있는 경우) */}
                                    {(initialAvatarUrl || avatarFile) && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            아바타 제거
                                        </button>
                                    )}
                                    <p className="text-xs text-gray-500">프로필 사진 (선택사항)</p>
                                </div>

                                {/* 이름 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        이름 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 bg-gray-800 text-white" 
                                        placeholder="이름을 입력하세요"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        소개 (선택사항)
                                    </label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 resize-none bg-gray-800 text-white" 
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
                                            setAvatarFile(null);
                                            setPreviewUrl(initialAvatarUrl); // 취소 시 초기 URL로 복원
                                        }}
                                        className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium" 
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={updateProfileMutation.isPending || !name.trim()}
                                        className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium disabled:bg-gray-700 disabled:cursor-not-allowed" 
                                    >
                                        {updateProfileMutation.isPending ? '저장 중...' : '저장'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 액션 버튼들 (보기 모드에만 표시) */}
                        {!isEditing && (
                            <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col gap-3"> 
                                <button 
                                    className="w-full bg-cyan-400 text-black rounded-lg py-3 font-medium hover:bg-cyan-300 transition-colors" 
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