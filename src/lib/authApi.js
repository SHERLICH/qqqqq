const rawBase = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8787";
const API_BASE = rawBase.replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "请求失败，请稍后重试");
  return data;
}

export const registerUser = (payload) => request("/api/register", { method: "POST", body: JSON.stringify(payload) });
export const loginUser = (payload) => request("/api/login", { method: "POST", body: JSON.stringify(payload) });
export const fetchFeed = () => request("/api/feed");
export const createPost = (payload) => request("/api/feed/create", { method: "POST", body: JSON.stringify(payload) });
export const likePost = (payload) => request("/api/feed/like", { method: "POST", body: JSON.stringify(payload) });
export const fetchChatData = () => request("/api/chat");
export const sendChatMessage = (payload) => request("/api/chat/send", { method: "POST", body: JSON.stringify(payload) });

export { API_BASE };
