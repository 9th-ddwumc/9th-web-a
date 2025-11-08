import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* 작은 화면 */}
      {isOpen && (
        <div 
          className='fixed inset-0 bg-black/50 z-30 md:hidden'
          onClick={onClose}
        />
      )}
      
      {/* 사이드바 */}
      <aside className={`
        fixed md:static
        top-16 md:top-16
        left-0 bottom-0
        w-48
        bg-black border-r border-gray-800
        flex flex-col p-4
        transform lg:transform-none
        transition-transform duration-300 ease-in-out
        z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <nav className='space-y-4'>
          <Link 
            to="/" 
            onClick={onClose}
            className='flex items-center gap-3 text-sm text-white hover:text-gray-300'
          >
            <Search size={16} />
            <span>찾기</span>
          </Link>
          
          <Link 
            to="/mypage" 
            onClick={onClose}
            className='flex items-center gap-3 text-sm text-white hover:text-gray-300'
          >
            <User size={16} />
            <span>마이페이지</span>
          </Link>
        </nav>
        
        <div className='mt-auto flex items-center justify-center'>
          <button className='py-2 px-4 text-xs text-white hover:text-gray-300 transition-colors'>
            탈퇴하기
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
