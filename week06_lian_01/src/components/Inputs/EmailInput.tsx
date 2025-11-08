import type { UseFormRegister, FieldError } from "react-hook-form";

interface EmailInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

const EmailInput = ({ register, error }: EmailInputProps) => {
  return (
    <>
      <input
        {...register("email")}
        type="email"
        placeholder="이메일을 입력해 주세요."
        className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] text-white placeholder-white ${
          error ? 'border-red-500 bg-red-200' : 'border-gray-300'
        }`}
      />
      {error && <div className='text-red-500 text-sm'>{error.message}</div>}
    </>
  );
};

export default EmailInput;