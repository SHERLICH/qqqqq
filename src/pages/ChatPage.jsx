import { useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "../components/BottomNav.jsx";
import { fetchChatData, sendChatMessage } from "../lib/authApi.js";

function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default function ChatPage() {
  const [activeId, setActiveId] = useState(null);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState({});
  const [draft, setDraft] = useState("");
  const listEndRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    fetchChatData()
      .then((data) => {
        if (!mounted) return;
        setThreads(data.threads || []);
        setMessages(data.messages || {});
      })
      .catch(() => {
        if (!mounted) return;
        setThreads([]);
        setMessages({});
      });
    return () => {
      mounted = false;
    };
  }, []);

  const activeThread = useMemo(() => threads.find((t) => t.id === activeId), [threads, activeId]);
  const threadMessages = activeId ? messages[activeId] || [] : [];

  useEffect(() => {
    if (!activeId) return;
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, threadMessages.length]);

  async function send() {
    const text = draft.trim();
    if (!text || !activeId) return;
    const optimistic = { id: `local-${Date.now()}`, from: "me", text, time: "刚刚" };
    setMessages((prev) => ({ ...prev, [activeId]: [...(prev[activeId] || []), optimistic] }));
    setDraft("");
    try {
      const data = await sendChatMessage({ threadId: activeId, text });
      setThreads(data.threads || []);
      setMessages(data.messages || {});
    } catch {
      setMessages((prev) => ({ ...prev, [activeId]: (prev[activeId] || []).filter((m) => m.id !== optimistic.id) }));
    }
  }

  if (!activeId) {
    return (
      <div className="relative min-h-dvh bg-gray-50 pb-20 text-slate-900">
        <header className="fixed inset-x-0 top-0 z-20 border-b border-white/50 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-lg items-center px-4">
            <h1 className="text-base font-semibold">消息</h1>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-0 pt-14">
          <ul className="divide-y divide-slate-100 bg-white">
            {threads.map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => setActiveId(t.id)} className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50 active:bg-slate-100">
                  <img src={t.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-black/5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-slate-900">{t.name}</span>
                      <span className="shrink-0 text-xs text-slate-400">{t.time}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-slate-500">{t.preview}</p>
                  </div>
                  {t.unread ? <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </main>

        <BottomNav />
      </div>
    );
  }

  if (!activeThread) return null;

  return (
    <div className="relative flex min-h-dvh flex-col bg-gray-50 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-1 px-1">
          <button type="button" onClick={() => setActiveId(null)} className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100" aria-label="返回会话列表">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <img src={activeThread.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-black/5" />
            <span className="truncate font-semibold text-slate-900">{activeThread.name}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col pt-14 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))]">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {threadMessages.map((m) =>
            m.from === "me" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-orange-500 px-3.5 py-2 text-[15px] leading-relaxed text-white shadow-sm">{m.text}</div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2 text-[15px] leading-relaxed text-slate-800 shadow-sm ring-1 ring-black/[0.04]">{m.text}</div>
              </div>
            )
          )}
          <div ref={listEndRef} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="mx-auto flex max-w-lg gap-2">
          <input type="text" placeholder="发消息…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-[15px] outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" />
          <button type="button" onClick={send} className="shrink-0 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-95">发送</button>
        </div>
      </div>
    </div>
  );
}
