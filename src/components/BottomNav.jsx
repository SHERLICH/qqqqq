import { useLocation, useNavigate } from "react-router-dom";

function HomeNavIcon({ className, active }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      {!active && <polyline points="9 22 9 12 15 12 15 22" />}
    </svg>
  );
}

function MatchNavIcon({ className }) {
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
      <path d="M16 8a4 4 0 0 1 0 8" />
      <path d="M8 8a4 4 0 1 0 0 8" />
      <path d="M12 16v2" />
      <path d="M12 6V4" />
    </svg>
  );
}

function ChatNavIcon({ className }) {
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
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  );
}

function UserIcon({ className }) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const TABS = [
  { key: "home", label: "首页", path: "/home", icon: HomeNavIcon, match: (p) => p === "/home" },
  { key: "match", label: "匹配", path: "/match", icon: MatchNavIcon, match: (p) => p === "/match" },
  {
    key: "chat",
    label: "消息",
    path: "/chat",
    icon: ChatNavIcon,
    match: (p) => p === "/chat",
  },
  { key: "profile", label: "我的", path: "/profile", icon: UserIcon, match: (p) => p === "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-lg grid-cols-4 px-1 pb-[env(safe-area-inset-bottom,0px)] pt-1">
        {TABS.map(({ key, label, path, icon: Icon, match: isActive }) => {
          const active = isActive(pathname);
          return (
            <button
              key={key}
              type="button"
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 py-2 transition ${active ? "text-orange-500" : "text-slate-400 hover:text-slate-600"}`}
              aria-current={active ? "page" : undefined}
            >
              {key === "home" ? (
                <Icon className="h-6 w-6" active={active} />
              ) : key === "chat" ? (
                <span className="relative inline-flex">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </span>
              ) : (
                <Icon className="h-6 w-6" />
              )}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
