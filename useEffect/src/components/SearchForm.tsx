// src/components/SearchForm.tsx

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

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg mb-6 max-w-4xl mx-auto border border-gray-100">
            
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="영화 제목을 입력하세요"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="w-full p-2 pl-4 border-b border-gray-300 focus:outline-none focus:border-black text-gray-800"
                    />
                </div>
                
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

            <div className="flex items-center gap-4 mt-2">
                
                <div className="relative w-48">
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="ko-KR">한국어</option>
                        <option value="en-US">영어</option>
                        <option value="ja-JP">일본어</option>
                    </select>
                    <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                
                <button
                    type="submit"
                    onClick={handleButtonClick}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
                >
                    <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        검색하기
                    </span>
                </button>
            </div>
        </form>
    );
});