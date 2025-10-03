import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,              // ★ 모든 하위 경로에 공통 적용
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/movies/:category", element: <MoviePage /> }, // popular/now_playing/...
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
