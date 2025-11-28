// src/components/SearchForm.tsx (UI 디테일 수정)

import React from 'react';

interface SearchFormProps {
    title: string;
    language: string;
    includeAdult: boolean;
    onTitleChange: (value: string) => void;
    onLanguageChange: (value: string) => void;
    onIncludeAdultChange: (checked: boolean) => void;
    onSubmit: () => void;
}

export const SearchForm = React.memo(({
    title,
    language,
    includeAdult,
    onTitleChange,
    onLanguageChange,
    onIncludeAdultChange,
    onSubmit,
}: SearchFormProps) => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        // UI 이미지와 같이 흰색 배경, 그림자 처리
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg mb-6 max-w-4xl mx-auto border border-gray-100">
            
            {/* 첫 번째 행: 영화 제목 입력 및 성인 콘텐츠 표시 */}
            <div className="flex items-center gap-4">
                {/* 🎬 영화 제목 입력 */}
                <div className="relative flex-1">
                    {/* Placeholder 예시 반영: "영화 제목을 입력하세요" */}
                    <input
                        type="text"
                        placeholder="영화 제목을 입력하세요"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="w-full p-2 pl-4 border-b border-gray-300 focus:outline-none focus:border-black text-gray-800"
                    />
                </div>
                
                {/* 🔞 성인 콘텐츠 표시 여부 (체크박스) */}
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <input
                        id="adult-checkbox"
                        type="checkbox"
                        checked={includeAdult}
                        onChange={(e) => onIncludeAdultChange(e.target.checked)}
                        className="size-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                    />
                    <label htmlFor="adult-checkbox" className="text-sm text-gray-700">
                        성인 콘텐츠 표시
                    </label>
                </div>
            </div>

            {/* 두 번째 행: 언어 선택 드롭다운 및 검색 버튼 */}
            <div className="flex items-center gap-4 mt-2">
                
                {/* 🌐 언어 선택 (이미지 6c8033.png의 드롭다운 스타일 반영) */}
                <div className="relative w-48">
                    {/* 실제 select 박스는 보이지 않도록 하고, 커스텀 드롭다운처럼 보이게 합니다. */}
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                        {/* 이미지 6c8033.png의 옵션 목록 반영 */}
                        <option value="ko-KR">한국어</option>
                        <option value="en-US">영어</option>
                        <option value="ja-JP">일본어</option>
                    </select>
                    {/* 커스텀 드롭다운 화살표 */}
                    <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                {/* 검색 버튼 */}
                <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                    {/* 이미지 6c802e.png의 검색하기 버튼 스타일 반영 */}
                    <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        검색하기
                    </span>
                </button>
            </div>
        </form>
    );
});