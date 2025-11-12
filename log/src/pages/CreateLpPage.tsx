import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp } from '../apis/lp';
import type { RequestCreateLpDto } from '../types/lp';

const CreateLpPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [formData, setFormData] = useState<RequestCreateLpDto>({
        title: '',
        content: '',
        thumbnail: '',
        published: true,
        tags: [],
    });
    
    const [tagInput, setTagInput] = useState('');
    const [previewImage, setPreviewImage] = useState<string>('');

    // ✅ LP 생성 Mutation
    const createLpMutation = useMutation({
        mutationFn: createLp,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lps'] });
            alert('LP가 성공적으로 생성되었습니다!');
            navigate(`/lp/${data.id}`);
        },
        onError: (error: any) => {
            console.error('LP 생성 실패:', error);
            alert(error.response?.data?.message || 'LP 생성에 실패했습니다.');
        },
    });

    // ✅ 입력 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'thumbnail' && value) {
            setPreviewImage(value);
        }
    };

    // ✅ 태그 추가
    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags?.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    // ✅ 태그 제거
    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove)
        }));
    };

    // ✅ 제출 핸들러
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
        if (!formData.thumbnail.trim()) {
            alert('썸네일 URL을 입력해주세요.');
            return;
        }

        createLpMutation.mutate(formData);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">새 LP 만들기</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                    취소
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 제목 */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        제목 *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="LP 제목을 입력하세요"
                        className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                        maxLength={100}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {formData.title.length}/100
                    </p>
                </div>

                {/* 썸네일 URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        썸네일 이미지 URL *
                    </label>
                    <input
                        type="url"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                    />
                    
                    {/* 미리보기 */}
                    {previewImage && (
                        <div className="mt-4 aspect-square max-w-md mx-auto rounded-lg overflow-hidden bg-gray-800">
                            <img
                                src={previewImage}
                                alt="미리보기"
                                onError={() => setPreviewImage('')}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* 내용 */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        내용 *
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="LP에 대한 설명을 입력하세요"
                        rows={10}
                        className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 transition-colors resize-none"
                        maxLength={5000}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {formData.content.length}/5000
                    </p>
                </div>

                {/* 태그 */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        태그
                    </label>
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="태그를 입력하고 Enter를 누르세요"
                        className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                    />
                    
                    {/* 태그 목록 */}
                    {formData.tags && formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 text-blue-400 rounded-full text-sm"
                                >
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* 공개 여부 */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                        className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-pink-500 focus:ring-pink-500 focus:ring-offset-gray-900"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-300 cursor-pointer">
                        바로 공개하기
                    </label>
                </div>

                {/* 제출 버튼 */}
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={createLpMutation.isPending}
                        className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        {createLpMutation.isPending ? '생성 중...' : 'LP 생성'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateLpPage;