import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRedirectIfAuthed } from "../hooks/useRedirectIfAuthed";
import { saveSession } from "../lib/auth";

/** Zod 스키마: 이메일/비밀번호 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  useRedirectIfAuthed(); // 이미 로그인 상태면 홈으로 이동
  const nav = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginForm>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(
          payload?.message || "로그인에 실패했어요. 입력 정보를 확인해주세요."
        );
      }

      // { accessToken, user } 가정
      const json = await res.json();
      saveSession(json.accessToken, json.user);
      nav("/", { replace: true });
    } catch (err: any) {
      setServerError(err?.message ?? "문제가 발생했어요. 잠시 후 다시 시도해주세요.");
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
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          돌아가기
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 shadow-xl">
          <h1 className="mb-6 text-center text-2xl font-bold text-white">로그인</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 이메일 */}
            <div>
              <input
                type="email"
                placeholder="이메일을 입력해주세요!"
                autoComplete="email"
                {...register("email")}
                className={`w-full rounded-lg bg-black px-4 py-3 placeholder-gray-400 outline-none ring-1 focus:ring-2 ${
                  errors.email
                    ? "ring-red-500 focus:ring-red-500"
                    : "ring-white/10 focus:ring-[#E52B12]"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 비밀번호 + 가시성 토글 */}
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요!"
                autoComplete="current-password"
                {...register("password")}
                className={`w-full rounded-lg bg-black px-4 py-3 pr-11 placeholder-gray-400 outline-none ring-1 focus:ring-2 ${
                  errors.password
                    ? "ring-red-500 focus:ring-red-500"
                    : "ring-white/10 focus:ring-[#E52B12]"
                }`}
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
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 서버 에러 */}
            {serverError && (
              <p className="text-sm text-red-400" role="alert">
                {serverError}
              </p>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full rounded-lg px-4 py-3 font-semibold text-white ${
                !isValid || isSubmitting
                  ? "bg-pink-600/50 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>

            {/* 회원가입 링크 */}
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
