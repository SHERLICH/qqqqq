import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Register.jsx";
import HomePage from "./pages/HomePage.jsx";
import MatchPage from "./pages/MatchPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Profile from "./pages/Profile.jsx";

const titles = {
  "/": "MENTAL MATCH · 注册并登录",
  "/home": "首页 · MENTAL MATCH",
  "/match": "匹配 · MENTAL MATCH",
  "/chat": "消息 · MENTAL MATCH",
  "/profile": "我的 · MENTAL MATCH",
};

function DocumentTitle() {
  const location = useLocation();
  useEffect(() => {
    document.title = titles[location.pathname] || "MENTAL MATCH";
    document.body.className = location.pathname === "/" ? "min-h-dvh bg-white text-slate-900 antialiased" : "min-h-dvh bg-gray-50 text-slate-900 antialiased";
  }, [location.pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <DocumentTitle />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
