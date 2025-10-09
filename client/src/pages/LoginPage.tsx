import { useForm } from "../hooks/useForm";

export default function LoginPage() {
  const { values, errors, touched, isValid, handleChange, handleBlur } = useForm(
    { email: "", password: "" },
    {
      email: [
        (v) => (!v ? "이메일을 입력해주세요." : null),
        (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "올바른 이메일 형식을 입력해주세요."),
      ],
      password: [
        (v) => (!v ? "비밀번호를 입력해주세요." : null),
        (v) => (v.length >= 6 ? null : "비밀번호는 최소 6자 이상이어야 합니다."),
      ],
    }
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    console.log("로그인 성공:", values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl bg-neutral-900 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">로그인</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* 이메일 */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력해주세요!"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`w-full rounded-lg px-3 py-2 bg-black text-white ring-1 outline-none ${
                errors.email && touched.email
                  ? "ring-red-500 focus:ring-red-500"
                  : "ring-gray-600 focus:ring-pink-500"
              }`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요!"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`w-full rounded-lg px-3 py-2 bg-black text-white ring-1 outline-none ${
                errors.password && touched.password
                  ? "ring-red-500 focus:ring-red-500"
                  : "ring-gray-600 focus:ring-pink-500"
              }`}
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full rounded-lg px-3 py-2 font-semibold text-white ${
              isValid
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-pink-600 opacity-50 cursor-not-allowed"
            }`}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
