import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "../App.css";
import type { Lp } from "../types/lp";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const fetchLpById = async (id: string): Promise<Lp> => {
  const response = await axios.get(`http://localhost:8000/v1/lps/${id}`);
  return response.data.data;
};

const LpDetailPage = () => {
  const { id } = useParams();

  const { data: lp, isError } = useQuery({
    queryKey: ["lpDetail", id],
    queryFn: () => fetchLpById(id!),
    enabled: !!id,
  });

  if (isError || !lp) {
    return <div className="text-red-500 text-center mt-10">Error Occurred</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 py-8 text-white bg-[#212121] rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {/* <img
            src="https://i.ibb.co/QM2dFZ3/user-icon.png"
            alt="user"
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm">{lp.authorId || "작성자"}</span> */}
        </div>
        <div className="flex items-center gap-3 text-gray-300 text-sm">
          <span>
            {formatDistanceToNow(new Date(lp.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
          <button title="edit">수정</button>
          <button title="delete">삭제</button>
        </div>
      </div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold text-center mb-4">{lp.title}</h2>

      {/* 썸네일 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-64 h-64 object-cover mx-auto rounded-full shadow-lg mb-4 spin-lp"
      />

      {/* 내용 */}
      <p className="text-sm text-center text-gray-300 mb-4 whitespace-pre-line">
        {lp.content}
      </p>

      {/* 태그 */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {lp.tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-200"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      {/* 좋아요 */}
      <div className="text-center text-pink-400">
        ♥️ {lp.likes?.length || 0}
      </div>
    </div>
  );
};

export default LpDetailPage;