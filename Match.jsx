import { useCallback, useState } from "react";
import BottomTabs from "./BottomTabs.jsx";

const PROFILES = [
  {
    id: "m1",
    name: "林晚",
    age: 24,
    city: "厦门",
    bio: "摄影、徒步、胶片。想认识同样喜欢海边的人。",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
  },
  {
    id: "m2",
    name: "阿哲",
    age: 27,
    city: "杭州",
    bio: "产品设计师，周末玩滑板。最近在学手冲。",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop",
  },
  {
    id: "m3",
    name: "苏苏",
    age: 25,
    city: "成都",
    bio: "插画师｜猫奴｜火锅一级爱好者。",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop",
  },
];

function ChevronLeftIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default function MatchPage() {
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState(null);

  const current = PROFILES[index];
  const done = index >= PROFILES.length;

  const next = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  const onPass = useCallback(() => {
    next();
  }, [next]);

  const onLike = useCallback(() => {
    setToast("互相喜欢，匹配成功！");
    window.setTimeout(() => setToast(null), 2200);
    next();
  }, [next]);

  return (
    <div className="relative min-h-dvh bg-gray-50 pb-20 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center px-2">
          <button
            type="button"
            onClick={() => window.__circleNavigate?.toHome?.()}
            className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-white/80"
            aria-label="返回"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="flex-1 pr-10 text-center text-base font-semibold">发现 · 匹配</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-[4.5rem]">
        {done ? (
          <div className="flex min-h-[65dvh] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/[0.04]">
            <p className="text-lg font-medium text-slate-800">今天推荐已看完</p>
            <p className="mt-2 text-sm text-slate-500">明天再来，或去首页刷刷动态吧</p>
            <button
              type="button"
              onClick={() => setIndex(0)}
              className="mt-6 rounded-2xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform active:scale-[0.98]"
            >
              再看一遍
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.06]">
              <div className="relative aspect-[3/4] w-full bg-slate-100">
                <img src={current.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 pb-6 pt-24">
                  <p className="text-xl font-bold text-white">
                    {current.name}
                    <span className="ml-2 text-base font-normal text-white/90">
                      {current.age} · {current.city}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/90">{current.bio}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-10">
              <button
                type="button"
                onClick={onPass}
                className="grid h-16 w-16 place-items-center rounded-full border-2 border-slate-200 bg-white text-slate-500 shadow-sm transition active:scale-95"
                aria-label="跳过"
              >
                <span className="text-2xl leading-none">✕</span>
              </button>
              <button
                type="button"
                onClick={onLike}
                className="grid h-[4.25rem] w-[4.25rem] place-items-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 transition active:scale-95"
                aria-label="喜欢"
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
                  <path d="M12 21s-6.716-4.728-9.33-8.59C.5 9.58.5 6.57 2.67 4.42 4.84 2.27 7.5 2.5 9.5 4.5c.35.35.7.75 1 1.18.3-.43.65-.83 1-1.18 2-2 4.66-2.23 6.83-.08 2.17 2.15 2.17 5.16-.5 7.92C17.716 16.272 12 21 12 21Z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </main>

      {toast ? (
        <div
          className="pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center px-4"
          role="status"
        >
          <div className="rounded-full bg-slate-900/90 px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-sm">
            {toast}
          </div>
        </div>
      ) : null}

      <BottomTabs active="match" />
    </div>
  );
}
