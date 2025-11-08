import { useState } from "react";
import type { UseFormRegister, FieldError } from "react-hook-form";
import { PiEye, PiEyeClosed } from 'react-icons/pi';

interface PasswordInputProps {
  register: UseFormRegister<any>;
  name: "password" | "passwordCheck";
  error?: FieldError;
  placeholder?: string;
}

const PasswordInput = ({ register, name, error, placeholder }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const defaultPlaceholder = name === "password" 
    ? "비밀번호를 입력해 주세요."
    : "비밀번호를 다시 입력해 주세요.";

  return (
    <div className='flex flex-col gap-1'>
      <div className='relative flex items-center w-[300px]'>
        <input
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder || defaultPlaceholder}
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] text-white placeholder-white ${
            error ? 'border-red-500 bg-red-200' : 'border-gray-300'
          }`}
        />
        <span
          className='absolute right-3 cursor-pointer text-gray-400'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <PiEye size={20} /> : <PiEyeClosed size={20} />}
        </span>
      </div>
      {error && <div className='text-red-500 text-sm'>{error.message}</div>}
    </div>
  );
};

export default PasswordInput;