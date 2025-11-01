import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { LOCAL_STORAGE_KEYS } from "../constants/key";

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

const API = (import.meta.env.VITE_SERVER_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? "").trim();
const START_PATH = (import.meta.env.VITE_GOOGLE_START_PATH ?? "/v1/auth/google").trim();
const REDIRECT_PARAM = String(import.meta.env.VITE_GOOGLE_REDIRECT_PARAM ?? "redirect_uri").trim();
const REDIRECT_VALUE = (import.meta.env.VITE_GOOGLE_REDIRECT_VALUE ?? "http://localhost:5173").trim();

const buildGoogleUrl = () => {
  if (!API) return "";
  const base = API.replace(/\/+$/, "");
  const path = START_PATH.startsWith("/") ? START_PATH : `/${START_PATH}`;
  if (REDIRECT_PARAM.toLowerCase() === "none") return `${base}${path}`;
  const qs = new URLSearchParams({ [REDIRECT_PARAM]: REDIRECT_VALUE }).toString();
  return `${base}${path}?${qs}`;
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const at = url.searchParams.get("accessToken");
    const rt = url.searchParams.get("refreshToken");
    if (at) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, JSON.stringify(at));
      if (rt) localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, JSON.stringify(rt));
      window.history.replaceState({}, "", window.location.origin + window.location.pathname);
      navigate("/mypage", { replace: true });
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({ mode: "onTouched", defaultValues: { remember: false } });

  const onSubmit = async (values: FormValues) => {
    try {
      setApiError("");
      await login({ email: values.email, password: values.password });
    } catch (error: any) {
      if (error?.response?.data?.message) setApiError(error.response.data.message);
      else if (error?.response?.status) setApiError(`로그인에 실패했습니다. (${error.response.status})`);
      else if (error?.request) setApiError("서버에 연결할 수 없습니다.");
      else setApiError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  const handleGoogleLogin = () => {
    const url = buildGoogleUrl();
    if (!url) {
      alert("API 주소가 비어 있습니다. client/.env를 확인하고 dev 서버를 재시작하세요.");
      return;
    }
    window.location.href = url;
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b]/95 shadow-2xl backdrop-blur p-8 md:p-10">
          <div className="flex flex-col items-center">
            <div className="mb-5 inline-flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500">
              <svg width="28" height="28" viewBox="0 0 24 24" className="text-white">
                <path fill="currentColor" d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2Zm-6 0h2V6a2 2 0 10-4 0v2Zm6 12H7v-8h10v8Z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">로그인</h1>
            <p className="mt-2 text-sm text-gray-400">계정에 로그인하여 계속하세요</p>
          </div>

          {apiError && (
            <div className="mt-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{apiError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-8 mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition"
          >
            <GoogleIcon />
            <span className="text-sm">구글 로그인</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0b0b0b] px-3 text-xs text-gray-400">또는</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">이메일</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={`w-full rounded-lg bg-black/40 pl-10 pr-3 py-3 outline-none ring-1 focus:ring-2 placeholder:text-gray-500 ${
                    errors.email ? "ring-red-500 focus:ring-red-500" : "ring-white/10 focus:ring-indigo-500"
                  }`}
                  {...register("email", {
                    required: "이메일을 입력해주세요.",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "올바른 이메일 형식이 아닙니다." },
                  })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">비밀번호</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <LockIcon />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full rounded-lg bg-black/40 pl-10 pr-10 py-3 outline-none ring-1 focus:ring-2 placeholder:text-gray-500 ${
                    errors.password ? "ring-red-500 focus:ring-red-500" : "ring-white/10 focus:ring-indigo-500"
                  }`}
                  {...register("password", {
                    required: "비밀번호를 입력해주세요.",
                    minLength: { value: 8, message: "비밀번호는 8자 이상 20자 이하입니다." },
                    maxLength: { value: 20, message: "비밀번호는 8자 이상 20자 이하입니다." },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                  aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보이기"}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" className="size-4 accent-indigo-600" {...register("remember")} />
                로그인 상태 유지
              </label>
              <button type="button" className="text-sm text-indigo-400 hover:underline">
                비밀번호 찾기
              </button>
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="mt-3 w-full rounded-lg px-4 py-3 font-semibold transition bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-400">또는</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition"
            >
              <GoogleIcon />
              <span className="text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition">
              <GithubIcon />
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            계정이 없으신가요? <Link to="/signup" className="text-fuchsia-400 hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42v-.1H24v7.2h11.3C33.8 32 29.3 35.6 24 35.6c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.1-5.1C33.3 6.3 28.9 4.4 24 4.4 12.7 4.4 3.6 13.5 3.6 24.8S12.7 45.2 24 45.2 44.4 36.1 44.4 24.8c0-1.5-.1-2.9-.8-4.3z"/>
      <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3c1.6-3.9 5.4-6.6 9.8-6.6 3 0 5.7 1.1 7.8 3l5.1-5.1C33.3 6.3 28.9 4.4 24 4.4c-7.5 0-13.9 4.3-17.7 10.3z"/>
      <path fill="#4CAF50" d="M24 45.2c5.2 0 9.9-2 13.3-5.3l-6.1-5c-2 1.4-4.6 2.2-7.2 2.2-5.2 0-9.6-3.5-11.1-8.3l-6.1 4.7c3.8 7 11.1 11.7 19.2 11.7z"/>
      <path fill="#1976D2" d="M43.6 20.5H42v-.1H24v7.2h11.3c-1 2.9-3 5.2-5.6 6.7l6.1 5c3.6-3.3 5.8-8.1 5.8-14.5 0-1.5-.1-2.9-.8-4.3z"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="text-white">
      <path fill="currentColor" d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.61-3.37-1.19-3.37-1.19a2.66 2.66 0 00-1.11-1.47c-.91-.62.07-.61.07-.61a2.11 2.11 0 011.54 1 2.15 2.15 0 002.94.84 2.15 2.15 0 01.64-1.35c-2.22-.25-4.56-1.11-4.56-4.95A3.88 3.88 0 016 7.72a3.6 3.6 0 01-.1-2.65s.84-.27 2.75 1.03a9.48 9.48 0 015 0C16.76 4.8 17.6 5.07 17.6 5.07a3.6 3.6 0 01.1 2.65 3.88 3.88 0 011.03 2.69c0 3.85-2.34 4.69-4.57 4.94a2.41 2.41 0 01.69 1.87v2.78c0 .27.18.58.69.48A10 10 0 0012 2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2Zm-6 0h2V6a2 2 0 10-4 0v2Zm6 12H7v-8h10v8Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 110-10 5 5 0 010 10Zm0-2.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5Z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 4.27 3.28 3 21 20.72 19.73 22l-3.13-3.13A10.9 10.9 0 0112 19C5 19 2 12 2 12a20.4 20.4 0 014.48-5.88L2 4.27ZM12 7a5 5 0 014.58 2.86l-1.46 1.46A2.5 2.5 0 009.68 11l-1.5-1.5A5 5 0 0112 7Zm0 10a5 5 0 01-5-5c0-.38.05-.75.15-1.11l7 7c-.36.1-.73.11-1.11.11Z" />
    </svg>
  );
}
