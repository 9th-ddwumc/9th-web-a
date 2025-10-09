import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRedirectIfAuthed } from "../hooks/useRedirectIfAuthed";
import { saveSession } from "../lib/auth";

export default function LoginPage() {
  useRedirectIfAuthed(); // ✅ 이미 로그인 상태면 자동 홈 이동
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const disabled = !email || !password || loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    setErrMsg("");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        const msg =
          (await res.json().catch(() => ({})))?.message ??
          "로그인에 실패했어요. 입력 값을 확인해주세요.";
        throw new Error(msg);
      }

      // { accessToken, user } 형태 가정
      const data = await res.json();
      saveSession(data.accessToken, data.user); // ✅ 토큰+유저 저장
      nav("/", { replace: true });             // ✅ 홈으로 이동
    } catch (err: any) {
      setErrMsg(err?.message ?? "문제가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          돌아가기
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 shadow-xl">
          <h1 className="mb-6 text-center text-2xl font-bold text-white">로그인</h1>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* 이메일 */}
            <div>
              <input
                type="email"
                placeholder="이메일을 입력해주세요!"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-black px-4 py-3 placeholder-gray-400 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#E52B12]"
              />
            </div>

            {/* 비밀번호 + 보이기 토글 */}
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-black px-4 py-3 pr-11 placeholder-gray-400 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#E52B12]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                aria-pressed={showPw}
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보이기"}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>

            {/* 에러 메시지 */}
            {errMsg && (
              <p className="text-sm text-red-400" role="alert">
                {errMsg}
              </p>
            )}

            {/* 버튼 */}
            <button
              type="submit"
              disabled={disabled}
              className={`w-full rounded-lg px-4 py-3 font-semibold text-white ${
                disabled
                  ? "bg-pink-600/50 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            {/* 보조 링크 */}
            <div className="pt-2 text-center text-sm text-gray-400">
              계정이 없으신가요?{" "}
              <Link to="/signup" className="text-pink-400 hover:underline">
                회원가입
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
