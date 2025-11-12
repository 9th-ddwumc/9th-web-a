import { useState, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
// ✅ useMutation, useAuth, deleteUser import
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { deleteUser } from '../apis/auth';
import { QUERY_KEY } from '../constants/key';
import { postLp } from '../apis/lp'; // ✅ LP 생성 API import
import type { RequestLpCreateDto } from '../types/lp'; // ✅ LP 생성 DTO import

// =========================================================================
// LP 생성 모달 컴포넌트 (파일이 없으므로 임시로 여기에 정의)
// =========================================================================
interface LpCreateModalProps {
    onClose: () => void;
}

const LpCreateModal = ({ onClose }: LpCreateModalProps) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // 썸네일 URL을 저장할 상태
    const [thumbnail, setThumbnail] = useState(''); 
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    // 파일 입력을 위한 ref
    const fileInputRef = useRef<HTMLInputElement>(null); 

    // LP 생성 뮤테이션
    const createLpMutation = useMutation({
        mutationFn: (data: RequestLpCreateDto) => postLp(data),
        onSuccess: () => {
            alert('LP 게시글이 성공적으로 작성되었습니다.');
            onClose();
            // 메인 페이지 LP 목록 새로고침
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'LP 작성에 실패했습니다.');
        },
    });

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && tags.length < 5 && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };
    
    // 이미지 파일 선택 핸들러 
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 파일을 서버에 업로드하는 로직 대신, 여기서는 임시 URL을 사용한다고 가정
            // 실제 구현에서는 서버에 파일을 업로드하고 썸네일 URL을 받아와야 함
            const tempUrl = URL.createObjectURL(file);
            setThumbnail(tempUrl);
            alert(`File selected: ${file.name}. (Using temporary URL for thumbnail)`);
        }
    };
    
    // LP 작성 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (createLpMutation.isPending) return;

        if (!title || !content || !thumbnail) {
            alert('제목, 내용, 썸네일은 필수 입력 항목입니다.');
            return;
        }

        const newLpData: RequestLpCreateDto = {
            title,
            content,
            thumbnail,
            tags,
        };
        
        createLpMutation.mutate(newLpData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-gray-900 rounded-lg p-8 max-w-lg w-full border border-gray-800 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // 모달 바깥 클릭 방지
            >
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h2 className="text-2xl font-bold text-white">LP 게시글 작성</h2>
                    <button onClick={onClose} className="text-white hover:text-pink-500 text-xl font-bold">
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* LP 사진 입력 (input type="file" 형태) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">LP 사진 (필수)</label>
                        <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full py-2 rounded-lg transition-colors text-white ${
                                thumbnail ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                        >
                            {thumbnail ? '사진 변경' : '사진 선택'}
                        </button>
                        {thumbnail && (
                            <img src={thumbnail} alt="LP Thumbnail Preview" className="mt-4 w-32 h-32 object-cover rounded-lg" />
                        )}
                    </div>
                    
                    {/* 제목 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500"
                            placeholder="LP 제목을 입력하세요"
                        />
                    </div>

                    {/* 내용 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 min-h-[100px] resize-none"
                            placeholder="내용을 입력하세요"
                        />
                    </div>
                    
                    {/* 태그 입력/추가 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">태그 (최대 5개)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500"
                                placeholder="태그 입력"
                                disabled={tags.length >= 5}
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                disabled={!tagInput.trim() || tags.length >= 5}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                                추가
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-pink-500 text-white rounded-full text-xs flex items-center">
                                    #{tag}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-white/70 hover:text-white"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={createLpMutation.isPending || !title || !content || !thumbnail}
                        className="w-full px-6 py-3 bg-cyan-400 text-black font-medium rounded hover:bg-cyan-300 transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {createLpMutation.isPending ? '작성 중...' : 'Add LP'}
                    </button>
                </form>
            </div>
        </div>
    );
};
// =========================================================================

const MainLayout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // ✅ LP 작성 모달 상태 추가
    const [isLpCreateModalOpen, setIsLpCreateModalOpen] = useState(false);
    
    // ✅ useQueryClient (캐시 갱신을 위해 필요)
    const queryClient = useQueryClient();

    // ✅ 회원 탈퇴 Mutation 구현
    const withdrawMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: async () => {
            // 클라이언트 상태 초기화 및 캐시 제거
            await logout(); 
            queryClient.removeQueries({ queryKey: [QUERY_KEY.myInfo] });
            alert('회원 탈퇴가 완료되었습니다.');
            navigate('/login');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
        },
    });

    const handleWithdrawal = () => {
        if (window.confirm('정말로 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            withdrawMutation.mutate();
        }
    };
    
    // 사이드바 토글 함수
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // 사이드바 닫기 함수
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    
    // LP 생성 모달 열기/닫기 핸들러
    const openLpCreateModal = () => setIsLpCreateModalOpen(true);
    const closeLpCreateModal = () => setIsLpCreateModalOpen(false);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar onMenuClick={toggleSidebar} />

            <div className="flex flex-1">
                {/* ✅ 사이드바 */}
                <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-60 bg-black border-r border-gray-800 z-40 transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                    {/* ✅ 모바일에서 닫기 버튼 추가 */}
                    <div className="lg:hidden p-4 border-b border-gray-800">
                        <button
                            onClick={closeSidebar}
                            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                        >
                            <span className="font-medium">메뉴</span>
                            <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                            >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="p-4 space-y-2">
                        <button 
                            onClick={() => { 
                                navigate('/search'); 
                                closeSidebar(); 
                            }} 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-[15px]"
                        >
                            <span className="text-xl">🔍</span>
                            <span>찾기</span>
                        </button>
                        <button 
                            onClick={() => { 
                                navigate('/my'); 
                                closeSidebar(); 
                            }} 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-[15px]"
                        >
                            <span className="text-xl">👤</span>
                            <span>마이페이지</span>
                        </button>
                    </nav>
                    
                    {/* ✅ 탈퇴하기 버튼에 핸들러 및 로딩 상태 적용 */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <button 
                            onClick={handleWithdrawal}
                            disabled={withdrawMutation.isPending}
                            className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                            {withdrawMutation.isPending ? '탈퇴 처리 중...' : '탈퇴하기'}
                        </button>
                    </div>
                </aside>

                {/* ✅ 오버레이 (사이드바 열렸을 때) */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden top-16" 
                        onClick={closeSidebar} 
                    />
                )}

                <main className="flex-1 lg:ml-0">
                    <Outlet />
                </main>
            </div>

            <Footer />

            {/* ✅ LP 작성 버튼 - 모달 열기 핸들러 연결 */}
            <button 
                onClick={openLpCreateModal} 
                className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 text-white rounded-full shadow-xl hover:bg-pink-600 transition-all hover:scale-110 flex items-center justify-center text-3xl font-light z-50"
            >
                +
            </button>
            
            {/* ✅ LP 생성 모달 컴포넌트 추가 */}
            {isLpCreateModalOpen && <LpCreateModal onClose={closeLpCreateModal} />}
        </div>
    );
};

export default MainLayout;