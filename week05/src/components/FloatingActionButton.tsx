// src/components/FloatingActionButton.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const FloatingActionButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <>
        <button
            onClick={handleClick}
            className="fixed right-6 bottom-6 z-40 
                       w-14 h-14 rounded-full 
                       bg-pink-600 text-white text-3xl font-light 
                       flex items-center justify-center 
                       shadow-xl hover:bg-pink-700 transition-colors duration-300"
            aria-label="Add new item"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>

        <Modal isOpen={isModalOpen} onClose={closeModal} title="새 항목 등록 폼">
            {/* 모달 내부에 들어갈 콘텐츠를 children으로 전달 */}
            <p className="text-gray-700">여기에 새 항목의 제목, 내용, 기타 정보 등을 입력하는 폼 요소를 추가하세요.</p>
            <input 
                type="text" 
                placeholder="항목 제목" 
                className="w-full mt-4 p-2 border border-gray-300 rounded"
            />
        </Modal>
        </>
    );
};

export default FloatingActionButton;