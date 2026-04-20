import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml; charset=utf-8",
};

function resolvePath(baseDir, urlPath) {
  const raw = (urlPath || "/").split("?")[0];
  const decoded = decodeURIComponent(raw);
  const rel = decoded === "/" ? "index.html" : decoded.replace(/^\//, "");
  const full = path.normalize(path.join(baseDir, rel));
  if (!full.startsWith(baseDir)) return null;
  return full;
}

const server = http.createServer((req, res) => {
  const target = resolvePath(__dirname, req.url);
  if (!target) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(target, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(target);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`本地预览: http://127.0.0.1:${PORT}/`);
  console.log(`注册页: http://127.0.0.1:${PORT}/#register`);
});
