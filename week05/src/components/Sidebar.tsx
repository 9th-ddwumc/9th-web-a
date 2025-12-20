// src/components/Sidebar.tsx

import { Link } from 'react-router-dom';
// useAuth를 사용하여 로그인 여부에 따라 메뉴를 다르게 보여줄 수도 있습니다.
// import { useAuth } from '../contexts/AuthContext'; 

const Sidebar = () => {
    // const { accessToken } = useAuth();
    
    // 메뉴 항목
    const menuItems = [
        { name: '찾기', icon: '🔍', path: '/search' },
        { name: '마이페이지', icon: '👤', path: '/mypage' },
        // ... 다른 메뉴 항목 추가 ...
    ];

    return (
        <nav className="w-60 h-full bg-[#212121] text-white p-4 shadow-lg flex flex-col items-start">
            <ul className="space-y-2 mt-4 w-full">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <Link 
                            to={item.path} 
                            // 💡 hover 시 배경색 변경
                            className="flex items-center p-2 text-lg text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
                        >
                            <span className="mr-3 text-2xl">{item.icon}</span>
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;