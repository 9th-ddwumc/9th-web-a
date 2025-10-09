import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => nav(-1)}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          돌아가기
        </button>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 shadow-xl">
          <h1 className="mb-6 text-center text-2xl font-bold">로그인</h1>

          <button
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-3 hover:bg-white/5"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42v-.1H24v7.2h11.3C33.8 32 29.3 35.6 24 35.6c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.1-5.1C33.3 6.3 28.9 4.4 24 4.4 12.7 4.4 3.6 13.5 3.6 24.8S12.7 45.2 24 45.2 44.4 36.1 44.4 24.8c0-1.5-.1-2.9-.8-4.3z"/>
              <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3c1.6-3.9 5.4-6.6 9.8-6.6 3 0 5.7 1.1 7.8 3l5.1-5.1C33.3 6.3 28.9 4.4 24 4.4c-7.5 0-13.9 4.3-17.7 10.3z"/>
              <path fill="#4CAF50" d="M24 45.2c5.2 0 9.9-2 13.3-5.3l-6.1-5c-2 1.4-4.6 2.2-7.2 2.2-5.2 0-9.6-3.5-11.1-8.3l-6.1 4.7c3.8 7 11.1 11.7 19.2 11.7z"/>
              <path fill="#1976D2" d="M43.6 20.5H42v-.1H24v7.2h11.3c-1 2.9-3 5.2-5.6 6.7l6.1 5c3.6-3.3 5.8-8.1 5.8-14.5 0-1.5-.1-2.9-.8-4.3z"/>
            </svg>
            구글 로그인
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0b0b0b] px-3 text-xs text-gray-400">OR</span>
            </div>
          </div>

          <form className="space-y-3">
            <input
              type="email"
              placeholder="이메일을 입력해주세요!"
              className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 placeholder-gray-400 outline-none focus:border-[#E52B12]"
            />
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 placeholder-gray-400 outline-none focus:border-[#E52B12]"
            />
            <button
              type="button"
              className="w-full rounded-lg bg-[#E52B12] px-4 py-3 font-semibold text-white disabled:opacity-50"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
