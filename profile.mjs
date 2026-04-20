import React, { useEffect, useState } from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import BottomTabs from "./bottom-tabs.mjs";
import { CURRENT_USER_KEY, maskPhone } from "./src/lib/userStorage.js";

const html = htm.bind(React.createElement);

function ChevronRightIcon({ className }) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  `;
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem(CURRENT_USER_KEY);
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
      setReady(true);
    }
    load();
    const onStorage = (e) => {
      if (e.key === CURRENT_USER_KEY || e.key === null) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    if (typeof window.__circleNavigate?.toRegister === "function") {
      window.__circleNavigate.toRegister();
    } else {
      window.location.hash = "#register";
    }
  }

  const menuItems = [
    { id: "works", label: "我的作品" },
    { id: "drafts", label: "草稿箱" },
    { id: "settings", label: "设置" },
  ];

  if (!ready) {
    return html`
      <div className="min-h-dvh bg-gray-50 pb-24 pt-16 text-center text-sm text-slate-500">
        加载中…
      </div>
    `;
  }

  if (!user?.phone) {
    return html`
      <div className="min-h-dvh bg-gray-50 pb-24 text-slate-900">
        <header
          className="fixed inset-x-0 top-0 z-20 border-b border-white/50 bg-white/90 backdrop-blur-md"
        >
          <div className="mx-auto flex h-14 max-w-lg items-center justify-center px-4">
            <h1 className="text-base font-semibold">我的</h1>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-6 pt-24 text-center">
          <p className="text-slate-600">请先登录以查看个人资料</p>
          <button
            type="button"
            onClick=${() => window.__circleNavigate?.toRegister?.()}
            className="mt-6 rounded-2xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-soft"
          >
            去注册 / 登录
          </button>
        </main>
        <${BottomTabs} active="me" />
      </div>
    `;
  }

  return html`
    <div className="min-h-dvh bg-gray-50 pb-24 text-slate-900">
      <header
        className="fixed inset-x-0 top-0 z-20 border-b border-white/50 bg-white/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-lg items-center justify-center px-4">
          <h1 className="text-base font-semibold">我的</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-20 pt-[4.5rem]">
        <section
          className="flex flex-col items-center rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-black/[0.04]"
        >
          <img
            src=${user.avatar}
            alt=""
            className="h-20 w-20 rounded-full object-cover ring-4 ring-orange-50"
          />
          <p className="mt-4 text-lg font-semibold text-slate-900">${user.nickname}</p>
          <p className="mt-1 text-sm text-slate-500">${maskPhone(user.phone)}</p>
        </section>

        <section className="mt-4 rounded-2xl bg-white px-4 py-5 shadow-sm ring-1 ring-black/[0.04]">
          <div className="grid grid-cols-3 gap-2 text-center text-sm text-slate-600">
            <span>获赞 <span className="font-bold text-slate-900">342</span></span>
            <span>关注 <span className="font-bold text-slate-900">45</span></span>
            <span>粉丝 <span className="font-bold text-slate-900">128</span></span>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]">
          <ul className="divide-y divide-slate-100">
            ${menuItems.map(
              (item) => html`
                <li key=${item.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-[15px] text-slate-800 transition hover:bg-slate-50 active:bg-slate-100"
                  >
                    <span>${item.label}</span>
                    <${ChevronRightIcon} className="h-5 w-5 text-slate-300" />
                  </button>
                </li>
              `
            )}
          </ul>
        </section>

        <div className="mt-8 px-1 pb-8">
          <button
            type="button"
            onClick=${handleLogout}
            className="h-12 w-full rounded-2xl border border-red-200 bg-white text-sm font-semibold text-red-500 shadow-sm transition hover:bg-red-50 active:scale-[0.99]"
          >
            退出登录
          </button>
        </div>
      </main>

      <${BottomTabs} active="me" />
    </div>
  `;
}
