// src/components/LpEditModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetLpById } from '../hooks/useGetLpById';
import { useUpdateLp } from '../hooks/useUpdateLp';
import { useUploadImage } from '../hooks/useUploadImage';

const lpFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  thumbnail: z.string().url('썸네일 이미지를 업로드하거나 기존 URL을 유지하세요.'),
  tags: z.string(),
  published: z.boolean(),
});
type LpFormValues = z.infer<typeof lpFormSchema>;

interface LpEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  lpid: string; 
}

function LpEditModal({ isOpen, onClose, lpid }: LpEditModalProps) {
  //  prop으로 받은 lpid 사용, 모달이 열릴 때만 API 호출
  const { data: lpData, isLoading: isLpLoading } = useGetLpById(lpid, {
    enabled: isOpen,
  });

  //  useUpdateLp 훅에 onClose 콜백 전달
  const updateLpMutation = useUpdateLp(lpid, onClose);
  const uploadImageMutation = useUploadImage();
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
  });

  // 모달이 열리거나, 데이터 로딩 완료 시 폼 리셋
  useEffect(() => {
    if (isOpen && lpData) {
      reset({
        title: lpData.title,
        content: lpData.content,
        thumbnail: lpData.thumbnail,
        tags: lpData.tags.map((tag) => tag.name).join(','),
        published: lpData.published,
      });
      setThumbnailPreview(lpData.thumbnail);
    }
  }, [isOpen, lpData, reset]);

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
      setThumbnailPreview(lpData?.thumbnail || null);
    }
  };

  const onSubmit = (data: LpFormValues) => {
    const tagsArray = data.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    updateLpMutation.mutate({
      ...data,
      tags: tagsArray,
    });
  };

  const isSubmitting =
    updateLpMutation.isPending || uploadImageMutation.isPending;
  const isFormValid = isValid && !uploadImageMutation.isPending;

  if (!isOpen) {
    return null;
  }

  //  모달 UI로 래핑
  return (
    <div
      style={modalOverlayStyle}
      onClick={onClose} // 바깥 영역 클릭 시 닫기
    >
      <div
        style={modalContentStyle}
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          style={modalCloseButtonStyle}
        >
          X
        </button>
        {isLpLoading ? (
          <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
            LP 정보 로딩 중...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Header */}
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
                  onClick={onClose} // '취소' 버튼 클릭 시 닫기
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
                    : updateLpMutation.isPending
                    ? '수정 중...'
                    : 'LP 수정'}
                </button>
              </div>
            </header>
            {/* Section (Thumbnail/Content) */}
            <section style={{ marginBottom: '30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="thumbnail-upload-edit"
                  style={thumbnailLabelStyle}
                >
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
                  id="thumbnail-upload-edit"
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
            {/* Footer (Tags/Published) */}
            <footer
              style={{
                borderTop: '1px solid #333',
                paddingTop: '20px',
              }}
            >
              <input
                {...register('tags')}
                placeholder="태그 (쉼표(,)로 구분)"
                style={{ ...inputStyle, marginBottom: '20px' }}
              />
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
        )}
      </div>
    </div>
  );
}

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
export default LpEditModal;