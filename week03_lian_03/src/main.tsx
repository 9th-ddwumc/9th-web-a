// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ✅ / 로 들어오면 /movies/popular 로 즉시 이동
      { index: true, element: <Navigate to="/movies/popular" replace /> },

      // (선택) 필요하면 여전히 HomePage 직접 접근 경로 유지
      { path: "/home", element: <HomePage /> },

      { path: "/movies/:category", element: <MoviePage /> },
      { path: "/movie/:movieId", element: <MovieDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
