import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`, // .env 파일에 토큰 저장 필요
  },
});

export default axiosClient;