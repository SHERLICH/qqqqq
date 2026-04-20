import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import { createPost, fetchFeed, likePost } from "../lib/authApi.js";
import { CURRENT_USER_KEY } from "../lib/userStorage.js";

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}
function BellIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function HeartIcon({ filled, className }) {
  return filled ? <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 21s-6.716-4.728-9.33-8.59C.5 9.58.5 6.57 2.67 4.42 4.84 2.27 7.5 2.5 9.5 4.5c.35.35.7.75 1 1.18.3-.43.65-.83 1-1.18 2-2 4.66-2.23 6.83-.08 2.17 2.15 2.17 5.16-.5 7.92C17.716 16.272 12 21 12 21Z" /></svg> : <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 21s-6.716-4.728-9.33-8.59C.5 9.58.5 6.57 2.67 4.42 4.84 2.27 7.5 2.5 9.5 4.5c.35.35.7.75 1 1.18.3-.43.65-.83 1-1.18 2-2 4.66-2.23 6.83-.08 2.17 2.15 2.17 5.16-.5 7.92C17.716 16.272 12 21 12 21Z" /></svg>;
}
function CommentIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" /></svg>;
}
function ShareIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>;
}
function MatchHeaderIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M16 8a4 4 0 0 1 0 8" /><path d="M8 8a4 4 0 1 0 0 8" /><path d="M12 16v2" /><path d="M12 6V4" /></svg>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [draft, setDraft] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    let mounted = true;
    fetchFeed().then((data) => {
      if (!mounted) return;
      setPosts(data.posts || []);
      setLikes(Object.fromEntries((data.posts || []).map((post) => [post.id, false])));
    }).catch(() => mounted && setPosts([]));
    return () => { mounted = false; };
  }, []);

  async function publishPost() {
    const text = draft.trim();
    if (!text || !currentUser?.nickname) return;
    setPublishing(true);
    setError("");
    try {
      const data = await createPost({ nickname: currentUser.nickname, avatar: currentUser.avatar, text });
      setPosts(data.posts || []);
      setLikes((prev) => ({ ...Object.fromEntries((data.posts || []).map((post) => [post.id, prev[post.id] || false])) }));
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "发布失败，请稍后重试");
    } finally {
      setPublishing(false);
    }
  }

  async function toggleLike(postId) {
    const nextLiked = !likes[postId];
    setLikes((prev) => ({ ...prev, [postId]: nextLiked }));
    try {
      const data = await likePost({ postId, liked: nextLiked });
      setPosts(data.posts || []);
    } catch {
      setLikes((prev) => ({ ...prev, [postId]: !nextLiked }));
    }
  }

  return (
    <div className="relative min-h-dvh bg-gray-50 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight text-red-500">MENTAL MATCH</span>
          <div className="flex items-center gap-1">
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-white/60" aria-label="搜索"><SearchIcon className="h-5 w-5" /></button>
            <button type="button" onClick={() => navigate("/match")} className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-white/60" aria-label="匹配"><MatchHeaderIcon className="h-5 w-5" /></button>
            <button type="button" onClick={() => navigate("/chat")} className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-white/60" aria-label="消息"><BellIcon className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white/70" /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-3 pb-20 pt-16">
        <div className="max-h-[calc(100dvh-3.5rem-4rem)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="feed" aria-label="动态信息流">
          <div className="space-y-4 py-1">
            <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04]">
              <div className="flex gap-3">
                <img src={currentUser?.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-black/5" />
                <div className="min-w-0 flex-1">
                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="分享这一刻的想法与心情…" rows={3} className="w-full resize-none rounded-2xl bg-slate-50 px-4 py-3 text-sm outline-none ring-1 ring-transparent placeholder:text-slate-400 focus:ring-orange-200" />
                  {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">发布后将出现在首页动态流</span>
                    <button type="button" onClick={publishPost} disabled={!draft.trim() || publishing} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${draft.trim() && !publishing ? "bg-orange-500 text-white shadow-soft hover:bg-orange-600" : "bg-orange-100 text-orange-400"}`}>
                      {publishing ? "发布中…" : "发布动态"}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {posts.map((post) => {
              const liked = !!likes[post.id];
              return (
                <article key={post.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04]">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-black/5" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{post.nickname}</p>
                      <p className="text-xs text-slate-500">{post.time}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-800">{post.text}</p>
                  <img src={post.image} alt="" className="mt-3 w-full rounded-lg object-cover" style={{ aspectRatio: "4 / 3" }} />
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-slate-500">
                    <button type="button" onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm transition-transform active:scale-95" aria-pressed={liked}><HeartIcon filled={liked} className={`h-5 w-5 ${liked ? "text-red-500" : "text-slate-500"}`} /><span className={liked ? "font-medium text-slate-800" : ""}>{post.likes}</span></button>
                    <div className="flex items-center gap-2"><button type="button" className="grid h-9 w-9 place-items-center rounded-lg transition active:scale-95" aria-label="评论"><CommentIcon className="h-5 w-5" /></button><button type="button" className="grid h-9 w-9 place-items-center rounded-lg transition active:scale-95" aria-label="分享"><ShareIcon className="h-5 w-5" /></button></div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
