import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { UserInfo } from "../types/auth.dto";
import { useAuth } from "../context/AuthContext";

const Mypage = () => {
  const { logout } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const run = async () => {
      const res = await getMyInfo();
      setUserInfo(res.data);
    };
    run();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const initials =
    (userInfo?.name ?? "")
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-2xl">
          <div className="relative h-40 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500" />
          <div className="relative px-8 pt-0 pb-8 overflow-visible">
            <div className="relative">
              <div className="absolute -top-14 left-8">
                {userInfo?.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt="프로필"
                    className="size-28 rounded-full ring-4 ring-slate-900 object-cover bg-white/10"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="size-28 rounded-full ring-4 ring-slate-900 bg-white/10 grid place-items-center text-2xl font-bold">
                    {initials}
                  </div>
                )}
              </div>

              <div className="pl-40 pt-4 pr-0 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    {userInfo?.name ? `${userInfo.name}님 환영합니다` : "환영합니다"}
                  </h1>
                  <p className="mt-1 text-sm text-gray-400">{userInfo?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-white/10 hover:bg-white/15 border border-white/15 transition"
                >
                  로그아웃
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs text-gray-400">사용자 ID</div>
                <div className="mt-1 text-lg font-semibold">{userInfo?.id ?? "-"}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs text-gray-400">가입일</div>
                <div className="mt-1 text-lg font-semibold">
                  {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : "-"}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs text-gray-400">상태</div>
                <div className="mt-1">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-sm font-medium text-emerald-300 border border-emerald-500/30">
                    활성 사용자
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-black/30 p-6">
              <h2 className="font-semibold">프로필</h2>
              <p className="mt-2 text-sm text-gray-300">
                {userInfo?.bio || "소개 문구가 없습니다."}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          보안을 위해 공용 기기에서는 사용 후 반드시 로그아웃하세요.
        </p>
      </div>
    </div>
  );
};

export default Mypage;
