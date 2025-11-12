import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putUserMe } from "../apis/auth";
import type { RequestUserUpdateDto, ResponseMyInfo } from "../types/auth"; // ✅ 올바른 위치에서 타입 import
import { QUERY_KEY } from "../constants/key";

interface ProfileEditModalProps {
    // userInfo는 MyPage에서 받은 현재 사용자 정보입니다.
    userInfo: NonNullable<ResponseMyInfo>; 
    // 모달을 닫는 함수입니다.
    onClose: () => void;
}

const MyPageModal = ({ userInfo, onClose }: ProfileEditModalProps) => {
    const queryClient = useQueryClient();
    
    // 폼 상태: null일 경우 빈 문자열로 초기화하여 폼에 바인딩
    const [name, setName] = useState(userInfo.name || '');
    const [bio, setBio] = useState(userInfo.bio || '');
    const [avatar, setAvatar] = useState(userInfo.avatar || '');

    // ✅ 프로필 수정 Mutation 구현
    const updateProfileMutation = useMutation({
        // API 함수: 이름, bio, 아바타를 서버에 전송합니다.
        mutationFn: (data: RequestUserUpdateDto) => putUserMe(data),
        onSuccess: () => {
            alert('프로필 정보가 수정되었습니다.');
            onClose();
            // 수정 성공 시, 사용자 정보 쿼리를 무효화하여 즉시 갱신합니다.
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
            // ✅ Bio, Avatar는 옵션이므로 빈 문자열일 경우 null로 처리하여 서버에 전송합니다.
            bio: bio.trim() || null, 
            avatar: avatar.trim() || null,
        };
        
        updateProfileMutation.mutate(updateData);
    };
    
    const isPending = updateProfileMutation.isPending;

    return (
        // ✅ 모달 바깥 영역 클릭 시 닫히도록 설정
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 방지
            >
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">프로필 수정</h2>
                    {/* ✅ 'X' 버튼 클릭 시 닫히도록 설정 */}
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl font-bold">
                        &times;
                    </button>
                </div>
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
                            onClick={onClose}
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
        </div>
    );
};

export default MyPageModal;