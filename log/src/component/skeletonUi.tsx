// components/SkeletonUI.tsx

// ✅ LP 카드 스켈레톤 (메인 페이지용)
export const LpCardSkeleton = () => {
  return (
    <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse"></div>
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent animate-shimmer"
        style={{
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite linear'
        }}
      />
    </div>
  );
};

// ✅ LP 카드 스켈레톤 그리드
interface LpCardSkeletonGridProps {
  count?: number;
}

export const LpCardSkeletonGrid = ({ count = 8 }: LpCardSkeletonGridProps) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <LpCardSkeleton key={`skeleton-${i}`} />
      ))}
    </>
  );
};

// ✅ 댓글 스켈레톤 (상세 페이지용)
export const CommentSkeleton = () => {
  return (
    <div className="flex gap-3 p-4 bg-gray-900 rounded-lg animate-pulse">
      {/* 프로필 이미지 */}
      <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0 animate-pulse"></div>
      
      <div className="flex-1 space-y-2">
        {/* 작성자 이름 */}
        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
        
        {/* 댓글 내용 */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-700 rounded w-4/5 animate-pulse"></div>
        </div>
        
        {/* 날짜 */}
        <div className="h-3 bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>
    </div>
  );
};

// ✅ 댓글 스켈레톤 리스트
interface CommentSkeletonListProps {
  count?: number;
}

export const CommentSkeletonList = ({ count = 3 }: CommentSkeletonListProps) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <CommentSkeleton key={`comment-skeleton-${i}`} />
      ))}
    </>
  );
};