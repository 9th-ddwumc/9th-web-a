import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../enums/common";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import ErrorMessage from "../components/common/ErrorMessage";
import LoadingSpinner from "../components/common/LoadingSpinner";

const HomePage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data: lps,
    isFetching,
    isPending,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteLpList(10, search, order);

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

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorMessage onRetry={refetch} />;

  return (
    <div className="p-8">
      <div className="mt-5 mb-6 flex justify-between items-center gap-4">
        <form>
          <input
            value={searchInput}
            placeholder="LP 검색..."
            onChange={(e) => setSearchInput(e.target.value)}
            className="text-white placeholder-gray-400 bg-[#212121] border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
          />
        </form>

        <div className="flex gap-4">
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
      </div>

      {/* LP 카드 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        
        {/* 무한 스크롤 로딩 스켈레톤 */}
        {isFetching && <LpCardSkeletonList count={10} />}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-20" />

      {/* 더 이상 데이터가 없을 때 */}
      {!hasNextPage && lps?.pages[0]?.data.data.length > 0 && (
        <p className="text-center text-gray-400 py-8">
          모든 LP를 불러왔습니다 🎵
        </p>
      )}
    </div>
  );
};

export default HomePage;