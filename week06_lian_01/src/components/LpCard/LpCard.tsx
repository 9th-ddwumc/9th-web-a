import { Link } from 'react-router-dom';

interface LpCardProps {
  lp: {
    id: number;
    title: string;
    thumbnail: string;
    createdAt: string | Date;
    likes: { length: number };
  };
}

export default function LpCard({ lp }: LpCardProps) {
  return (
    <Link
      to={`/lp/${lp.id}`}
      className='group block transform transition-transform duration-300 hover:scale-105'
    >
      {/* 썸네일 영역 */}
      <div className='relative aspect-square bg-gray-800 rounded-lg overflow-hidden'>
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className='object-cover w-full h-full'
        />

        {/* Hover 시 오버레이 */}
        <div
          className='absolute inset-0 flex flex-col items-center justify-center p-4
            text-white bg-black/50 opacity-0 
            group-hover:opacity-100 transition-opacity duration-300 text-center'
        >
          <h3 className='text-lg font-semibold'>{lp.title}</h3>
          <p className='text-sm mt-1'>{new Date(lp.createdAt).toLocaleDateString()}</p>
          <p className='text-sm'>❤️ {lp.likes.length}</p>
        </div>
      </div>
    </Link>
  );
}