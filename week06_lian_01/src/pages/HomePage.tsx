import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import LpCard from "../components/LpCard/LpCard" 

const HomePage = () => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const { data, isPending, isError, refetch } = useGetLpList({ order });

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

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-6 justify-end">
        <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            order === PAGINATION_ORDER.asc
              ? "bg-white text-black"
              : "bg-transparent text-white border border-gray-700 hover:border-gray-500"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            order === PAGINATION_ORDER.desc
              ? "bg-white text-black"
              : "bg-transparent text-white border border-gray-700 hover:border-gray-500"
          }`}
        >
          최신순
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data?.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;