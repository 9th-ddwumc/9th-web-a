// src/components/FloatingActionButton.tsx

import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
    const navigate = useNavigate();

    // 💡 버튼 클릭 시 이동할 경로 (예: 새 LP 등록 페이지)
    const handleClick = () => {
        // navigate('/add-new-lp'); // 실제 경로로 수정하세요
        console.log("플로팅 버튼 클릭: 새 항목 등록 페이지로 이동");
        alert("새 항목 등록 페이지로 이동합니다.");
    };

    return (
        <button
            onClick={handleClick}
            // 💡 fixed로 화면에 고정, right-6, bottom-6으로 우측 하단 배치
            // 💡 bg-pink-600으로 배경색 지정 및 원형(rounded-full), 그림자(shadow-lg) 추가
            className="fixed right-6 bottom-6 z-40 
                       w-14 h-14 rounded-full 
                       bg-pink-600 text-white text-3xl font-light 
                       flex items-center justify-center 
                       shadow-xl hover:bg-pink-700 transition-colors duration-300"
            aria-label="Add new item"
        >
            {/* '+' 아이콘 */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
    );
};

export default FloatingActionButton;