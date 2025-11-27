// components/LpCreateModal.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../apis/axios';

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateLpData {
  title: string;
  content: string;
  thumbnail: File | null;
  tags: string[];
}

const LpCreateModal = ({ isOpen, onClose }: LpCreateModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateLpData>({
    title: '',
    content: '',
    thumbnail: null,
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ✅ LP 생성 Mutation
  const createLpMutation = useMutation({
    mutationFn: async (data: CreateLpData) => {
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('content', data.content);
      if (data.thumbnail) {
        formDataToSend.append('thumbnail', data.thumbnail);
      }
      data.tags.forEach(tag => {
        formDataToSend.append('tags[]', tag);
      });

      const response = await axiosInstance.post('/v1/lps', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // ✅ LP 목록 쿼리 무효화하여 자동 새로고침
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      alert('LP가 성공적으로 작성되었습니다!');
      handleClose();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'LP 작성에 실패했습니다.');
    },
  });

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 태그 추가
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  // 모달 닫기
  const handleClose = () => {
    setFormData({ title: '', content: '', thumbnail: null, tags: [] });
    setTagInput('');
    setPreviewUrl(null);
    onClose();
  };

  // 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    if (!formData.thumbnail) {
      alert('썸네일 이미지를 선택해주세요.');
      return;
    }

    createLpMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">새 LP 작성</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-white font-medium mb-2">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500"
              placeholder="LP 제목을 입력하세요"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-white font-medium mb-2">내용</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 resize-none"
              placeholder="LP 내용을 입력하세요"
              rows={6}
            />
          </div>

          {/* 썸네일 */}
          <div>
            <label className="block text-white font-medium mb-2">썸네일 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-500 file:text-white file:cursor-pointer hover:file:bg-pink-600"
            />
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-white font-medium mb-2">태그</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500"
                placeholder="태그를 입력하세요"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
              >
                추가
              </button>
            </div>
            
            {/* 태그 목록 */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-300 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createLpMutation.isPending}
              className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {createLpMutation.isPending ? '작성 중...' : 'Add LP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LpCreateModal;