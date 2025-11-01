import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "../constants/key";

const API = import.meta.env.VITE_API_BASE_URL;

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const accessToken = url.searchParams.get("accessToken");
      const refreshToken = url.searchParams.get("refreshToken");
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        alert("Google 로그인에 실패했습니다.");
        navigate("/login", { replace: true });
        return;
      }

      // ① 백엔드가 토큰을 프론트 콜백으로 바로 넘겨주는 경우
      if (accessToken) {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
          JSON.stringify(accessToken)
        );
        if (refreshToken) {
          window.localStorage.setItem(
            LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
            JSON.stringify(refreshToken)
          );
        }
        navigate("/mypage", { replace: true });
        return;
      }

      // ② 백엔드가 code만 반환하고, 프론트가 교환을 호출해야 하는 경우
      if (code) {
        try {
          const { data } = await axios.post(`${API}/v1/auth/google/exchange`, {
            code,
            redirectUri: window.location.origin + "/oauth/callback",
          }, { withCredentials: true });

          const newAccess = data?.data?.accessToken;
          const newRefresh = data?.data?.refreshToken;

          if (!newAccess) throw new Error("No access token from exchange");

          window.localStorage.setItem(
            LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
            JSON.stringify(newAccess)
          );
          if (newRefresh) {
            window.localStorage.setItem(
              LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
              JSON.stringify(newRefresh)
            );
          }

          navigate("/mypage", { replace: true });
        } catch (e) {
          alert("토큰 교환에 실패했습니다. 다시 시도해주세요.");
          navigate("/login", { replace: true });
        }
        return;
      }

      // 어떤 것도 없으면 로그인으로
      navigate("/login", { replace: true });
    };

    run();
  }, [navigate]);

  return <div className="min-h-screen grid place-items-center">로그인 처리 중…</div>;
}
