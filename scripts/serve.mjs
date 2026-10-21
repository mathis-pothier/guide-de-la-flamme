// Mini serveur statique sans dépendance.
// Usage : node scripts/serve.mjs [port]            (défaut 8080)
//         node scripts/serve.mjs [port] --collect  (accepte aussi POST /__collect/<nom> → .collect/<nom>,
//                                                    utilisé par scripts/collect.html pour récupérer les données du wiki
//                                                    depuis le navigateur quand Node n'a pas d'accès réseau)
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv.find((a) => /^\d+$/.test(a))) || 8080;
const collect = process.argv.includes("--collect");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".md": "text/plain; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  if (req.method === "POST") {
    const m = collect && path.replace(/\\/g, "/").match(/^__collect\/([\w.-]+)$/);
    if (!m) { res.writeHead(403).end(); return; }
    const chunks = [];
    for await (const c of req) chunks.push(c);
    await mkdir(join(root, ".collect"), { recursive: true });
    await writeFile(join(root, ".collect", m[1]), Buffer.concat(chunks));
    res.writeHead(200).end("ok");
    return;
  }
  const file = join(root, path || "index.html");
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" }).end(body);
  } catch { res.writeHead(404).end("Introuvable"); }
}).listen(port, () => console.log(`Guide de la Flamme : http://localhost:${port}${collect ? " (mode collecte)" : ""}`));
