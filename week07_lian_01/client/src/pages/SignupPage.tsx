import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import z from "zod";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log("회원가입 시도:", data);
    const { passwordCheck, ...rest } = data;

    try {
      setApiError("");
      const response = await postSignup(rest);
      console.log("회원가입 성공:", response);
      
      setIsSuccess(true);
      
      // 성공 메시지 표시 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      
      // 에러 메시지 표시
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.status === 409) {
        setApiError("이미 존재하는 이메일입니다.");
      } else {
        setApiError("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-dvh bg-gray-200">
      <div className="flex items-center justify-between w-[300px] p-[10px] border-transparent">
        <div className="flex-1 text-left" onClick={() => navigate(-1)}>
          <span className="cursor-pointer text-xl">⏮</span>
        </div>
        <div className="flex-1 text-center font-semibold text-lg">회원가입</div>
        <div className="flex-1"></div>
      </div>
      
      {/* 성공 메시지 */}
      {isSuccess && (
        <div className="w-[300px] p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          회원가입이 완료되었습니다! 로그인 페이지로 이동합니다...
        </div>
      )}
      
      {/* API 에러 메시지 */}
      {apiError && (
        <div className="w-[300px] p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {apiError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="text-center border border-[black] w-[300px] p-[10px] rounded-sm cursor-pointer hover:bg-gray-100">
          구글 회원가입
        </div>
        
        <p className="text-center">-------------OR-------------</p>
        
        <input
          {...register("email")}
          type="email"
          placeholder="이메일을 입력해주세요!"
          className={`border w-[300px] p-[10px] rounded-sm focus:outline-none focus:border-[#807bff] ${
            errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <div className="text-red-500 text-sm">{errors.email.message}</div>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호를 입력해주세요!"
          className={`border w-[300px] p-[10px] rounded-sm focus:outline-none focus:border-[#807bff] ${
            errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password.message}</div>
        )}
        
        <input
          {...register("passwordCheck")}
          type="password"
          placeholder="비밀번호를 확인합니다!"
          className={`border w-[300px] p-[10px] rounded-sm focus:outline-none focus:border-[#807bff] ${
            errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
        />
        {errors.passwordCheck && (
          <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>
        )}

        <input
          {...register("name")}
          type="text"
          placeholder="이름을 입력해주세요!"
          className={`border w-[300px] p-[10px] rounded-sm focus:outline-none focus:border-[#807bff] ${
            errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <div className="text-red-500 text-sm">{errors.name.message}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "회원가입 중..." : isSuccess ? "완료!" : "회원가입"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;