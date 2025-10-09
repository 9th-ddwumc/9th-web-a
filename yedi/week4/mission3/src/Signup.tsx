import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocalStorage } from './hooks/useLocalStorage';

// 회원가입 데이터 타입 정의
interface SignupData {
  email: string;
  password: string;
  nickname: string;
}

// Zod 스키마 정의
const emailSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
});

const passwordSchema = z.object({
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

const nicknameSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요.'),
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type NicknameForm = z.infer<typeof nicknameSchema>;

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 이메일, 2: 비밀번호, 3: 닉네임
  const [signupData, setSignupData] = useState<Partial<SignupData>>({ email: '', password: '', nickname: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [, setUserData] = useLocalStorage<SignupData | null>('userData', null);

  // 이메일 폼
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  });

  // 비밀번호 폼
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  // 닉네임 폼
  const nicknameForm = useForm<NicknameForm>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
  });

  // 이메일 다음 단계
  const handleEmailNext = (data: EmailForm) => {
    setSignupData({ ...signupData, email: data.email });
    setStep(2);
  };

  // 비밀번호 다음 단계
  const handlePasswordNext = (data: PasswordForm) => {
    setSignupData({ ...signupData, password: data.password });
    setStep(3);
  };

  // 회원가입 완료
  const handleSignupComplete = (data: NicknameForm) => {
    const finalData: SignupData = { 
      email: signupData.email || '', 
      password: signupData.password || '', 
      nickname: data.nickname 
    };
    
    // localStorage에 저장
    setUserData(finalData);
    
    console.log('회원가입 완료:', finalData);
    alert(`회원가입 성공!\n이메일: ${finalData.email}\n닉네임: ${finalData.nickname}`);
    
    // 홈으로 이동
    navigate('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      {/* 상단 헤더 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 
          onClick={() => navigate('/')}
          style={{ 
            color: '#FF4B8C', 
            fontSize: '20px',
            margin: 0,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          돌려돌려 LP판
        </h1>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #666',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            로그인
          </button>
          <button
            onClick={() => navigate('/signup')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FF4B8C',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            회원가입
          </button>
        </div>
      </div>

      {/* 회원가입 폼 */}
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '450px',
          position: 'relative',
          margin: '0 auto'
        }}>
          {/* 뒤로가기 버튼 */}
          <button
            type="button"
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            style={{
              position: 'absolute',
              top: '-70px',
              left: '0',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '28px',
              cursor: 'pointer',
              padding: '0',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            ←
          </button>

          <div style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <h2 style={{ 
              color: '#fff', 
              textAlign: 'center',
              fontSize: '28px',
              marginBottom: '50px',
              fontWeight: 'normal'
            }}>
              회원가입
            </h2>

            {/* 이메일 입력 */}
            {step === 1 && (
              <form onSubmit={emailForm.handleSubmit(handleEmailNext)}>
                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="text"
                    placeholder="이메일을 입력해주세요!"
                    {...emailForm.register('email')}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#1a1a1a',
                      border: `1px solid ${emailForm.formState.errors.email ? '#ff4444' : '#333'}`,
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {emailForm.formState.errors.email && (
                    <p style={{ 
                      color: '#ff4444', 
                      fontSize: '13px', 
                      margin: '8px 0 0 0' 
                    }}>
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!emailForm.formState.isValid}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: emailForm.formState.isValid ? '#FF4B8C' : '#2a2a2a',
                    border: 'none',
                    borderRadius: '6px',
                    color: emailForm.formState.isValid ? '#fff' : '#666',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: emailForm.formState.isValid ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  다음
                </button>
              </form>
            )}

            {/* 비밀번호 입력 */}
            {step === 2 && (
              <form onSubmit={passwordForm.handleSubmit(handlePasswordNext)}>
                {/* 이메일 표시 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                  color: '#fff',
                  fontSize: '15px'
                }}>
                  <span>📧</span>
                  <span>{signupData.email}</span>
                </div>

                {/* 비밀번호 입력 */}
                <div style={{ marginBottom: '16px', position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력해주세요!"
                    {...passwordForm.register('password')}
                    style={{
                      width: '100%',
                      padding: '14px 50px 14px 16px',
                      backgroundColor: '#1a1a1a',
                      border: `1px solid ${passwordForm.formState.errors.password ? '#ff4444' : '#333'}`,
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#888',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px'
                    }}
                  >
                    {}
                  </button>
                  {passwordForm.formState.errors.password && (
                    <p style={{ 
                      color: '#ff4444', 
                      fontSize: '13px', 
                      margin: '8px 0 0 0' 
                    }}>
                      {passwordForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* 비밀번호 재확인 */}
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 한 번 입력해주세요!"
                    {...passwordForm.register('passwordConfirm')}
                    style={{
                      width: '100%',
                      padding: '14px 50px 14px 16px',
                      backgroundColor: '#1a1a1a',
                      border: `1px solid ${passwordForm.formState.errors.passwordConfirm ? '#ff4444' : '#333'}`,
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#888',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px'
                    }}
                  >
                    {}
                  </button>
                  {passwordForm.formState.errors.passwordConfirm && (
                    <p style={{ 
                      color: '#ff4444', 
                      fontSize: '13px', 
                      margin: '8px 0 0 0' 
                    }}>
                      {passwordForm.formState.errors.passwordConfirm.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!passwordForm.formState.isValid}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: passwordForm.formState.isValid ? '#FF4B8C' : '#2a2a2a',
                    border: 'none',
                    borderRadius: '6px',
                    color: passwordForm.formState.isValid ? '#fff' : '#666',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: passwordForm.formState.isValid ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  다음
                </button>
              </form>
            )}

            {/* 닉네임 입력 */}
            {step === 3 && (
              <form onSubmit={nicknameForm.handleSubmit(handleSignupComplete)}>
                {/* 이메일 표시 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                  color: '#fff',
                  fontSize: '15px'
                }}>
                  <span>📧</span>
                  <span>{signupData.email}</span>
                </div>

                {/* 프로필 이미지 (UI만) */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#2a2a2a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    marginBottom: '16px'
                  }}>
                    👤
                  </div>
                  <p style={{
                    color: '#888',
                    fontSize: '13px',
                    margin: 0
                  }}>
                    프로필 이미지 (추후 구현 예정)
                  </p>
                </div>

                {/* 닉네임 입력 */}
                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="text"
                    placeholder="닉네임을 입력하세요."
                    {...nicknameForm.register('nickname')}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      backgroundColor: '#1a1a1a',
                      border: `1px solid ${nicknameForm.formState.errors.nickname ? '#ff4444' : '#333'}`,
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {nicknameForm.formState.errors.nickname && (
                    <p style={{ 
                      color: '#ff4444', 
                      fontSize: '13px', 
                      margin: '8px 0 0 0' 
                    }}>
                      {nicknameForm.formState.errors.nickname.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!nicknameForm.formState.isValid}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: nicknameForm.formState.isValid ? '#FF4B8C' : '#2a2a2a',
                    border: 'none',
                    borderRadius: '6px',
                    color: nicknameForm.formState.isValid ? '#fff' : '#666',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: nicknameForm.formState.isValid ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  회원가입 완료
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;