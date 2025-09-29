import { useParams } from "react-router-dom";

// src/pages/movies.tsx
const MoviesPage = () => {
  const params = useParams(); // { movieId?: string }

  console.log(params); // 예: { movieId: "123" }

  return <h1>{params.movieId}번의 Movies Page 야호~!</h1>;
};

export default MoviesPage;