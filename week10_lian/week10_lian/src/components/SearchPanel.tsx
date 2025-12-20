type Props = {
  query: string;
  onQueryChange: (v: string) => void;

  includeAdult: boolean;
  onIncludeAdultChange: (v: boolean) => void;

  language: "ko-KR" | "en-US" | "ja-JP";
  onLanguageChange: (v: "ko-KR" | "en-US" | "ja-JP") => void;

  onSubmit: (e: React.FormEvent) => void;
};

const languageOptions: Array<{ label: string; value: Props["language"] }> = [
  { label: "한국어", value: "ko-KR" },
  { label: "English", value: "en-US" },
  { label: "日本語", value: "ja-JP" },
];

export default function SearchPanel({
  query,
  onQueryChange,
  includeAdult,
  onIncludeAdultChange,
  language,
  onLanguageChange,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5"
    >
      {/* 1행: 영화 제목 / 옵션 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
            🎬 영화 제목
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="영화 제목을 입력하세요"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-300 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
            ⚙️ 옵션
          </label>

          <div className="flex h-[50px] items-center gap-3 rounded-xl border border-slate-200 px-4">
            <input
              id="adult"
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => onIncludeAdultChange(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="adult" className="text-slate-700">
              성인 콘텐츠 표시
            </label>
          </div>
        </div>
      </div>

      {/* 2행: 언어 */}
      <div className="mt-4">
        <label className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
          🌐 언어
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Props["language"])}
          className="h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-slate-300 focus:ring-4 focus:ring-blue-100"
        >
          {languageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 검색 버튼 */}
      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-4 text-white shadow-md hover:bg-blue-600 active:scale-[0.99]"
      >
        🔍 검색하기
      </button>
    </form>
  );
}
