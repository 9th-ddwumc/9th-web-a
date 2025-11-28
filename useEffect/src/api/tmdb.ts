// src/api/tmdb.ts

import axios from 'axios';
import type { MovieResponse } from '../types/Movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface SearchParams {
    query: string;
    language: string; 
    includeAdult: boolean;
    page?: number;
}

export async function searchMovies({ query, language, includeAdult, page = 1 }: SearchParams): Promise<MovieResponse> {
    if (!query) {
        return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    const url = `${BASE_URL}/search/movie`;

    try {
        const response = await axios.get<MovieResponse>(url, {
            params: {
                query: query,
                language: language,
                include_adult: includeAdult,
                page: page,
            },
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                accept: 'application/json' 
            }
        });
        return response.data;
    } catch (error) {
        console.error("영화 검색 중 오류 발생:", error);
        throw new Error("영화 검색에 실패했습니다.");
    }
}