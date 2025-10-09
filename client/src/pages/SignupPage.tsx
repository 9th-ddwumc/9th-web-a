import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import StrengthMeter from "../components/StrengthMeter";
import { passwordStrength } from "../utils/validators";

type Step = 1 | 2 | 3;

interface SignupForm {
  email: string;
  password: string;
  confirm: string;
  nickname: string;
  agree: boolean;
}

export default function SignupPage() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }, // ⬅️ isValid, touchedFields 제거
  } = useForm<SignupForm>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
      nickname: "",
      agree: false,
    },
  });

  const email = watch("email");
  const password = watch("password");
  const confirm = watch("confirm");
  const nickname = watch("nickname");
  const agree = watch("agree");

  const onSubmit = async (data: SignupForm) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            nickname: data.nickname,
          }),
        }
      );

      if (!res.ok) throw new Error("회원가입 실패");
      const json = await res.json(); // { accessToken, user }

      localStorage.setItem("accessToken", json.accessToken);
      localStorage.setItem("user", JSON.stringify(json.user));

      nav("/", { replace: true });
    } catch (err) {
      alert("회원가입 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  // 단계별 유효성 (watch + errors 기반)
  const step1Valid =
    !!email &&
    !!password &&
    !!confirm &&
    !errors.email &&
    !errors.password &&
    !errors.confirm &&
    password === confirm &&
    passwordStrength(password) >= 3;

  const step2Valid = !!nickname && !errors.nickname;
  const step3Valid = agree === true && !errors.agree;

  const goNext = () => {
    if (step === 1 && step1Valid) setStep(2);
    else if (step === 2 && step2Valid) setStep(3);
  };
  const goPrev = () => setStep((s) => (s === 3 ? 2 : 1));

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => (step === 1 ? nav(-1) : goPrev())}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {step === 1 ? "돌아가기" : "이전 단계"}
        </button>

        <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 shadow-xl">
          {/* 진행 표시 */}
          <div className="mb-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Dot active={step >= 1} /> <Bar />
            <Dot active={step >= 2} /> <Bar />
            <Dot active={step >= 3} />
          </div>

          <h1 className="mb-6 text-center text-2xl font-bold text-white">회원가입</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <section className="space-y-4">
                {/* 이메일 */}
                <div>
                  <input
                    type="email"
                    placeholder="이메일을 입력해주세요!"
                    {...register("email", {
                      required: "이메일을 입력해주세요.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "올바른 이메일 형식을 입력해주세요.",
                      },
                    })}
                    className={`w-full rounded-lg bg-black px-4 py-3 placeholder-gray-400 outline-none ring-1 focus:ring-2 ${
                      errors.email ? "ring-red-500 focus:ring-red-500" : "ring-white/10 focus:ring-[#E52B12]"
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>

                {/* 비밀번호 */}
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="비밀번호를 입력해주세요!"
                    {...register("password", {
                      required: "비밀번호를 입력해주세요.",
                      minLength: { value: 8, message: "비밀번호는 최소 8자 이상이어야 합니다." },
                      validate: (v: string) =>
                        passwordStrength(v) >= 3 || "영문/숫자/특수문자 중 2가지 이상을 포함해주세요.",
                    })}
                    className={`w-full rounded-lg bg-black px-4 py-3 pr-11 placeholder-gray-400 outline-none ring-1 focus:ring-2 ${
                      errors.password ? "ring-red-500 focus:ring-red-500" : "ring-white/10 focus:ring-[#E52B12]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-pressed={showPw}
                    aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보이기"}
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                  {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                  <StrengthMeter value={passwordStrength(password)} />
                </div>

                {/* 비밀번호 확인 */}
                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력해주세요!"
                    {...register("confirm", {
                      required: "비밀번호 확인을 입력해주세요.",
                      validate: (v: string) => v === password || "비밀번호가 일치하지 않습니다.",
                    })}
                    className={`w-full rounded-lg bg-black px-4 py-3 pr-11 placeholder-gray-400 outline-none ring-1 focus:ring-2 ${
                      errors.confirm ? "ring-red-500 focus:ring-red-500" : "ring-white/10 focus:ring-[#E52B12]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-pressed={showConfirmPw}
                    aria-label={showConfirmPw ? "비밀번호 숨기기" : "비밀번호 보이기"}
                  >
                    {showConfirmPw ? "🙈" : "👁️"}
                  </button>
                  {errors.confirm && <p className="mt-1 text-xs text-red-400">{errors.confirm.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!step1Valid}
                    className={`w-full rounded-lg px-4 py-3 font-semibold text-white ${
                      step1Valid ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-600 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    다음 (1/3)
                  </button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-4">
                {/* 닉네임 */}
                <div>
                  <input
                    type="text"
                    placeholder="닉네임을 입력해주세요!"
                    {...register("nickname", {
                      required: "닉네임을 입력해주세요.",
                      minLength: { value: 2, message: "닉네임은 2자 이상이어야 합니다." },
                    })}
                    className={`w-full rounded-lg bg-black px-4 py-3 placeholder-gray-400 outline-none ring-1 focus:ring-2 ${
                      errors.nickname ? "ring-red-500 focus:ring-red-500" : "ring-white/10 focus:ring-[#E52B12]"
                    }`}
                  />
                  {errors.nickname && <p className="mt-1 text-xs text-red-400">{errors.nickname.message}</p>}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="w-1/2 rounded-lg border border-white/20 px-4 py-3 text-white hover:bg-white/10"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!step2Valid}
                    className={`w-1/2 rounded-lg px-4 py-3 font-semibold text-white ${
                      step2Valid ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-600 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    다음 (2/3)
                  </button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-4">
                {/* 약관 동의 */}
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    {...register("agree", { required: "약관에 동의해야 가입할 수 있습니다." })}
                    className="size-4 accent-pink-600"
                  />
                  서비스 이용약관 및 개인정보 처리방침에 동의합니다.
                </label>
                {errors.agree && <p className="mt-1 text-xs text-red-400">{errors.agree.message}</p>}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="w-1/2 rounded-lg border border-white/20 px-4 py-3 text-white hover:bg-white/10"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    disabled={!(step1Valid && step2Valid && step3Valid)}
                    className={`w-1/2 rounded-lg px-4 py-3 font-semibold text-white ${
                      step1Valid && step2Valid && step3Valid
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-pink-600 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    가입 완료 (3/3)
                  </button>
                </div>
              </section>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function Dot({ active }: { active: boolean }) {
  return <span className={`inline-block size-2 rounded-full ${active ? "bg-pink-500" : "bg-white/20"}`} />;
}
function Bar() {
  return <span className="inline-block h-0.5 w-8 bg-white/10" />;
}
