// Collecte du bestiaire sur le wiki officiel (enshrouded.wiki.gg), partagée par scripts/collect.mjs (Node, GitHub Action)
// et scripts/collect.html (navigateur, quand Node n'a pas d'accès réseau).
// Rapporte le texte brut des pages ; l'analyse est faite par scripts/build-bestiaire.mjs.
//   api(query)   → réponse JSON de https://enshrouded.wiki.gg/api.php
//   apiFr(query) → réponse JSON de https://enshrouded.wiki.gg/fr/api.php (noms officiels français, quand le wiki français les donne)

// Catégories parcourues : « Creatures » contient Enemies (Fell, Hollow, Scavenger, Vukah, Bosses), Wildlife et les animaux
// de compagnie ; les Drak et les boss sont relus à part pour ne rien manquer.
export const CATEGORIES_CREATURES = ["Category:Creatures", "Category:Drak", "Category:Bosses"];
// Page qui définit « Effective » / « Resisted » et publie les multiplicateurs mesurés par les joueurs
export const PAGE_MECANIQUES = "Combat Mechanics";

async function membres(api, cat, profondeur, vus = new Set()) {
  if (vus.has(cat)) return [];
  vus.add(cat);
  let out = [], cont = "";
  do {
    const j = await api("action=query&list=categorymembers&cmlimit=500&cmtitle=" + encodeURIComponent(cat) + cont);
    for (const m of j.query.categorymembers) {
      if (m.ns === 0) out.push({ title: m.title, cat });
      else if (m.ns === 14 && profondeur > 0) out = out.concat(await membres(api, m.title, profondeur - 1, vus));
    }
    cont = j.continue ? "&cmcontinue=" + encodeURIComponent(j.continue.cmcontinue) : "";
  } while (cont);
  return out;
}

async function pages(api, titres, log, sleep) {
  const res = {};
  for (let k = 0; k < titres.length; k += 50) {
    const lot = titres.slice(k, k + 50);
    // Vignette de 320 px (au lieu de l'original, souvent bien plus lourd)
    const j = await api("action=query&redirects=1&prop=revisions|pageimages&piprop=thumbnail&pithumbsize=320&rvprop=content|timestamp&rvslots=main&titles=" +
      encodeURIComponent(lot.join("|")));
    for (const p of Object.values(j.query.pages)) {
      const r = p.revisions?.[0];
      res[p.title] = { ts: r?.timestamp, text: r?.slots.main["*"] || "", image: p.thumbnail?.source || null, missing: p.missing !== undefined };
    }
    log(`  créatures ${Math.min(k + 50, titres.length)}/${titres.length}`);
    await sleep(300);
  }
  return res;
}

export async function collecterCreatures({ api, apiFr, log = () => {}, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  const liste = [];
  for (const c of CATEGORIES_CREATURES) {
    const m = await membres(api, c, c === "Category:Creatures" ? 3 : 1);
    log(`${c} : ${m.length}`);
    liste.push(...m);
  }
  const parTitre = {};
  for (const m of liste) (parTitre[m.title] ||= new Set()).add(m.cat);
  const titres = Object.keys(parTitre);
  if (titres.length < 60) throw new Error(`Seulement ${titres.length} pages de créatures : collecte incomplète.`);
  const contenu = await pages(api, [...titres, PAGE_MECANIQUES], log, sleep);
  for (const t of titres) if (contenu[t]) contenu[t].cats = [...parTitre[t]];
  const mecaniques = contenu[PAGE_MECANIQUES] || null;
  delete contenu[PAGE_MECANIQUES];

  // Wiki français : pages des catégories de créatures ; la correspondance avec l'anglais passe par l'image de l'infobox.
  const fr = {};
  if (apiFr) {
    try {
      const vus = new Set(), titresFr = [];
      for (const c of ["Catégorie:Créatures", "Catégorie:Ennemis", "Catégorie:Faune", "Catégorie:Creux", "Catégorie:Vukah"])
        for (const m of await membres(apiFr, c, 1)) if (!vus.has(m.title)) { vus.add(m.title); titresFr.push(m.title); }
      for (let k = 0; k < titresFr.length; k += 50) {
        const j = await apiFr("action=query&prop=revisions&rvprop=content|timestamp&rvslots=main&titles=" + encodeURIComponent(titresFr.slice(k, k + 50).join("|")));
        for (const p of Object.values(j.query.pages)) { const r = p.revisions?.[0]; if (r) fr[p.title] = { ts: r.timestamp, text: r.slots.main["*"] || "" }; }
      }
      log(`Wiki français : ${Object.keys(fr).length} pages`);
    } catch (e) { log("Wiki français indisponible : " + e.message); }
  }
  return { fetched: new Date().toISOString(), pages: contenu, mecaniques, fr };
}
