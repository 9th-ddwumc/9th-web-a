import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { postSignup } from '../apis/auth';

const schema = z.object({
    email: z.string().email({ message: '올바른 이메일 형식이 아닙니다.' }),
    password: z
        .string()
        .min(8, {
            message: '비밀번호는 8자 이상이어야 합니다.'
        })
        .max(20, {
            message: '비밀번호는 20자 이하여야 합니다.'
        }),
    passwordCheck: z
        .string()
        .min(8, {
            message: '비밀번호는 8자 이상이어야 합니다.'
        })
        .max(20, {
            message: '비밀번호는 20자 이하여야 합니다.'
        }),
    name: z.string().min(1, { message: '이름을 입력해주세요.' })
}).refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ["passwordCheck"],
});

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordCheck: '',
        },
        resolver: zodResolver(schema),
        mode: 'onBlur'
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const { passwordCheck, ...rest } = data;
            const response = await postSignup(rest);
            
            if (response) {
                alert('회원가입이 완료되었습니다!');
                navigate('/login');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 뒤로 가기 버튼 */}
            <div className="p-4">
                <button 
                    onClick={handleGoBack}
                    className="text-2xl text-gray-700 hover:text-gray-900 transition-colors"
                    aria-label="뒤로 가기"
                >
                    &lt;
                </button>
            </div>
            
            {/* 회원가입 폼 */}
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-[300px]">
                    <input 
                        {...register('email')}
                        className={`border w-full p-[10px] rounded-sm focus:outline-none focus:border-[#807bff]
                            ${errors?.email ? 'border-red-500 bg-red-50' : 'border-[#ccc]'}`}
                        type="email"
                        placeholder="이메일"
                    />
                    {errors?.email && (
                        <div className="text-red-500 text-sm">{errors.email.message}</div>
                    )}
                    
                    <input 
                        {...register('password')}
                        className={`border w-full p-[10px] rounded-sm focus:outline-none focus:border-[#807bff]
                            ${errors?.password ? 'border-red-500 bg-red-50' : 'border-[#ccc]'}`}
                        type="password"
                        placeholder="비밀번호"
                    />
                    {errors?.password && (
                        <div className="text-red-500 text-sm">{errors.password.message}</div>
                    )}
                    
                    <input 
                        {...register('passwordCheck')}
                        className={`border w-full p-[10px] rounded-sm focus:outline-none focus:border-[#807bff]
                            ${errors?.passwordCheck ? 'border-red-500 bg-red-50' : 'border-[#ccc]'}`}
                        type="password"
                        placeholder="비밀번호 확인"
                    />
                    {errors?.passwordCheck && (
                        <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>
                    )}
                    
                    <input 
                        {...register('name')}
                        className={`border w-full p-[10px] rounded-sm focus:outline-none focus:border-[#807bff]
                            ${errors?.name ? 'border-red-500 bg-red-50' : 'border-[#ccc]'}`}
                        type="text"
                        placeholder="이름"
                    />
                    {errors?.name && (
                        <div className="text-red-500 text-sm">{errors.name.message}</div>
                    )}
                    
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? '처리 중...' : '회원가입'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;