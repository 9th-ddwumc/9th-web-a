import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateLp } from '../hooks/useCreateLp';

const lpFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  thumbnail: z.string().url('올바른 URL을 입력해주세요.').or(z.literal('')),
  tags: z.string(), 
  published: z.boolean(),
});

type LpFormValues = z.infer<typeof lpFormSchema>;

function LpCreate() {
  const navigate = useNavigate();
  const createLpMutation = useCreateLp();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<LpFormValues>({
    resolver: zodResolver(lpFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      thumbnail: '',
      tags: '',
      published: true, 
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: LpFormValues) => {
    const tagsArray = data.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    createLpMutation.mutate({
      ...data,
      tags: tagsArray,
    });
  };

  return (
    <div
      style={{
        color: 'white',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px',
          }}
        >
          {/* 제목 입력 */}
          <div style={{ width: '70%' }}>
            <input
              {...register('title')}
              placeholder="LP 제목을 입력하세요"
              style={inputStyle}
            />
            {errors.title && <p style={errorStyle}>{errors.title.message}</p>}
          </div>

          {/* 버튼 그룹 (취소, 생성) */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* 뒤로가기(취소) 버튼 */}
            <button
              type="button" 
              onClick={() => navigate(-1)} 
              style={{
                ...submitButtonStyle,
                backgroundColor: '#555', 
              }}
            >
              취소
            </button>

            {/* 저장 버튼 */}
            <button
              type="submit"
              disabled={!isValid || createLpMutation.isPending}
              style={{
                ...submitButtonStyle,
                opacity: !isValid || createLpMutation.isPending ? 0.5 : 1,
              }}
            >
              {createLpMutation.isPending ? '저장 중...' : 'LP 생성'}
            </button>
          </div>
        </header>

        {/* 썸네일/본문 섹션 */}
        <section style={{ marginBottom: '30px' }}>
          {/* 썸네일 URL 입력 */}
          <input
            {...register('thumbnail')}
            placeholder="썸네일 이미지 URL (예: https://...)"
            style={{ ...inputStyle, marginBottom: '20px' }}
          />
          {errors.thumbnail && (
            <p style={errorStyle}>{errors.thumbnail.message}</p>
          )}

          {/* 본문 입력 */}
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

        {/* 태그 및 발행여부 섹션 */}
        <footer
          style={{
            borderTop: '1px solid #333',
            paddingTop: '20px',
          }}
        >
          {/* 태그 입력 */}
          <input
            {...register('tags')}
            placeholder="태그 (쉼표(,)로 구분)"
            style={{ ...inputStyle, marginBottom: '20px' }}
          />

          {/* 발행 여부  */}
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
                  style={{ width: '20px', height: '20px', marginRight: '10px' }}
                />
                {field.value ? '공개 발행' : '비공개 (나만 보기)'}
              </label>
            )}
          />
        </footer>
      </form>
    </div>
  );
}

// 공통 스타일
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

export default LpCreate;