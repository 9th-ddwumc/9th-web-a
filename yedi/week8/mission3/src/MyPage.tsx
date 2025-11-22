// src/MyPage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateUser } from './hooks/useUpdateUser';
import { useLogout } from './hooks/useLogout';
import { useDeleteUser } from './hooks/useDeleteUser';

const profileSchema = z.object({
  name: z.string().min(1, '닉네임을 입력해주세요.'),
  avatar: z.string().url('올바른 URL을 입력해주세요.').or(z.literal('')),
  bio: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

function MyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const updateUserMutation = useUpdateUser();
  const logoutMutation = useLogout();
  const deleteUserMutation = useDeleteUser();
  const [isEditing, setIsEditing] = useState(false);

  // 탈퇴 확인 모달 상태
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        bio: user.bio || '',
      });
    }
  }, [user, reset, isEditing]); 

  const handleLogout = () => {
    // useMutation 훅 사용
    logoutMutation.mutate();
  };

  // 회원 탈퇴 핸들러
  const handleDeleteUser = () => {
    // 확인 모달 닫기
    setShowDeleteConfirm(false);
    // useMutation 훅 사용
    deleteUserMutation.mutate();
  };

  const onSubmit = (data: ProfileFormValues) => {
    // bio 필드 전송
    updateUserMutation.mutate(
      { name: data.name, avatar: data.avatar || undefined, bio: data.bio },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  if (!user) {
    return (
      <h1>사용자 정보 로딩 중...</h1>
    );
  }

  const accountType = user.email ? '일반 계정' : '구글 계정';

  return (
    <>
      <div style={profileContainerStyle}>
        <div style={avatarContainerStyle}>
          <img
            src={user.avatar || 'https://via.placeholder.com/150'}
            alt="프로필 사진"
            style={avatarStyle}
          />
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
            {/* 이메일 표시 JSX는 변경 없음 */}
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

            {/* Bio 입력 */}
            <div style={infoRowStyle}>
              <span style={labelStyle}>Bio</span>
              <input
                {...register('bio')}
                style={inputStyle}
                placeholder="자기소개를 입력하세요."
              />
              {errors.bio && <p style={errorStyle}>{errors.bio.message}</p>}
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
            {/* 이메일, 닉네임 표시 */}
            <div style={infoRowStyle}>
              <span style={labelStyle}>이메일</span>
              <span style={valueStyle}>
                {user.email || '(정보 없음)'} ({accountType})
              </span>
            </div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>닉네임</span>
              <span style={valueStyle}>{user.name}</span>
            </div>
            {/* Bio 표시 */}
            <div style={infoRowStyle}>
              <span style={labelStyle}>Bio</span>
              <span style={valueStyle}>{user.bio || '(소개 없음)'}</span>
            </div>

            {/* 버튼 섹션 (로그아웃/프로필 수정) */}
            <div style={buttonGroupStyle}>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutMutation.isPending} //
                style={secondaryButtonStyle}
              >
                {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={primaryButtonStyle}
              >
                프로필 수정
              </button>
            </div>
            {/* 회원 탈퇴 버튼  */}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#aaa',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                회원 탈퇴
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 회원 탈퇴 확인 모달  */}
      {showDeleteConfirm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 15px 0' }}>회원 탈퇴</h3>
            <p style={{ margin: 0, color: '#ddd' }}>
              정말 탈퇴하시겠습니까?
              <br />
              모든 LP와 댓글이 삭제되며 복구할 수 없습니다.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '25px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteUserMutation.isPending}
                style={modalButtonStyle}
              >
                취소
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
                style={{ ...modalButtonStyle, ...modalConfirmButtonStyle }}
              >
                {deleteUserMutation.isPending ? '탈퇴 중...' : '예'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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

// 모달 스타일 
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  background: '#222',
  padding: '25px',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.5)',
  border: '1px solid #333',
};

const modalButtonStyle: React.CSSProperties = {
  backgroundColor: '#555',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
  borderRadius: '6px',
  fontSize: '14px',
};

const modalConfirmButtonStyle: React.CSSProperties = {
  backgroundColor: '#FF4B8C',
};

export default MyPage;