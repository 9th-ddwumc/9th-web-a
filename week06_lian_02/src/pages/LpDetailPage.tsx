import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../apis/axios';
import type { Lp } from '../types/lp';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CommentSection from '../components/Comment/CommentSection';

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();

  const { data, isPending, isError, refetch } = useQuery<Lp>({
    queryKey: ['lp', lpid],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
      return data.data;
    },
    enabled: !!lpid,
  });

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorMessage onRetry={refetch} />;
  
  if (!data) return <div>데이터가 없습니다.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
      <p className="text-gray-600 mb-4">
        {new Date(data.createdAt).toLocaleDateString()}
      </p>
      <div className='flex justify-end gap-4 mb-4'>
        <button className='hover:text-gray-400 transition-colors'>수정</button>
        <button className='hover:text-gray-400 transition-colors'>삭제</button>
      </div>
      {data.thumbnail && (
        <div className='aspect-square rounded-lg overflow-hidden mb-4 max-w-md mx-auto'>
          <img
            src={data.thumbnail}
            alt={data.title}
            className='object-cover w-full h-full'
          />
        </div>
      )}
      <div className="mb-4">{data.content}</div>
        <div className="flex items-center gap-2 mt-2 mb-2">
          <button>♥️</button>
          <span>{data.likes?.length || 0}</span>
        </div>
      <p className="mt-1">태그: {data.tags.map(tag => tag.name).join(', ')}</p>

      <CommentSection lpId={Number(lpid)}/>
    </div>
  );
};

export default LpDetailPage;