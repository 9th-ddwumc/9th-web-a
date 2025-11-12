import { useNavigate } from 'react-router-dom';
import { useForm } from './hooks/useForm';

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();

  // 유효성 검사 함수
  const validate = (values: LoginForm) => {
    const errors: Partial<Record<keyof LoginForm, string>> = {};
    
    // 이메일 유효성 검사: @와 .이 모두 포함되어야 통과
    if (!values.email.includes('@') || !values.email.includes('.')) {
      errors.email = '유효하지 않은 이메일 형식입니다.';
    }
    
    // 비밀번호 길이 검사: 최소 6자 이상
    if (values.password.length < 6 && values.password.length > 0) {
      errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    
    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = 
    useForm<LoginForm>({
      initialValues: { email: '', password: '' },
      validate,
      onSubmit: (values) => {
        console.log('로그인 성공:', values);
        alert(`로그인 성공!\n이메일: ${values.email}`);
        // 로그인 성공 후 홈으로 이동
        navigate('/');
      },
    });

  // 버튼 활성화 조건: 이메일과 비밀번호가 모두 유효해야 함
  const isFormValid = 
    values.email !== '' && 
    values.password !== '' && 
    !errors.email && 
    !errors.password;

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
        {/* 로고 */}
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
          클러들러LP판
        </h1>

        {/* 로그인, 회원가입 버튼 */}
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

      {/* 로그인 폼 */}
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
          {/* 뒤로가기 버튼 - react-router-dom 사용 */}
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
              justifyContent: 'flex-start'
            }}
          >
            ←
          </button>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} style={{
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
              로그인
            </h2>

            {/* 구글 로그인 버튼 */}
            <button
              type="button"
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
                gap: '10px'
              }}
            >
              <span style={{ 
                fontSize: '20px',
                fontWeight: 'bold'
              }}>G</span>
              구글 로그인
            </button>

            {/* OR 구분선 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              color: '#888'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
              <span style={{ padding: '0 16px', fontSize: '14px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }}></div>
            </div>

            {/* 이메일 입력 */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                name="email"
                placeholder="이메일을 입력해주세요!"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${touched.email && errors.email ? '#ff4444' : '#333'}`,
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {/* 이메일 에러 메시지 */}
              {touched.email && errors.email && (
                <p style={{ 
                  color: '#ff4444', 
                  fontSize: '13px', 
                  margin: '8px 0 0 0' 
                }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div style={{ marginBottom: '24px' }}>
              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요!"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${touched.password && errors.password ? '#ff4444' : '#333'}`,
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {/* 비밀번호 에러 메시지 */}
              {touched.password && errors.password && (
                <p style={{ 
                  color: '#ff4444', 
                  fontSize: '13px', 
                  margin: '8px 0 0 0' 
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* 로그인 버튼 - 유효성 검사 통과 시에만 활성화 */}
            <button
              type="submit"
              disabled={!isFormValid}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: isFormValid ? '#FF4B8C' : '#2a2a2a',
                border: 'none',
                borderRadius: '6px',
                color: isFormValid ? '#fff' : '#666',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;