/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { type PAGINATION_ORDER as PAGINATION_ORDER_TYPE, PAGINATION_ORDER_VALUE } from '../enums/common';
import LpCard from '../components/LpCard/LpCard';
import LpCardSkeletonList from '../components/LpCard/LpSkeletonList';
import useGetInfiniteLpList from '../hooks/useGetInfiniteLpList';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from '../hooks/useDebounce';
import useThrottle from '../hooks/useThrottle';

const HomePage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER_TYPE>(PAGINATION_ORDER_VALUE.DESC);

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, debouncedSearch, order);

  // fetchNextPage를 쓰로틀링한 함수로 감싸기 (3초 제한)
  const throttledFetchNextPage = useThrottle(() => {
    if (!isFetching && hasNextPage) {
      console.log("🔁 fetchNextPage 실행됨:", new Date().toLocaleTimeString());
      fetchNextPage();
    }
  }, 3000);


  const { ref, inView } = useInView({
    threshold: 0,
  });

  // useEffect(() => {
  //   if (inView && hasNextPage && !isFetching) {
  //     const timer = setTimeout(() => {
  //       fetchNextPage();
  //     });

  //     return () => clearTimeout(timer);
  //   }
  // }, [inView, isFetching, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (inView) {
      throttledFetchNextPage();
    }
  }, [inView, throttledFetchNextPage]);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error.</div>;

  return (
    <div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-5 flex justify-center items-center"
      >
        <input
          value={searchInput}
          placeholder="search"
          onChange={(e) => setSearchInput(e.target.value)}
          className="text-white placeholder-white bg-[#212121] border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-0"
        />
      </form>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOrder(PAGINATION_ORDER_VALUE.ASC)}
          className={`px-4 py-1 rounded ${
            order === PAGINATION_ORDER_VALUE.ASC ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER_VALUE.DESC)}
          className={`px-4 py-1 rounded ${
            order === PAGINATION_ORDER_VALUE.DESC ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          최신순
        </button>
      </div>

      {/* LP 카드 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lps.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={10} />}
      </div>

      <div ref={ref} className="h-20" />
      <div className="p-4" />
    </div>
  );
};

export default HomePage;