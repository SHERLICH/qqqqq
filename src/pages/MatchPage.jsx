import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav.jsx";
import MatchFlow from "../components/MatchFlow.jsx";

function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default function MatchPage() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-dvh bg-gray-50 pb-20 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center px-2">
          <button type="button" onClick={() => navigate("/home")} className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-white/80" aria-label="返回">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="flex-1 pr-10 text-center text-base font-semibold">MENTAL MATCH</h1>
        </div>
      </header>
      <main className="pt-14"><MatchFlow /></main>
      <BottomNav />
    </div>
  );
}
