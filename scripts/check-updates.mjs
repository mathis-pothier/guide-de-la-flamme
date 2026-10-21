// Détecte les nouvelles actualités officielles d'Enshrouded sur Steam (API publique ISteamNews).
// Ne modifie AUCUNE donnée de jeu : signale seulement ce qu'il faut vérifier.
// Usage : node scripts/check-updates.mjs          → liste les actualités depuis la dernière vérification
//         node scripts/check-updates.mjs --save   → mémorise la plus récente dans data/versions.js
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP_ID = 1203620;
const file = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "versions.js");
const src = readFileSync(file, "utf8");
const last = (src.match(/derniereNewsSteam:\s*"(\d+)"/) || [])[1] || null;
const version = (src.match(/versionJeu:\s*"([^"]+)"/) || [])[1];

const url = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${APP_ID}&count=15&maxlength=400&feeds=steam_community_announcements`;
let news;
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  news = (await res.json()).appnews.newsitems;
} catch (e) {
  console.error("Impossible de joindre l'API Steam :", e.message);
  console.error("Vérifiez manuellement : https://store.steampowered.com/news/app/" + APP_ID);
  process.exit(2);
}

const lastIdx = last ? news.findIndex((n) => n.gid === last) : -1;
const fresh = lastIdx === -1 ? news : news.slice(0, lastIdx);
const KEYWORDS = /patch|hotfix|update|mise à jour|changelog|\b\d+\.\d+\.\d+/i;

console.log(`Version enregistrée sur le site : ${version}`);
console.log(last ? `Dernière actualité mémorisée : ${last}` : "Aucune actualité mémorisée (première exécution).");
if (!fresh.length) console.log("✓ Aucune nouvelle actualité officielle.");
fresh.forEach((n) => {
  const d = new Date(n.date * 1000).toISOString().slice(0, 10);
  const flag = KEYWORDS.test(n.title + " " + n.contents) ? "⚑ PROBABLE MISE À JOUR" : "  annonce";
  console.log(`\n${flag}  ${d}  ${n.title}\n   ${n.url}`);
});
if (fresh.some((n) => KEYWORDS.test(n.title + " " + n.contents))) {
  console.log("\n→ Suivez la procédure de MISE-A-JOUR.md avant de modifier les données.");
}
if (process.argv.includes("--save") && news[0]) {
  writeFileSync(file, src.replace(/derniereNewsSteam:\s*(null|"\d+")/, `derniereNewsSteam: "${news[0].gid}"`));
  console.log(`\nMémorisé : ${news[0].gid} (« ${news[0].title} »).`);
}
