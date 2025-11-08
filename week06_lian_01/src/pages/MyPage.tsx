import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
        const response = await getMyInfo();
        console.log(response);

        setData(response);
    };

    getData();
  }, []);

  const handleLogout = async() => {
    await logout();
    navigate("/");
  }
  
  if (!data) return <div className='text-white'>정보 조회 실패</div>;
  
  return <div className='text-white'>
    <h1>{data.data?.name} 님 반갑습니다.</h1>
    <h1>이메일: {data.data?.email}</h1>

    <button
      className="cursor-pointer bg-gray-600 rounded-sm p-1"
      onClick={handleLogout}>
      로그아웃
    </button>
  </div>;
};

export default MyPage;