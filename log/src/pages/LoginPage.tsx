import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSignInformation } from "../utils/validate"; 
import { postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const LoginPage = () => {
    const {setItem}=useLocalStorage(LOCAL_STORAGE_KEY.accessToken)
    const navigate = useNavigate();
    
    const { values, errors, touched, getInputProps } = useForm<UserSignInformation>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: validateSignin,
    });

    const handleSubmit = async() => {
        console.log(values);
        try{
            const response = await postSignin(values);
            setItem(response.accessToken)
        }catch(error){
           alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const isDisabled = 
        Object.values(errors).some((error) => error.length > 0) || 
        Object.values(values).some((value) => value === ''); 

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 뒤로 가기 버튼 */}
            <div className="p-4">
                <button 
                    onClick={handleGoBack}
                    className="text-2xl text-gray-700 hover:text-gray-900 transition-colors "
                    aria-label="뒤로 가기"
                >
                    &lt;
                </button>
            </div>
            
            {/* 로그인 폼 */}
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="flex flex-col gap-3 w-[300px]">
                <input 
                    {...getInputProps('email')}
                    className={`border w-full p-[10px] rounded-sm focus:outline-none focus:border-[#807bff]
                        ${errors?.email && touched?.email ? 'border-red-500 bg-red-50' : 'border-[#ccc]'}`}
                    type="email"
                    placeholder="이메일"
                />
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                
                <input 
                    {...getInputProps('password')}
                    className={`border w-full p-[10px] rounded-sm focus:outline-none focus:border-[#807bff]
                        ${errors?.password && touched?.password ? 'border-red-500 bg-red-50' : 'border-[#ccc]'}`}
                    type="password"
                    placeholder="비밀번호"
                />
                {errors?.password && touched?.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}
                
                <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    로그인
                </button>
            </div>
        </div>
    </div>
    );
}
export default LoginPage;