// src/component/DeleteAccountConfirmationModal.tsx

import React from 'react';
import { useDeleteAccountMutation } from "../hooks/mutations/useAuthMutations";
import { useAuth } from '../context/AuthContext';

interface DeleteAccountConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DeleteAccountConfirmationModal: React.FC<DeleteAccountConfirmationModalProps> = ({ isOpen, onClose }) => {
    const deleteAccountMutation = useDeleteAccountMutation();
    const { accessToken } = useAuth();

    // 모달이 열리지 않았거나 로그인 상태가 아니면 렌더링하지 않음
    if (!isOpen || !accessToken) return null;

    // 탈퇴 처리
    const handleDeleteAccount = () => {
        deleteAccountMutation.mutate(undefined, {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                // Mutation 내부에서 이미 alert 처리됨
                onClose();
            }
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4" 
            onClick={onClose}
        >
            <div 
                className="bg-gray-900 rounded-lg p-8 max-w-sm w-full border border-gray-800"
                onClick={(e) => e.stopPropagation()} 
            >
                <h2 className="text-xl font-bold mb-4 text-white text-center">정말 탈퇴하시겠습니까?</h2>
                <p className="text-gray-400 mb-6 text-center">회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={deleteAccountMutation.isPending}
                        className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        아니오
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={deleteAccountMutation.isPending}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-900 disabled:opacity-50"
                    >
                        {deleteAccountMutation.isPending ? '탈퇴 처리 중...' : '예'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountConfirmationModal;