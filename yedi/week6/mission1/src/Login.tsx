import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from './contexts/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [showPassword, setShowPassword] = useState(false);
  const { login, accessToken } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const alertDisplayed = useRef(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (accessToken && !isLoggingIn && !alertDisplayed.current) {
      alertDisplayed.current = true;
      alert('이미 로그인되어 있습니다. 홈으로 이동합니다.');
      navigate(from, { replace: true });
    }
  }, [accessToken, navigate, isLoggingIn, from]);

  // 구글 로그인 핸들러
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  // 일반 로그인 핸들러
  const onSubmit = async (data: LoginForm) => {
    setIsLoggingIn(true);

    try {
      const loginSuccess = await login(data);

      if (loginSuccess) {
        alert('로그인 성공!');
        navigate(from, { replace: true });
      } else {
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
        setIsLoggingIn(false);
      }
    } catch (error: any) {
      alert(error.message || '로그인에 실패했습니다.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
      }}
    >
      {/* 상단 헤더 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          onClick={() => navigate('/')}
          style={{
            color: '#FF4B8C',
            fontSize: '20px',
            margin: 0,
            fontWeight: 'bold',
            cursor: 'pointer',
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
              cursor: 'pointer',
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
              cursor: 'pointer',
            }}
          >
            회원가입
          </button>
        </div>
      </div>

      {/* 로그인 폼*/}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '450px',
            position: 'relative',
            margin: '0 auto',
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
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
              justifyContent: 'flex-start',
            }}
          >
            ←
          </button>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                color: '#fff',
                textAlign: 'center',
                fontSize: '28px',
                marginBottom: '50px',
                fontWeight: 'normal',
              }}
            >
              로그인
            </h2>

            {/* "구글 로그인" 버튼 */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'transparent',
                border: '1px solid #555',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '15px',
                cursor: 'pointer',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                G
              </span>
              구글 로그인
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '24px 0',
                color: '#888',
              }}
            >
              <div
                style={{ flex: 1, height: '1px', backgroundColor: '#333' }}
              ></div>
              <span style={{ padding: '0 16px', fontSize: '14px' }}>OR</span>
              <div
                style={{ flex: 1, height: '1px', backgroundColor: '#333' }}
              ></div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="이메일을 입력해주세요!"
                {...register('email')}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${errors.email ? '#ff4444' : '#333'}`,
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.email && (
                <p
                  style={{
                    color: '#ff4444',
                    fontSize: '13px',
                    margin: '8px 0 0 0',
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요!"
                {...register('password')}
                style={{
                  width: '100%',
                  padding: '14px 50px 14px 16px',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${errors.password ? '#ff4444' : '#333'}`,
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
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
                  padding: '4px',
                }}
              >
                {/* 아이콘 (생략) */}
              </button>
              {errors.password && (
                <p
                  style={{
                    color: '#ff4444',
                    fontSize: '13px',
                    margin: '8px 0 0 0',
                  }}
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoggingIn}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: isValid ? '#FF4B8C' : '#2a2a2a',
                border: 'none',
                borderRadius: '6px',
                color: isValid ? '#fff' : '#666',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isValid && !isLoggingIn ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {isLoggingIn ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;