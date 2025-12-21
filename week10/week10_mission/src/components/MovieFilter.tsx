import React, { useState } from 'react';
import type { MovieFilterState } from '../types/movies';
import { LANGUAGE_OPTIONS } from '../constants/movie';

interface Props {
  onSearch: (filters: MovieFilterState) => void;
}

// React.memo를 사용하여 props(onSearch)가 바뀌지 않으면 리렌더링 방지
const MovieFilter = React.memo(({ onSearch }: Props) => {
  const [query, setQuery] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState('ko-KR');

  const handleSubmit = () => {
    onSearch({ query, includeAdult, language });
  };

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white mb-6">
      <div className="flex gap-4 flex-wrap">
        {/* 검색어 입력 */}
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="영화 제목 검색"
          className="border p-2 rounded"
        />
        
        {/* 성인 인증 체크박스 */}
        <label className="flex items-center gap-2">
            <input 
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => setIncludeAdult(e.target.checked)}
            />
            성인 콘텐츠 포함
        </label>

        {/* 언어 선택 */}
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 rounded"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button 
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          검색
        </button>
      </div>
    </div>
  );
});

export default MovieFilter;