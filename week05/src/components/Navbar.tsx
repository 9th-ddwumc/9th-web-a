// src/components/Navbar.tsx (Header.tsx)

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import type { ResponseMyInfoDto } from '../types/auth';
import { useEffect, useState } from 'react';
import { getMyInfo } from '../api/auth';

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
    const { accessToken, logout } = useAuth();
    const [user, setUser] = useState<ResponseMyInfoDto | null>(null);
    const navigate = useNavigate();
    const isAuthenticated = !!accessToken;

    useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        const res = await getMyInfo();
        setUser(res);
      }
    };
    fetchData();
  }, [accessToken]);

    const handleLogout = async () => {
        await logout();
    };

    // 햄버거 SVG 코드
    const burgerIcon = (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
        </svg>
    );
    
    // 검색 아이콘
    const searchIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    return (
        // 💡 디자인에 맞춰 배경을 검정(#000)으로, 높이를 고정(h-16), z-index 설정
        <header className="flex justify-between items-center px-5 py-3 h-16 bg-[#212121]">
                {/* 1. 왼쪽 그룹: 햄버거 버튼 + 로고 */}
                <div className="flex items-center gap-4">
                    {/* 햄버거 메뉴 버튼 */}
                    <button 
                        onClick={toggleSidebar} 
                        className="text-white text-3xl hover:cursor-pointer"
                        aria-label="Toggle Sidebar"
                    >
                        {burgerIcon}
                    </button>

                    <button
                        onClick={() => navigate("")}
                        className="text-2xl font-bold text-pink-600 cursor-pointer "
                        >
                        돌려돌려돌림판
                    </button>
                </div>
                
                {/* 2. 오른쪽 그룹: 검색 아이콘 + 로그인 상태 */}
                <div className="flex gap-3">
                    {/* 검색 아이콘 */}
                    <div className="py-2 hover:cursor-pointer">
                        {searchIcon}
                    </div>

                    {isAuthenticated ? (
                        // --- 🟢 로그인 상태 렌더링 ---
                        <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                            <p className="pt-2 pr-2 text-white">
                                {user?.data.name}님 반갑습니다.
                            </p>
                            <button 
                                onClick={handleLogout} 
                                className="px-4 py-2 hover:bg-gray-500 text-white bg-[#212121] rounded-md cursor-pointer">
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        // --- 🔴 비로그인 상태 렌더링 ---
                        <div className="flex gap-2 text-sm">
                            <button onClick={() => navigate("login")}
                             className="px-4 py-2 hover:bg-pink-500 text-white bg-gray-700 rounded-md cursor-pointer">
                                로그인
                            </button>
                            <button onClick={() => navigate("signup")}
                             className="px-4 py-2 hover:bg-pink-500 text-white bg-gray-700 rounded-md cursor-pointer">
                                회원가입
                            </button>
                        </div>
                    )}
                </div>
        </header>
    );
};

export default Navbar;