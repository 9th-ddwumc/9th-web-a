import type { UseFormRegister, FieldError } from "react-hook-form";

interface NameInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

const NameInput = ({ register, error }: NameInputProps) => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <img
          src="/profile.png"
          alt="프로필"
          className='w-24 h-24 rounded-full object-cover'
        />
      </div>
      <input
        {...register("name")}
        type="text"
        placeholder="닉네임을 입력해 주세요."
        className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] text-white placeholder-white ${
          error ? 'border-red-500 bg-red-200' : 'border-gray-300'
        }`}
      />
      {error && <div className='text-red-500 text-sm'>{error.message}</div>}
    </>
  );
};

export default NameInput;
