import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../apis/axios';
import type { Lp } from '../types/lp';

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();

  const { data, isPending, isError, refetch } = useQuery<Lp>({
    queryKey: ['lp', lpid],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
      return data;
    },
    enabled: !!lpid,
  });

  if (isPending) {
    return (
      <div className="p-8 flex items-center justify-center mt-40">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-pink-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <p className="text-white p-4">Error!</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!data?.data) return <div>데이터가 없습니다.</div>;

  const lp = data.data;

  return (
    <div className="p-4 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-2">{lp.title}</h1>
      <p className="text-gray-600 mb-4">
        {new Date(lp.createdAt).toLocaleDateString()}
      </p>
      <div className='flex justify-end gap-4 mb-4'>
        <button className='hover:text-gray-400 transition-colors'>수정</button>
        <button className='hover:text-gray-400 transition-colors'>삭제</button>
      </div>
      {lp.thumbnail && (
        <div className='aspect-square rounded-lg overflow-hidden mb-4 max-w-md mx-auto'>
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className='object-cover w-full h-full'
          />
        </div>
      )}
      <div className="mb-4">{lp.content}</div>
        <div className="flex items-center gap-2 mt-2 mb-2">
          <button>♥️</button>
          <span>{lp.likes.length}</span>
        </div>
      <p className="mt-1">태그: {lp.tags.map(tag => tag.name).join(', ')}</p>
    </div>
  );
};

export default LpDetailPage;