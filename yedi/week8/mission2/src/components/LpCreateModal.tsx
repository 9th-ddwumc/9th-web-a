// src/components/LpCreateModal.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateLp } from '../hooks/useCreateLp';
import { useUploadImage } from '../hooks/useUploadImage';

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const lpFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  thumbnail: z.string().url('썸네일 이미지를 업로드해주세요.'),
  published: z.boolean(),
});

type LpFormValues = Omit<z.infer<typeof lpFormSchema>, 'tags'>;

function LpCreateModal({ isOpen, onClose }: LpCreateModalProps) {
  // 모달 닫기 로직을 onSuccess 콜백으로 전달
  const createLpMutation = useCreateLp(() => {
    handleClose(); // 뮤테이션 성공 시 모달 닫기
  });
  const uploadImageMutation = useUploadImage();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<LpFormValues>({
    resolver: zodResolver(lpFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      thumbnail: '',
      published: true,
    },
  });

  // 모달이 닫힐 때 폼과 태그 상태 모두 리셋
  const handleClose = () => {
    reset();
    setTags([]);
    setTagInput('');
    setThumbnailPreview(null);
    onClose();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const data = await uploadImageMutation.mutateAsync(file);
      setValue('thumbnail', data.data.imageUrl, { shouldValidate: true });
    } catch (error) {
      setValue('thumbnail', '', { shouldValidate: true });
      setThumbnailPreview(null);
    }
  };

  //  태그 추가 핸들러 
  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput(''); // 입력창 비우기
  };

  // 태그 삭제 핸들러
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  

  // 폼 제출 핸들러
  const onSubmit = (data: LpFormValues) => {
    //폼 데이터와 React state로 관리되던 tags를 조합
    createLpMutation.mutate({
      ...data,
      tags: tags, // state에서 관리하던 태그 배열 주입
    });
  };

  const isSubmitting =
    createLpMutation.isPending || uploadImageMutation.isPending;
  const isFormValid = isValid && !uploadImageMutation.isPending;

  if (!isOpen) {
    return null;
  }

  //  모달 UI 래퍼 추가 
  return (
    <div
      style={modalOverlayStyle}
      onClick={handleClose} // 모달 바깥 클릭 시 닫기
    >
      <div
        style={modalContentStyle}
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={handleClose}
          style={modalCloseButtonStyle}
        >
          X
        </button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}
          >
            <div style={{ width: '70%' }}>
              <input
                {...register('title')}
                placeholder="LP 제목을 입력하세요"
                style={inputStyle}
              />
              {errors.title && <p style={errorStyle}>{errors.title.message}</p>}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  ...submitButtonStyle,
                  backgroundColor: '#555',
                }}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                style={{
                  ...submitButtonStyle,
                  opacity: !isFormValid || isSubmitting ? 0.5 : 1,
                }}
              >
                {uploadImageMutation.isPending
                  ? '이미지 업로드 중...'
                  : createLpMutation.isPending
                  ? '저장 중...'
                  : 'LP 생성'}
              </button>
            </div>
          </header>

          <section style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="thumbnail-upload" style={thumbnailLabelStyle}>
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="썸네일 미리보기"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <span>+ 썸네일 업로드</span>
                )}
              </label>
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={uploadImageMutation.isPending}
              />
              {errors.thumbnail && (
                <p style={errorStyle}>{errors.thumbnail.message}</p>
              )}
              <input {...register('thumbnail')} type="hidden" />
            </div>

            <textarea
              {...register('content')}
              placeholder="LP에 대한 설명을 입력하세요..."
              rows={10}
              style={{ ...inputStyle, height: 'auto', lineHeight: 1.6 }}
            />
            {errors.content && (
              <p style={errorStyle}>{errors.content.message}</p>
            )}
          </section>

          <footer
            style={{
              borderTop: '1px solid #333',
              paddingTop: '20px',
            }}
          >
            {/* 태그 입력 UI */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="태그를 입력하세요"
                  style={{ ...inputStyle, width: 'calc(100% - 80px)' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // 폼 제출 방지
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  style={{
                    ...submitButtonStyle,
                    width: '70px',
                    padding: '10px',
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {tags.map((tag) => (
                  <span key={tag} style={tagStyle}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      style={tagRemoveStyle}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* --- 태그 UI 종료 --- */}

            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginRight: '10px',
                    }}
                  />
                  {field.value ? '공개 발행' : '비공개 (나만 보기)'}
                </label>
              )}
            />
          </footer>
        </form>
      </div>
    </div>
  );
}

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
  position: 'relative',
  background: '#1a1a1a',
  padding: '30px',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflowY: 'auto',
  color: 'white',
  border: '1px solid #333',
  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.5)',
};

const modalCloseButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'transparent',
  border: 'none',
  color: '#aaa',
  fontSize: '24px',
  cursor: 'pointer',
  padding: '5px',
  lineHeight: '1',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#222',
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

const submitButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: '#FF4B8C',
  border: 'none',
  color: 'white',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
  opacity: 1,
  flexShrink: 0,
};

const thumbnailLabelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '250px',
  backgroundColor: '#222',
  border: '1px dashed #444',
  borderRadius: '6px',
  color: '#888',
  cursor: 'pointer',
  overflow: 'hidden',
  fontSize: '16px',
};

// --- 태그 스타일 ---
const tagStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: '#333',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '16px',
  fontSize: '14px',
};

const tagRemoveStyle: React.CSSProperties = {
  background: '#555',
  border: 'none',
  color: 'white',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  marginLeft: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  fontSize: '12px',
};


export default LpCreateModal;