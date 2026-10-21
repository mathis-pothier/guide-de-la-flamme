// Vérifie la cohérence des données : identifiants uniques, sources existantes, références des builds,
// statuts valides, dates de vérification. Usage : node scripts/validate.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {} };
vm.createContext(ctx);
const curatedCtx = { window: {} };
vm.createContext(curatedCtx);
vm.runInContext(readFileSync(join(root, "data", "items.js"), "utf8"), curatedCtx);
const curatedItems = curatedCtx.window.ENS.items;
for (const f of ["sources", "items", "skills", "builds", "builds-1.0", "versions", "catalog", "images", "map", "progression", "tronc-commun", "construction", "merge"]) {
  vm.runInContext(readFileSync(join(root, "data", f + ".js"), "utf8"), ctx, { filename: f + ".js" });
}
const D = ctx.window.ENS;
const errors = [], warnings = [];
const ids = (list) => new Set(list.map((x) => x.id));
const src = ids(D.sources), items = ids(D.items), skills = ids(D.skills), styles = ids(D.styles);

const dupes = (list, label) => {
  const seen = new Set();
  list.forEach((x) => { if (seen.has(x.id)) errors.push(`${label} : identifiant en double « ${x.id} »`); seen.add(x.id); });
};
dupes(D.sources, "Source"); dupes(D.items, "Objet"); dupes(D.skills, "Compétence"); dupes(D.builds, "Build");

const checkSources = (x, label) => {
  if (!x.sources?.length) errors.push(`${label} « ${x.id || x.version} » : aucune source`);
  (x.sources || []).forEach((s) => { if (!src.has(s)) errors.push(`${label} « ${x.id || x.version} » : source inconnue « ${s} »`); });
};
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const ITEM_ST = ["v1", "w10", "pre", "conflit", "guide"], SKILL_ST = ["wiki", "modif", "nouv", "guide"];

D.items.forEach((it) => {
  checkSources(it, "Objet");
  if (!ITEM_ST.includes(it.statut)) errors.push(`Objet « ${it.id} » : statut invalide « ${it.statut} »`);
  if (!ISO.test(it.verifie || "")) errors.push(`Objet « ${it.id} » : date « verifie » manquante ou invalide`);
  if (it.statut === "conflit" && !it.conflits?.length) errors.push(`Objet « ${it.id} » : statut conflit sans détail des conflits`);
  (it.styles || []).forEach((s) => { if (!styles.has(s)) errors.push(`Objet « ${it.id} » : style inconnu « ${s} »`); });
  if (it.verifie && (Date.now() - new Date(it.verifie)) / 864e5 > 60 && curatedItems.some((c) => c.id === it.id)) warnings.push(`Objet « ${it.id} » : vérifié il y a plus de 60 jours`);
});
D.skills.forEach((s) => {
  checkSources(s, "Compétence");
  if (!SKILL_ST.includes(s.statut)) errors.push(`Compétence « ${s.id} » : statut invalide « ${s.statut} »`);
  (s.prerequis || []).forEach((p) => { if (!skills.has(p)) errors.push(`Compétence « ${s.id} » : prérequis inconnu « ${p} »`); });
});
D.builds.forEach((b) => {
  checkSources(b, "Build");
  if (!styles.has(b.style)) errors.push(`Build « ${b.id} » : style inconnu`);
  b.equipement.forEach((slot) => {
    [slot.meilleur, ...slot.etapes.map((e) => e.item)].filter(Boolean).forEach((i) => { if (!items.has(i)) errors.push(`Build « ${b.id} » : objet inconnu « ${i} »`); });
  });
  const c = b.competences;
  [...c.essentielles, ...c.optionnelles, ...(c.ordre || [])].forEach((s) => { if (!skills.has(s)) errors.push(`Build « ${b.id} » : compétence inconnue « ${s} »`); });
});
[...D.skillRecs.generales, ...D.skillRecs.equipe].forEach((r) => { if (!skills.has(r.id)) errors.push(`Recommandation : compétence inconnue « ${r.id} »`); });
D.versions.forEach((v) => checkSources(v, "Version"));
if (D.meta.versionJeu !== D.versions[0].version) errors.push(`meta.versionJeu (${D.meta.versionJeu}) ≠ dernière entrée de l'historique (${D.versions[0].version})`);

for (const m of D.map.marqueurs) if (!(m.x >= 0 && m.y >= 0 && m.x <= D.map.taille && m.y <= D.map.taille)) errors.push(`Carte : marqueur hors du fond « ${m.nom} »`);
for (const it of D.items) for (const id of it.marqueurs || []) if (!D.map.marqueurs.some((m) => m.id === id)) warnings.push(`Objet « ${it.id} » : marqueur « ${id} » absent de la carte`);
for (const g of D.tronc.groupes) for (const c of g.competences) {
  if (!skills.has(c.id)) errors.push(`Tronc commun : compétence inconnue « ${c.id} »`);
  if (!c.site && !c.sources?.length) errors.push(`Tronc commun « ${c.id} » : ni source ni mention « conseil du site »`);
  (c.sources || []).forEach((s) => { if (!src.has(s)) errors.push(`Tronc commun « ${c.id} » : source inconnue « ${s} »`); });
}
for (const [bid, p] of Object.entries(D.progression)) for (const id of [...(p.debut || []), ...(p.milieu || []), p.fin].filter(Boolean)) if (!items.has(id) && !items.has(D.alias[id])) errors.push(`Progression « ${bid} » : set inconnu « ${id} »`);
const PIECES = ["Tête", "Torse", "Mains", "Jambes", "Pieds"];
let holes = 0;
for (const b of D.builds) for (const s of b.equipement) if (PIECES.includes(s.emplacement)) for (const k of ["debut", "milieu"]) if (!s.etapes.some((e) => e.item && e.etape.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().startsWith(k))) { holes++; warnings.push(`Build « ${b.id} » / ${s.emplacement} : aucune pièce sourcée pour l'étape ${k} (repli automatique)`); }
console.log(`Emplacements d'armure sans conseil sourcé à une étape : ${holes}`);
if (D.construction) {
  const C = D.construction, mk = new Set(D.map.marqueurs.map((m) => m.id));
  for (const x of [...C.blocs, ...C.survivants, ...C.emplacements]) for (const id of x.marqueurs || []) if (!mk.has(id)) errors.push(`Construction : lieu « ${id} » absent de la carte (${x.nom})`);
  for (const id of [...C.blocsSources, ...C.autel.sources, ...C.confort.sources, ...C.survivantsSources, ...C.batiments.flatMap((b) => b.sources), ...C.emplacements.flatMap((e) => e.sources), ...C.videos.map((v) => v.id)]) if (!src.has(id)) errors.push(`Construction : source inconnue « ${id} »`);
  for (const b of C.blocs) if (!["ramassage", "fabrication", "lieu"].includes(b.mode)) errors.push(`Construction : mode invalide pour « ${b.nom} »`);
  console.log(`Construction : ${C.blocs.length} blocs (${C.blocs.filter((b) => (b.marqueurs || []).length).length} épinglés), ${C.batiments.length} bâtiments, ${C.emplacements.length} emplacements.`);
}
const noImg = D.items.filter((i) => !D.images[i.id] && !D.images[i.catalogId]).length;
console.log(`Objets sans image (icône générée) : ${noImg}`);
const statCount = D.items.reduce((a, i) => ((a[i.statut] = (a[i.statut] || 0) + 1), a), {});
console.log(`${D.items.length} objets ${JSON.stringify(statCount)}, ${D.skills.length} compétences, ${D.builds.length} builds, ${D.sources.length} sources.`);
warnings.forEach((w) => console.warn("⚠ " + w));
if (errors.length) { errors.forEach((e) => console.error("✗ " + e)); process.exit(1); }
console.log("✓ Données cohérentes.");
