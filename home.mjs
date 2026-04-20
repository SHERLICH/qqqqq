import React, { useState } from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import BottomTabs from "./bottom-tabs.mjs";

const html = htm.bind(React.createElement);

const MOCK_POSTS = [
  {
    id: "feed-a",
    nickname: "光影捕手",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
    time: "2小时前",
    text: "周末去海边捕捉到的一组光影，感觉很棒📸",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop",
    likes: 186,
  },
  {
    id: "feed-b",
    nickname: "积木实验室",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face",
    time: "5小时前",
    text:
      "终于把儿童运算积木+绘画交互的实体Demo跑通了！看着小朋友玩得很开心，这几个月的通宵值了。🧩",
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=800&fit=crop",
    likes: 342,
  },
  {
    id: "feed-c",
    nickname: "雪道漫游",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
    time: "昨天",
    text: "等不及下一个雪季了，翻出之前的滑雪视频解解馋🏂",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=800&fit=crop",
    likes: 89,
  },
];

function SearchIcon({ className }) {
  return html`
    <svg
      className=${className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  `;
}

function BellIcon({ className }) {
  return html`
    <svg
      className=${className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  `;
}

function HeartIcon({ filled, className }) {
  if (filled) {
    return html`
      <svg className=${className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M12 21s-6.716-4.728-9.33-8.59C.5 9.58.5 6.57 2.67 4.42 4.84 2.27 7.5 2.5 9.5 4.5c.35.35.7.75 1 1.18.3-.43.65-.83 1-1.18 2-2 4.66-2.23 6.83-.08 2.17 2.15 2.17 5.16-.5 7.92C17.716 16.272 12 21 12 21Z"
        />
      </svg>
    `;
  }
  return html`
    <svg
      className=${className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M12 21s-6.716-4.728-9.33-8.59C.5 9.58.5 6.57 2.67 4.42 4.84 2.27 7.5 2.5 9.5 4.5c.35.35.7.75 1 1.18.3-.43.65-.83 1-1.18 2-2 4.66-2.23 6.83-.08 2.17 2.15 2.17 5.16-.5 7.92C17.716 16.272 12 21 12 21Z"
      />
    </svg>
  `;
}

function CommentIcon({ className }) {
  return html`
    <svg
      className=${className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
      />
    </svg>
  `;
}

function ShareIcon({ className }) {
  return html`
    <svg
      className=${className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  `;
}

function MatchHeaderIcon({ className }) {
  return html`
    <svg
      className=${className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a4 4 0 0 1 0 8" />
      <path d="M8 8a4 4 0 1 0 0 8" />
      <path d="M12 16v2" />
      <path d="M12 6V4" />
    </svg>
  `;
}

export default function Home() {
  const [likeState, setLikeState] = useState(() =>
    Object.fromEntries(MOCK_POSTS.map((p) => [p.id, { liked: false, count: p.likes }]))
  );

  function toggleLike(postId) {
    setLikeState((prev) => {
      const cur = prev[postId];
      const nextLiked = !cur.liked;
      return {
        ...prev,
        [postId]: {
          liked: nextLiked,
          count: cur.count + (nextLiked ? 1 : -1),
        },
      };
    });
  }

  return html`
    <div className="relative min-h-dvh bg-gray-50 text-slate-900">
      <header
        className="fixed inset-x-0 top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight text-orange-500"> Circle </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-white/60"
              aria-label="搜索"
            >
              <${SearchIcon} className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick=${() => window.__circleNavigate?.toMatch?.()}
              className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-white/60"
              aria-label="匹配"
            >
              <${MatchHeaderIcon} className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick=${() => window.__circleNavigate?.toChat?.()}
              className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-white/60"
              aria-label="消息"
            >
              <${BellIcon} className="h-5 w-5" />
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white/70"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-3 pb-20 pt-16">
        <div
          className="max-h-[calc(100dvh-3.5rem-4rem)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="feed"
          aria-label="动态信息流"
        >
          <div className="space-y-4 py-1">
            ${MOCK_POSTS.map((post) => {
              const { liked, count } = likeState[post.id];
              return html`
                <article
                  key=${post.id}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src=${post.avatar}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-black/5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">${post.nickname}</p>
                      <p className="text-xs text-slate-500">${post.time}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-[15px] leading-relaxed text-slate-800">${post.text}</p>

                  <img
                    src=${post.image}
                    alt=""
                    className="mt-3 w-full rounded-lg object-cover"
                    style=${{ aspectRatio: "4 / 3" }}
                  />

                  <div
                    className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-slate-500"
                  >
                    <button
                      type="button"
                      onClick=${() => toggleLike(post.id)}
                      className="flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm transition-transform active:scale-95"
                      aria-pressed=${liked}
                    >
                      <${HeartIcon}
                        filled=${liked}
                        className=${`h-5 w-5 ${liked ? "text-red-500" : "text-slate-500"}`}
                      />
                      <span className=${liked ? "font-medium text-slate-800" : ""}>${count}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-lg transition active:scale-95"
                        aria-label="评论"
                      >
                        <${CommentIcon} className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-lg transition active:scale-95"
                        aria-label="分享"
                      >
                        <${ShareIcon} className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </article>
              `;
            })}
          </div>
        </div>
      </main>

      <${BottomTabs} active="home" />
    </div>
  `;
}
