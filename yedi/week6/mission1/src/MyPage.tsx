import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { UserUpdateForm } from './api/types';
import { useUpdateUser } from './hooks/useUpdateUser';

const profileSchema = z.object({
  name: z.string().min(1, '닉네임을 입력해주세요.'),
  avatar: z.string().url('올바른 URL을 입력해주세요.').or(z.literal('')),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

function MyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const updateUserMutation = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, reset]);

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateUserMutation.mutate(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  if (!user) {
    return (
      <div style={pageStyle}>
        <h1>사용자 정보 로딩 중...</h1>
      </div>
    );
  }

  const accountType = user.email ? '일반 계정' : '구글 계정';

  return (
    <div style={pageStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <h1
          onClick={() => navigate('/')}
          style={{
            color: '#FF4B8C',
            fontSize: '24px',
            margin: 0,
            fontWeight: 'bold',
            cursor: 'pointer', 
          }}
        >
          마이페이지
        </h1>
        <button
          onClick={() => navigate('/')}
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
          홈화면으로 돌아가기
        </button>
      </div>

      <div style={profileContainerStyle}>
        <div style={avatarContainerStyle}>
          <img
            src={user.avatar || 'https://via.placeholder.com/150'}
            alt="프로필 사진"
            style={avatarStyle}
          />
        </div>

        {/* (폼/정보 표시 로직 변경 없음) */}
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
            {/* 이메일 (표시 전용) */}
            <div style={infoRowStyle}>
              <span style={labelStyle}>이메일</span>
              <span style={valueStyle}>
                {user.email || '(정보 없음)'} ({accountType})
              </span>
            </div>

            {/* 닉네임 (입력) */}
            <div style={infoRowStyle}>
              <span style={labelStyle}>닉네임</span>
              <input
                {...register('name')}
                style={inputStyle}
                placeholder="닉네임"
              />
              {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
            </div>

            {/* 프로필 사진 URL (입력) */}
            <div style={infoRowStyle}>
              <span style={labelStyle}>프로필 사진 URL</span>
              <input
                {...register('avatar')}
                style={inputStyle}
                placeholder="https://example.com/image.png"
              />
              {errors.avatar && (
                <p style={errorStyle}>{errors.avatar.message}</p>
              )}
            </div>

            {/* 버튼 섹션 (취소/저장) */}
            <div style={buttonGroupStyle}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={secondaryButtonStyle}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateUserMutation.isPending}
                style={primaryButtonStyle}
              >
                {updateUserMutation.isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        ) : (
          <div style={formStyle}>
            {/* 이메일 */}
            <div style={infoRowStyle}>
              <span style={labelStyle}>이메일</span>
              <span style={valueStyle}>
                {user.email || '(정보 없음)'} ({accountType})
              </span>
            </div>

            {/* 닉네임 */}
            <div style={infoRowStyle}>
              <span style={labelStyle}>닉네임</span>
              <span style={valueStyle}>{user.name}</span>
            </div>

            {/* 버튼 섹션 (로그아웃/프로필 수정) */}
            <div style={buttonGroupStyle}>
              <button
                type="button"
                onClick={handleLogout}
                style={secondaryButtonStyle}
              >
                로그아웃
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={primaryButtonStyle}
              >
                프로필 수정
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  padding: '40px',
  color: 'white',
  background: '#111',
  minHeight: '100vh',
  boxSizing: 'border-box',
};

const profileContainerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  background: '#222',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
};

const avatarContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '30px',
  background: '#333',
};

const avatarStyle: React.CSSProperties = {
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  border: '4px solid #FF4B8C',
  objectFit: 'cover',
};

const formStyle: React.CSSProperties = {
  padding: '30px',
};

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '20px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#aaa',
  marginBottom: '5px',
};

const valueStyle: React.CSSProperties = {
  fontSize: '18px',
  color: 'white',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#111',
  border: '1px solid #444',
  borderRadius: '6px',
  color: 'white',
  fontSize: '16px',
  boxSizing: 'border-box',
};

const errorStyle: React.CSSProperties = {
  color: '#ff4444',
  fontSize: '13px',
  margin: '8px 0 0 0',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
  marginTop: '30px',
  borderTop: '1px solid #333',
  paddingTop: '20px',
};

const primaryButtonStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#FF4B8C',
  color: 'white',
  border: 'none',
  padding: '12px 20px',
  cursor: 'pointer',
  borderRadius: '6px',
  fontSize: '16px',
};

const secondaryButtonStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#555',
  color: 'white',
  border: 'none',
  padding: '12px 20px',
  cursor: 'pointer',
  borderRadius: '6px',
  fontSize: '16px',
};

export default MyPage;