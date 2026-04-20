import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const files = {
  users: path.join(dataDir, "users.json"),
  feed: path.join(dataDir, "feed.json"),
  chats: path.join(dataDir, "chats.json"),
};

// 优先读取 Render 自动分配的 PORT 环境变量，如果没有读到，就默认使用 3000 端口
const port = process.env.PORT || 3000;
const allowedOrigin = process.env.CORS_ORIGIN || "*";
const defaultAvatar =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces&auto=format&q=80";

const seedFeed = [
  { id: "feed-a", nickname: "光影捕手", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face", time: "2小时前", text: "周末去海边捕捉到的一组光影，感觉很棒📸", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop", likes: 186 },
  { id: "feed-b", nickname: "积木实验室", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face", time: "5小时前", text: "终于把儿童运算积木+绘画交互的实体Demo跑通了！看着小朋友玩得很开心，这几个月的通宵值了。🧩", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=800&fit=crop", likes: 342 },
  { id: "feed-c", nickname: "雪道漫游", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face", time: "昨天", text: "等不及下一个雪季了，翻出之前的滑雪视频解解馋🏂", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=800&fit=crop", likes: 89 },
];

const seedChats = {
  threads: [
    { id: "t1", name: "林晚", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face", preview: "周末拍的那组海边照片发你啦～", time: "12:04", unread: true },
    { id: "t2", name: "活动小助手", avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop", preview: "你报名的「城市徒步」将在周六上午集合", time: "昨天", unread: false },
    { id: "t3", name: "阿哲", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&crop=face", preview: "好呀，下周可以一起探店", time: "周一", unread: false },
  ],
  messages: {
    t1: [{ id: "a1", from: "them", text: "嗨，看到你也在厦门～", time: "昨天 18:20" }, { id: "a2", from: "me", text: "你好呀，最近常去环岛路跑步", time: "昨天 18:22" }, { id: "a3", from: "them", text: "周末拍的那组海边照片发你啦～", time: "12:04" }],
    t2: [{ id: "b1", from: "them", text: "感谢报名「城市徒步」活动！", time: "10:00" }, { id: "b2", from: "them", text: "周六 9:00 在体育中心北门集合，别迟到哦", time: "10:01" }],
    t3: [{ id: "c1", from: "me", text: "你上次说的那家咖啡馆在哪？", time: "周一 15:10" }, { id: "c2", from: "them", text: "好呀，下周可以一起探店", time: "周一 15:30" }],
  },
};

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(res, status, payload) {
  setCorsHeaders(res);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

const hashPassword = (password) => createHash("sha256").update(password).digest("hex");
const buildNickname = () => `设计新星_${Math.floor(1000 + Math.random() * 9000)}`;
const toUserView = (user) => ({ id: user.id, phone: user.phone, nickname: user.nickname, avatar: user.avatar });

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  if (!existsSync(files.users)) await writeFile(files.users, "[]", "utf8");
  if (!existsSync(files.feed)) await writeFile(files.feed, JSON.stringify(seedFeed, null, 2), "utf8");
  if (!existsSync(files.chats)) await writeFile(files.chats, JSON.stringify(seedChats, null, 2), "utf8");
}

async function readJson(file, fallback) {
  await ensureStore();
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw || JSON.stringify(fallback));
}

async function writeJson(file, value) {
  await ensureStore();
  await writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

const server = createServer(async (req, res) => {
  if (!req.url) return json(res, 404, { message: "Not found" });
  if (req.method === "OPTIONS") return json(res, 200, { ok: true });

  try {
    if (req.method === "POST" && req.url === "/api/register") {
      const body = await readBody(req);
      const phone = String(body.phone || "").trim();
      const password = String(body.password || "");
      const smsCode = String(body.smsCode || "").trim();
      if (!phone || phone.length < 6) return json(res, 400, { message: "手机号格式不正确" });
      if (password.length < 6) return json(res, 400, { message: "密码至少 6 位" });
      if (smsCode.length < 4) return json(res, 400, { message: "验证码格式不正确" });
      const users = await readJson(files.users, []);
      if (users.some((item) => item.phone === phone)) return json(res, 409, { message: "该手机号已注册，请直接登录" });
      const user = { id: randomUUID(), phone, passwordHash: hashPassword(password), nickname: buildNickname(), avatar: body.avatar || defaultAvatar, createdAt: new Date().toISOString() };
      users.push(user);
      await writeJson(files.users, users);
      return json(res, 201, { user: toUserView(user), token: randomUUID() });
    }

    if (req.method === "POST" && req.url === "/api/login") {
      const body = await readBody(req);
      const phone = String(body.phone || "").trim();
      const password = String(body.password || "");
      const users = await readJson(files.users, []);
      const user = users.find((item) => item.phone === phone);
      if (!user || user.passwordHash !== hashPassword(password)) return json(res, 401, { message: "手机号或密码错误" });
      return json(res, 200, { user: toUserView(user), token: randomUUID() });
    }

    if (req.method === "GET" && req.url === "/api/feed") return json(res, 200, { posts: await readJson(files.feed, seedFeed) });

    if (req.method === "POST" && req.url === "/api/feed/create") {
      const body = await readBody(req);
      const nickname = String(body.nickname || "").trim();
      const avatar = String(body.avatar || defaultAvatar).trim() || defaultAvatar;
      const text = String(body.text || "").trim();
      const image = String(body.image || "").trim();
      if (!nickname) return json(res, 400, { message: "缺少发布者昵称" });
      if (!text) return json(res, 400, { message: "动态内容不能为空" });
      const posts = await readJson(files.feed, seedFeed);
      const post = { id: randomUUID(), nickname, avatar, time: "刚刚", text, image: image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop", likes: 0 };
      posts.unshift(post);
      await writeJson(files.feed, posts);
      return json(res, 201, { post, posts });
    }

    if (req.method === "POST" && req.url === "/api/feed/like") {
      const body = await readBody(req);
      const postId = String(body.postId || "");
      const increment = body.liked ? 1 : -1;
      const posts = await readJson(files.feed, seedFeed);
      const next = posts.map((post) => (post.id === postId ? { ...post, likes: Math.max(0, Number(post.likes || 0) + increment) } : post));
      await writeJson(files.feed, next);
      return json(res, 200, { posts: next });
    }

    if (req.method === "GET" && req.url === "/api/chat") return json(res, 200, await readJson(files.chats, seedChats));

    if (req.method === "POST" && req.url === "/api/chat/send") {
      const body = await readBody(req);
      const threadId = String(body.threadId || "");
      const text = String(body.text || "").trim();
      if (!threadId || !text) return json(res, 400, { message: "消息内容不能为空" });
      const chat = await readJson(files.chats, seedChats);
      const message = { id: randomUUID(), from: "me", text, time: "刚刚" };
      chat.messages[threadId] = [...(chat.messages[threadId] || []), message];
      chat.threads = (chat.threads || []).map((thread) => thread.id === threadId ? { ...thread, preview: text, time: "刚刚", unread: false } : thread);
      await writeJson(files.chats, chat);
      return json(res, 200, chat);
    }

    if (req.method === "GET" && req.url === "/api/health") return json(res, 200, { ok: true, port });
    return json(res, 404, { message: "Not found" });
  } catch (error) {
    return json(res, 500, { message: error instanceof Error ? error.message : "服务器异常" });
  }
});

// 启动服务
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
