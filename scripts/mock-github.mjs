// Faux serveur de l'API GitHub, pour tester l'administration de la carte SANS toucher au vrai dépôt.
// Usage : node scripts/mock-github.mjs [port]   (défaut 8099)
// Puis, dans la console du navigateur sur http://localhost:… : localStorage.setItem("ens.devApi", "http://localhost:8099")
// (admin.js n'accepte cette adresse que si le site est servi depuis localhost).
// Jetons FICTIFS reconnus (aucune valeur réelle) :
//   test_admin_token_0123456789abcd   → compte « admin-test » avec droit d'écriture
//   test_reader_token_0123456789abcd  → compte « lecteur-test » sans droit d'écriture
// Les écritures restent en mémoire (rien n'est écrit sur le disque) et sont perdues à l'arrêt du serveur.
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2]) || 8099;
const USERS = {
  test_admin_token_0123456789abcd: { login: "admin-test", name: "Administrateur de test", push: true },
  test_reader_token_0123456789abcd: { login: "lecteur-test", name: "Lecteur de test", push: false }
};
let content = readFileSync(join(root, "data", "map-points.json"), "utf8");
const sha = () => createHash("sha1").update(content).digest("hex");
let commits = 0;

const send = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, X-GitHub-Api-Version", "Access-Control-Allow-Methods": "GET, PUT, OPTIONS" });
  res.end(body == null ? "" : JSON.stringify(body));
};
createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204);
  const url = new URL(req.url, "http://x");
  const user = USERS[(req.headers.authorization || "").replace(/^Bearer\s+/, "")];
  if (!user) return send(res, 401, { message: "Bad credentials" });
  if (url.pathname === "/user") return send(res, 200, { login: user.login, name: user.name, avatar_url: "" });
  const m = url.pathname.match(/^\/repos\/([^/]+\/[^/]+)(\/contents\/(.+))?$/);
  if (!m) return send(res, 404, { message: "Not Found" });
  if (!m[2]) return send(res, 200, { full_name: m[1], permissions: { admin: false, push: user.push, pull: true } });
  if (req.method === "GET") return send(res, 200, { path: m[3], sha: sha(), content: Buffer.from(content).toString("base64"), encoding: "base64" });
  if (req.method === "PUT") {
    if (!user.push) return send(res, 403, { message: "Resource not accessible by personal access token" });
    let body = "";
    for await (const c of req) body += c;
    const b = JSON.parse(body || "{}");
    if (b.sha !== sha()) return send(res, 409, { message: "sha mismatch" });
    content = Buffer.from(b.content, "base64").toString("utf8");
    commits++;
    const c = createHash("sha1").update("commit" + commits + content).digest("hex");
    console.log(`commit ${c.slice(0, 7)} par ${user.login} : ${b.message.split("\n")[0]}`);
    return send(res, 200, { content: { sha: sha() }, commit: { sha: c, html_url: "http://localhost/commit/" + c } });
  }
  send(res, 405, { message: "Method not allowed" });
}).listen(port, () => console.log(`Faux GitHub sur http://localhost:${port} (données en mémoire)`));
