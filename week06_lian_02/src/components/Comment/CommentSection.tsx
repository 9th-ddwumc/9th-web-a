import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CommentItem from './CommentItem';
import CommentSkeleton from './CommentSkeleton';
import { PAGINATION_ORDER } from '../../enums/common';
import useGetInfiniteCommentList from '../../hooks/queries/useGetInfiniteCommentList';


interface CommentSectionProps {
  lpId: number;
}

function CommentSection({ lpId }: CommentSectionProps) {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.asc);

  const {
    data: comments,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteCommentList(lpId, 5, order);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      const timer = setTimeout(() => {
        fetchNextPage();
      });
      return () => clearTimeout(timer);
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  return (
    <div className='mt-8 border-t border-gray-700 pt-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-white'>댓글</h2>

        <div className="flex gap-3">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
              order === PAGINATION_ORDER.asc
                ? 'bg-white text-black'
                : 'bg-transparent text-white border border-gray-700 hover:border-gray-500'
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
              order === PAGINATION_ORDER.desc
                ? 'bg-white text-black'
                : 'bg-transparent text-white border border-gray-700 hover:border-gray-500'
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className='flex gap-2 mt-4'>
        <input
          type='text'
          placeholder='댓글을 입력하세요...'
          className='flex-1 px-3 py-2 rounded-lg border border-gray-600 text-white'
        />
        <button
          className='px-4 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-pink-600 transition-colors'
        >
          작성
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {comments?.pages
          ?.map((page) => page.data)
          ?.flat()
          ?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

        {isFetching && Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}
      </div>

      <div ref={ref} className="h-10" />

      {!isFetching && comments?.pages[0]?.data.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          첫 댓글을 작성해보세요!
        </div>
      )}

      {!hasNextPage && comments?.pages?.[0]?.data?.length! > 0 && (

        <p className="text-center text-gray-400 py-4 mt-4">
          모든 댓글을 불러왔습니다 🎵
        </p>
      )}
    </div>
  );
}

export default CommentSection;