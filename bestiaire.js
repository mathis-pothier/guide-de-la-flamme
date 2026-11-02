/* Guide de la Flamme — onglet Bestiaire. Chargé avant app.js : ajoute la vue « bestiaire » à window.ENS_EXT
   (même mécanisme que l'accueil de refonte/refonte.js) et utilise les outils partagés d'app.js (window.ENS_API).
   Données : data/bestiaire.js (généré depuis le wiki par scripts/build-bestiaire.mjs) et data/bestiaire-notes.js (notes sourcées).
   Rien n'est déduit du nom ou de l'apparence d'une créature : chaque valeur affichée vient d'une source citée dans la fiche. */
(() => {
  "use strict";
  const { t, tp, tr, nm, nmh } = window.ENS_I18N;
  const API = () => window.ENS_API;

  // Types de dégâts (ordre de l'infobox du wiki : défense physique puis magique)
  const TYPES = [
    ["Cutting", t("Tranchant"), "sword", ""], ["Piercing", t("Perforant"), "bow", ""], ["Blunt", t("Contondant"), "hammer", ""], ["Poison", t("Poison"), "drop", "el-poison"],
    ["Fire", t("Feu"), "flame", "el-feu"], ["Ice", t("Glace"), "snow", "el-glace"], ["Shock", t("Foudre"), "bolt", "el-foudre"], ["Shroud", t("Voile"), "skull", "el-voile"]
  ];
  const TYPE = Object.fromEntries(TYPES.map(([k, l, ic, el]) => [k, { l, ic, el }]));
  // Termes de l'infobox du wiki. « Effective » / « Resisted » : définis par la page Combat Mechanics (multiplicateur > 1 / < 1).
  const VAL = {
    Effective: { l: t("Efficace"), cls: "bv-eff", rang: 2, desc: t("Le jeu affiche « Effective » : la créature subit plus de dégâts de ce type (multiplicateur supérieur à 1).") },
    Weak: { l: t("« Weak »"), cls: "bv-weak", rang: 0, desc: t("Terme du wiki sans définition publiée (utilisé seulement pour le feu sur les bébés animaux) : ni compté comme vulnérabilité, ni comme résistance.") },
    Neutral: { l: t("Neutre"), cls: "bv-neu", rang: 1, desc: t("Dégâts normaux (multiplicateur égal à 1).") },
    Resisted: { l: t("Résisté"), cls: "bv-res", rang: -1, desc: t("Le jeu affiche « Resisted » : la créature subit moins de dégâts de ce type (multiplicateur inférieur à 1).") },
    Immune: { l: t("Immunisé"), cls: "bv-imm", rang: -2, desc: t("Aucun dégât de ce type.") }
  };
  const CATS = { hostile: [t("Hostile"), "skull"], passive: [t("Passive"), "leaf"], neutre: [t("Neutre"), "help"] };
  const COMPORTEMENT = { Hostile: t("Hostile"), Fleeting: t("Fuyant"), Peaceful: t("Paisible"), Neutral: t("Neutre") };
  const FACTIONS = { Fell: t("Déchus (Fell)"), Hollow: t("Creux"), Scavenger: t("Pillards"), Vukah: t("Vukah"), Drak: t("Drak"), Wildlife: t("Faune"), Ancients: t("Automates des Anciens"), Cyclops: t("Cyclopes") };
  const TITRES_COMBAT = { Behavior: t("Comportement"), Behaviour: t("Comportement"), Attacks: t("Attaques"), Abilities: t("Capacités"), Tips: t("Conseils"), Strategy: t("Stratégie"), Strategies: t("Stratégie"), Combat: t("Combat"), Overview: t("Aperçu") };
  // Atouts d'armes qui ajoutent un type de dégâts (wiki Weapons/Perks : +10 % des dégâts de base chacun)
  const ATOUT = { Cutting: "Cutting Damage", Piercing: "Piercing Damage", Blunt: "Blunt Damage", Poison: "Poison Damage", Fire: "Magic Fire Damage", Ice: "Magic Ice Damage", Shock: "Magic Shock Damage", Shroud: "Magic Shroud Damage" };

  const DEFAUT = { q: "", cat: "", faction: "", vuln: "", res: "", type: "", region: "", st: "", tri: "nom" };
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? { ...d, ...JSON.parse(v) } : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* rien */ } } };
  let F = store.get("ens.bestiaire1", { ...DEFAUT });
  let panneauOuvert = false;

  const B = () => window.ENS.bestiaire || { meta: {}, creatures: [] };
  const NOTES = () => window.ENS.bestiaireNotes || { familles: {}, pindrop: {}, creatures: {} };
  const parId = () => Object.fromEntries(B().creatures.map((c) => [c.id, c]));

  // ── Recoupement des sources pour un type de dégâts
  // wiki : terme de l'infobox (page à jour) ; mesure : multiplicateur des joueurs (avant 1.0) ; pindrop : % de dégâts subis (boss)
  function analyse(c, ty) {
    const wiki = c.degats?.[ty] || null, mesure = c.mesures?.[ty], pd = NOTES().pindrop?.[c.nom]?.[ty];
    const sens = (v) => v == null ? null : typeof v !== "number" ? null : v === 0 ? -2 : v > 1 ? 1 : v < 1 ? -1 : 0;
    const sW = wiki ? { Effective: 1, Neutral: 0, Resisted: -1, Immune: -2 }[wiki] ?? null : null;
    const sM = sens(mesure), sP = pd != null ? sens(pd / 100) : null;
    const desaccords = [];
    if (sW != null && sM != null && sW !== sM) desaccords.push("mesure");
    if (sW != null && sP != null && sW !== sP) desaccords.push("pindrop");
    if (sM != null && sP != null && sM !== sP) desaccords.push("mesure-pindrop");
    return { wiki, mesure, pd, desaccords };
  }
  const nbDesaccords = (c) => TYPES.reduce((n, [ty]) => n + (analyse(c, ty).desaccords.length ? 1 : 0), 0);
  const vulns = (c) => TYPES.filter(([ty]) => c.degats?.[ty] === "Effective").map(([ty]) => ty)
    .sort((a, b) => force(c, b) - force(c, a));
  const resists = (c) => TYPES.filter(([ty]) => ["Resisted", "Immune"].includes(c.degats?.[ty])).map(([ty]) => ty);
  // Ordre d'efficacité : mesure chiffrée si elle existe (même sens que le wiki), sinon pourcentage PinDrop, sinon égalité
  function force(c, ty) {
    const a = analyse(c, ty);
    if (typeof a.mesure === "number" && !a.desaccords.includes("mesure")) return a.mesure;
    if (a.pd != null && !a.desaccords.includes("pindrop")) return a.pd / 100;
    return 1.0001;
  }
  const rangType = (c, ty) => { const v = c.degats?.[ty]; return v ? VAL[v].rang * 10 + (v === "Effective" ? force(c, ty) : 0) : -99; };

  // ── Affichage
  const esc = (s) => API().esc(s);
  const icon = (n, cls) => API().icon(n, cls);
  const catLabel = (c) => c.boss ? t("Boss") : CATS[c.categorie]?.[0] || t("Non classée");
  const factionLabel = (f) => f ? FACTIONS[f] || f : t("Faction non indiquée");
  const imgSrc = (c) => window.ENS.imagesCreatures?.[c.id]?.fichier || c.imageWiki || null;
  function portrait(c, size = "") {
    const src = imgSrc(c), ic = c.boss ? "trophy" : CATS[c.categorie]?.[1] || "help";
    return `<span class="bt-img ${size}">${icon(ic)}${src ? `<img src="${esc(src)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="this.parentNode.classList.add('loaded')" onerror="this.remove()">` : ""}</span>`;
  }
  const badge = (ty, v, extra = "") => `<span class="bt-dmg ${VAL[v]?.cls || "bv-nd"} ${TYPE[ty].el}" title="${esc(`${TYPE[ty].l} : ${v ? VAL[v].l : t("non renseigné")}`)}">${icon(TYPE[ty].ic)}${extra}</span>`;
  const barre = (c) => `<span class="bt-bar" role="img" aria-label="${esc(t("Résistances : {0}", TYPES.map(([ty]) => `${TYPE[ty].l} ${c.degats?.[ty] ? VAL[c.degats[ty]].l : "?"}`).join(", ")))}">${TYPES.map(([ty]) => badge(ty, c.degats?.[ty])).join("")}</span>`;
  const statutPill = (c) => c.statut === "w10"
    ? `<span class="spill s-teal" title="${esc(t("Page du wiki modifiée depuis la sortie de la 1.0 : probablement à jour, sans garantie."))}">${icon("refresh")}${t("Wiki après 1.0")}</span>`
    : `<span class="spill s-warn" title="${esc(t("Page du wiki non modifiée depuis la 1.0 : les valeurs ont peut-être changé."))}">${icon("clock")}${t("Ancienne version")}</span>`;

  function filtrer() {
    const q = API().norm(F.q).trim();
    const out = B().creatures.filter((c) => {
      if (F.cat === "boss" ? !c.boss : F.cat && c.categorie !== F.cat) return false;
      if (F.faction && (c.faction || "") !== F.faction) return false;
      if (F.vuln && c.degats?.[F.vuln] !== "Effective") return false;
      if (F.res && !["Resisted", "Immune"].includes(c.degats?.[F.res])) return false;
      if (F.region && !(c.regions || []).includes(F.region)) return false;
      if (F.st && c.statut !== F.st) return false;
      if (q) { const hay = API().norm([c.nom, nm(c.nom), c.faction, factionLabel(c.faction), ...(c.regions || []), ...(c.regions || []).map(nm)].join(" ")); if (!q.split(/\s+/).every((w) => hay.includes(w))) return false; }
      return true;
    });
    const nom = (c) => nm(c.nom);
    const cmp = {
      nom: (a, b) => nom(a).localeCompare(nom(b)),
      faction: (a, b) => factionLabel(a.faction).localeCompare(factionLabel(b.faction)) || nom(a).localeCompare(nom(b)),
      vulns: (a, b) => vulns(b).length - vulns(a).length || nom(a).localeCompare(nom(b)),
      boss: (a, b) => (b.boss ? 1 : 0) - (a.boss ? 1 : 0) || nom(a).localeCompare(nom(b)),
      type: (a, b) => rangType(b, F.type) - rangType(a, F.type) || nom(a).localeCompare(nom(b))
    }[F.tri === "type" && !F.type ? "nom" : F.tri] || ((a, b) => nom(a).localeCompare(nom(b)));
    return out.sort(cmp);
  }

  function vue(h) {
    const { app } = API();
    const meta = B().meta, all = B().creatures;
    if (!all.length) { app.innerHTML = `<h1>${t("Bestiaire")}</h1><div class="empty">${icon("alert")}<p>${t("Données du bestiaire absentes : lancez node scripts/build-bestiaire.mjs.")}</p></div>`; return; }
    const factions = [...new Set(all.map((c) => c.faction).filter(Boolean))].sort((a, b) => factionLabel(a).localeCompare(factionLabel(b)));
    const regions = [...new Set(all.flatMap((c) => c.regions || []))].sort((a, b) => nm(a).localeCompare(nm(b)));
    const n = (fn) => all.filter(fn).length;
    const avance = ["faction", "vuln", "res", "type", "region", "st"].filter((k) => F[k]).length;
    const opt = (v, l) => `<option value="${esc(v)}">${esc(l)}</option>`;
    const typeOpts = TYPES.map(([k, l]) => opt(k, l)).join("");
    app.innerHTML = `
      <h1>${t("Bestiaire")}</h1>
      <p class="lead">${t("{0} créatures relevées sur le wiki officiel le {1}, avec leurs résistances par type de dégâts, leur butin et leurs particularités. Version du jeu suivie par le site : {2}.", all.length, API().fmtDate(meta.collecte), esc(window.ENS.meta.versionJeu))}</p>
      <div class="bt-note">${icon("info")}<div>${t("Liste non exhaustive : elle reprend les pages de créatures du wiki, dont {0} ont été modifiées depuis la sortie de la 1.0. Les résistances sont les termes affichés par le jeu et relevés par le wiki (« Efficace » = la créature subit plus de dégâts de ce type). Quand une autre source n'est pas d'accord, la fiche le signale.", n((c) => c.statut === "w10"))}
        <button class="rf-link" type="button" data-bt-aide>${t("Comment lire le bestiaire ?")}</button></div></div>
      <div class="chips scroll" role="group" aria-label="${t("Catégorie")}">
        <button class="chip" data-btcat="" aria-pressed="${!F.cat}">${icon("grid")}${t("Toutes")} <span class="count">${all.length}</span></button>
        <button class="chip" data-btcat="hostile" aria-pressed="${F.cat === "hostile"}">${icon("skull")}${t("Hostiles")} <span class="count">${n((c) => c.categorie === "hostile")}</span></button>
        <button class="chip" data-btcat="passive" aria-pressed="${F.cat === "passive"}">${icon("leaf")}${t("Passives")} <span class="count">${n((c) => c.categorie === "passive")}</span></button>
        ${n((c) => c.categorie === "neutre") ? `<button class="chip" data-btcat="neutre" aria-pressed="${F.cat === "neutre"}">${icon("help")}${t("Neutres")} <span class="count">${n((c) => c.categorie === "neutre")}</span></button>` : ""}
        <button class="chip" data-btcat="boss" aria-pressed="${F.cat === "boss"}">${icon("trophy")}${t("Boss")} <span class="count">${n((c) => c.boss)}</span></button>
      </div>
      <div class="bar">
        <div class="searchbox">${icon("search")}<input id="bt-q" type="search" value="${esc(F.q)}" placeholder="${t("Nom de créature, faction ou région…")}" aria-label="${t("Rechercher une créature")}"></div>
        <button class="btn" id="bt-toggle" aria-expanded="${panneauOuvert}" aria-controls="bt-panel">${icon("sliders")}${t("Filtres")}${avance ? ` <span class="count">${avance}</span>` : ""}</button>
      </div>
      <div class="panel" id="bt-panel" ${panneauOuvert ? "" : "hidden"}>
        <label class="field">${t("Vulnérable à")}<select name="vuln">${opt("", t("Peu importe"))}${typeOpts}</select></label>
        <label class="field">${t("Résiste à (ou immunisée)")}<select name="res">${opt("", t("Peu importe"))}${typeOpts}</select></label>
        <label class="field">${t("Comparer un type de dégâts")}<select name="type">${opt("", t("Aucun"))}${typeOpts}</select></label>
        <label class="field">${t("Faction")}<select name="faction">${opt("", t("Toutes"))}${factions.map((f) => opt(f, factionLabel(f))).join("")}</select></label>
        <label class="field">${t("Région")}<select name="region">${opt("", t("Toutes"))}${regions.map((r) => opt(r, nm(r))).join("")}</select></label>
        <label class="field">${t("Fiabilité")}<select name="st">${opt("", t("Toutes"))}${opt("w10", t("Wiki après 1.0"))}${opt("pre", t("Ancienne version"))}</select></label>
        <label class="field">${t("Trier par")}<select name="tri">${opt("nom", t("Nom"))}${opt("faction", t("Faction"))}${opt("vulns", t("Nombre de vulnérabilités"))}${opt("boss", t("Boss d'abord"))}${opt("type", t("Efficacité du type comparé"))}</select></label>
        <div class="field wide" style="flex-direction:row;justify-content:flex-end"><button class="btn small" id="bt-reset">${icon("refresh")}${t("Tout réinitialiser")}</button></div>
      </div>
      <div class="result-line"><span id="bt-count"></span><span id="bt-legende" class="bt-legende">${["Effective", "Neutral", "Resisted", "Immune"].map((v) => `<span><i class="bt-sw ${VAL[v].cls}"></i>${VAL[v].l}</span>`).join("")}<span><i class="bt-sw bv-nd"></i>${t("Non renseigné")}</span></span></div>
      <div id="bt-list" class="bt-grid"></div>
      <details class="more"><summary>${icon("book")}${t("Sources du bestiaire")}</summary><div>${sourcesBloc()}</div></details>`;
    const panel = API().$("#bt-panel");
    for (const k of ["vuln", "res", "type", "faction", "region", "st", "tri"]) panel.querySelector(`[name="${k}"]`).value = F[k];
    const save = () => store.set("ens.bestiaire1", F);
    panel.addEventListener("input", (e) => {
      const el = e.target; if (!el.name) return;
      F[el.name] = el.value;
      if (el.name === "type" && el.value && F.tri !== "type") { F.tri = "type"; panel.querySelector('[name="tri"]').value = "type"; }
      save(); liste();
    });
    API().$("#bt-q").addEventListener("input", (e) => { F.q = e.target.value; save(); liste(); });
    API().$("#bt-toggle").addEventListener("click", (e) => { panneauOuvert = !panneauOuvert; panel.hidden = !panneauOuvert; e.currentTarget.setAttribute("aria-expanded", panneauOuvert); });
    API().$("#bt-reset").addEventListener("click", () => { F = { ...DEFAUT }; save(); vue("bestiaire"); });
    liste();
    const id = (h || "").split("/")[1];
    if (id && parId()[id]) fiche(id);
  }

  function carte(c) {
    const v = vulns(c), comp = F.type ? c.degats?.[F.type] : null;
    return `<article class="bt-card${c.boss ? " boss" : ""}">
      <button class="bt-main" data-creature="${esc(c.id)}">${portrait(c)}
        <span class="bt-txt"><span class="bt-name">${nmh(c.nom)}</span>
          <span class="bt-sub">${esc(factionLabel(c.faction))} · ${esc(catLabel(c))}</span>
          ${F.type ? `<span class="bt-cmp">${badge(F.type, comp)}<b>${esc(TYPE[F.type].l)} :</b> ${comp ? esc(VAL[comp].l) : t("non renseigné")}${typeof c.mesures?.[F.type] === "number" ? ` <span class="muted">×${String(c.mesures[F.type]).replace(".", ",")}</span>` : ""}</span>`
            : `<span class="bt-vul">${v.length ? `${t("Vulnérable :")} ${v.map((ty) => `<b class="${TYPE[ty].el}">${esc(TYPE[ty].l)}</b>`).join(", ")}` : Object.keys(c.degats || {}).length ? t("Aucune vulnérabilité relevée") : t("Résistances non renseignées")}</span>`}
        </span></button>
      ${barre(c)}
      ${c.statut === "pre" ? `<span class="sdot s-warn" title="${esc(t("Page du wiki non modifiée depuis la 1.0"))}"></span>` : ""}
      ${nbDesaccords(c) ? `<span class="bt-flag" title="${esc(t("Sources en désaccord sur au moins un type de dégâts"))}">${icon("alert")}</span>` : ""}
    </article>`;
  }
  function liste() {
    const l = filtrer();
    API().$("#bt-count").textContent = tp(l.length, "{0} créature", "{0} créatures");
    API().$("#bt-list").innerHTML = l.map(carte).join("") || `<div class="empty" style="grid-column:1/-1">${icon("search")}<p>${t("Aucune créature ne correspond.")}</p></div>`;
  }

  // ── Suggestions d'armes et de sorts (calculées à partir du catalogue, voir aide)
  function moyens(ty) {
    const { D } = API();
    const sorts = D.items.filter((it) => it.categorie === "sort" && it.typeDegats === ty).sort((a, b) => (b.niveau || 0) - (a.niveau || 0));
    const nAtout = (it) => (it.atouts || []).reduce((n, a) => { const m = a.match(/^(.*?)(?: ×(\d+))?$/); return n + (m[1] === ATOUT[ty] ? Number(m[2] || 1) : 0); }, 0);
    const armes = D.items.filter((it) => it.categorie === "arme" && nAtout(it) > 0).sort((a, b) => nAtout(b) - nAtout(a) || (b.niveau || 0) - (a.niveau || 0));
    return { sorts, armes, nAtout };
  }
  function suggestions(c) {
    const v = vulns(c), r = resists(c);
    if (!Object.keys(c.degats || {}).length) return `<p class="muted">${t("Le wiki ne publie pas les résistances de cette créature : aucune suggestion possible sans inventer.")}</p>`;
    const chip = (it, extra = "") => `<button class="chip small" data-item="${esc(it.id)}">${nmh(it.nom)}${extra}</button>`;
    return `${v.length ? v.map((ty) => {
      const { sorts, armes, nAtout } = moyens(ty), a = analyse(c, ty);
      return `<div class="bt-sug"><h4>${badge(ty, "Effective")} ${esc(TYPE[ty].l)}${typeof a.mesure === "number" && !a.desaccords.includes("mesure") ? ` <span class="muted small">×${String(a.mesure).replace(".", ",")} ${t("(mesure d'avant la 1.0)")}</span>` : ""}${a.pd != null ? ` <span class="muted small">${t("PinDrop : {0} %", a.pd)}</span>` : ""}${a.desaccords.length ? ` <span class="bt-alerte">${icon("alert")}${t("sources en désaccord")}</span>` : ""}</h4>
        ${sorts.length ? `<p class="small"><b>${t("Sorts")}</b> (${sorts.length})</p><div class="chips">${sorts.slice(0, 4).map((s) => chip(s)).join("")}</div>` : ""}
        ${armes.length ? `<p class="small"><b>${t("Armes avec un atout de ce type")}</b> (${armes.length})</p><div class="chips">${armes.slice(0, 5).map((w) => chip(w, nAtout(w) > 1 ? ` ×${nAtout(w)}` : "")).join("")}</div>` : ""}
        ${!sorts.length && !armes.length ? `<p class="small muted">${t("Aucun sort ni atout de ce type dans le catalogue du site.")}</p>` : ""}
      </div>`;
    }).join("") : `<p>${t("Aucun type de dégâts n'est indiqué « Efficace » par le wiki pour cette créature.")}</p>`}
    ${r.length ? `<p class="bt-eviter">${icon("alert")}<span><b>${t("À éviter :")}</b> ${r.map((ty) => `${esc(TYPE[ty].l)} (${esc(VAL[c.degats[ty]].l.toLowerCase())})`).join(", ")}</span></p>` : ""}
    <p class="small muted">${t("Suggestions calculées par le site, pas des conseils de guide : sorts dont le wiki indique ce type de dégâts, et armes dont un atout ajoute ce type (+10 % des dégâts de base par atout, selon le wiki). Les dégâts de base d'une arme peuvent mêler plusieurs types : en jeu, l'indication « Effective » ou « Resisted » sous les dégâts infligés confirme le bon choix.")}</p>`;
  }

  function tableDegats(c) {
    const aMes = c.mesures && Object.keys(c.mesures).length, aPd = NOTES().pindrop?.[c.nom];
    const fmtM = (m) => m == null ? "—" : m === 0 ? t("immunisée") : typeof m === "number" ? "×" + String(m).replace(".", ",") : esc(String(m).replace(/\./g, ","));
    return `<div class="table-wrap"><table class="bt-table"><thead><tr><th>${t("Type")}</th><th>${t("Wiki (infobox)")}</th>${aMes ? `<th>${t("Mesure des joueurs")}<br><span class="muted small">${t("avant la 1.0")}</span></th>` : ""}${aPd ? `<th>PinDrop</th>` : ""}</tr></thead><tbody>
      ${TYPES.map(([ty]) => { const a = analyse(c, ty); return `<tr class="${a.desaccords.length ? "bt-conflit" : ""}"><th scope="row">${badge(ty, a.wiki)} ${esc(TYPE[ty].l)}</th>
        <td>${a.wiki ? `<span class="bt-val ${VAL[a.wiki].cls}" title="${esc(VAL[a.wiki].desc)}">${esc(VAL[a.wiki].l)}</span>` : `<span class="muted">${t("non renseigné")}</span>`}${c.variantes?.[ty] ? `<br><span class="small muted">${t("selon la variante : {0}", c.variantes[ty].map((v) => VAL[v]?.l || v).join(t(" ou ")))}</span>` : ""}${a.desaccords.length ? ` <span class="bt-alerte" title="${esc(t("Les sources ne vont pas dans le même sens pour ce type."))}">${icon("alert")}${t("désaccord")}</span>` : ""}</td>
        ${aMes ? `<td>${fmtM(a.mesure)}</td>` : ""}${aPd ? `<td>${a.pd != null ? a.pd + " %" : `<span class="muted">—</span>`}</td>` : ""}</tr>`; }).join("")}
      </tbody></table></div>
      ${TYPES.some(([ty]) => analyse(c, ty).desaccords.length) ? `<div class="warnbox">${icon("alert")}<div><b>${t("Sources en désaccord")}</b> — ${t("la page du wiki (plus récente) et les mesures ou pourcentages d'une autre source ne vont pas dans le même sens pour au moins un type. Le site affiche l'infobox du wiki comme valeur principale ; vérifiez en jeu l'indication « Effective » ou « Resisted ».")}</div></div>` : ""}`;
  }

  function fiche(id) {
    const c = parId()[id]; if (!c) return;
    const { D, openDialog, fmtDate, txt } = API();
    const nt = NOTES(), famille = nt.familles?.[c.faction], notes = nt.creatures?.[c.nom] || [];
    const src = (ids) => (ids || []).map((s) => { const so = D.sources.find((x) => x.id === s); return so ? `<a href="${esc(so.url)}" target="_blank" rel="noopener">${esc(tr(so.nom))}</a>` : esc(s); }).join(" · ");
    // Texte du wiki : traduit (non officiel) en français quand une traduction existe, sinon en anglais (signalé)
    const texteWiki = (s) => { const f = tr(s); return `${I18N_txt(f)}${window.ENS_I18N.lang === "fr" ? ` <span class="small muted">(${f !== s ? t("traduction non officielle") : t("texte du wiki en anglais")})</span>` : ""}`; };
    const I18N_txt = (s) => window.ENS_I18N.nomsDansTexte(esc(s)).replace(/\n/g, "<br>");
    const butin = (c.butin || []).filter((b) => !b.lieu), uniques = (c.butin || []).filter((b) => b.lieu);
    const cond = (b) => b.condition === "variantes" ? t("certaines variantes") : b.condition === "conditionnel" ? t("sous condition") : "";
    openDialog(`<div class="bt-fiche">
      <div class="dhead">${portrait(c, "xl")}<div><h2>${nmh(c.nom)}</h2>
        ${window.ENS_I18N.lang === "fr" && nm(c.nom) !== c.nom ? `<p class="small muted nom-en">${esc(c.nom)}</p>` : ""}
        <p>${esc(factionLabel(c.faction))} · ${esc(catLabel(c))}${c.comportement ? ` · ${t("comportement « {0} »", esc(COMPORTEMENT[c.comportement] || c.comportement))}` : ""}</p></div></div>
      <div class="chips">${statutPill(c)}${c.boss ? `<span class="spill s-bad">${icon("trophy")}${t("Boss ou mini-boss")}</span>` : ""}${c.apprivoisable ? `<span class="spill s-ok">${icon("heart")}${t("Apprivoisable")}${c.coeurs ? " · " + tp(Number(c.coeurs) || 0, "{0} cœur", "{0} cœurs") : ""}</span>` : ""}</div>
      ${c.description ? `<p class="desc">${texteWiki(c.description)}</p>` : ""}
      ${(c.regions || []).length ? `<div class="drow">${icon("map")}<div><b>${t("Régions :")}</b> ${c.regions.map(nmh).join(", ")}</div></div>` : `<div class="drow">${icon("map")}<div class="muted">${t("Régions non indiquées par le wiki.")}</div></div>`}
      <h3>${icon("target")} ${t("Vulnérabilités et résistances")}</h3>
      ${Object.keys(c.degats || {}).length < 8 ? `<p class="small muted">${Object.keys(c.degats || {}).length ? t("Infobox incomplète : {0} types sur 8 renseignés par le wiki.", Object.keys(c.degats).length) : t("Le wiki ne renseigne aucune résistance pour cette créature.")}</p>` : ""}
      ${Object.keys(c.degats || {}).length ? tableDegats(c) : ""}
      <h3>${icon("sword")} ${t("Pour la combattre")}</h3>
      ${suggestions(c)}
      ${famille || notes.length || c.combat ? `<h3>${icon("book")} ${t("Particularités de combat")}</h3>
        ${famille ? `<p>${txt(famille.texte)} <span class="small muted">${src(famille.sources)}</span></p>` : ""}
        ${notes.map((n) => `<p>${txt(n.texte)} <span class="small muted">${src(n.sources)}</span></p>`).join("")}
        ${(c.combat || []).map((s) => `<div class="bt-combat"><b>${esc(TITRES_COMBAT[s.titre] || s.titre)}</b><p>${texteWiki(s.texte)}</p></div>`).join("")}` : ""}
      <h3>${icon("layers")} ${t("Butin")}</h3>
      ${butin.length ? `<ul class="bt-butin">${butin.map((b) => `<li>${nmh(b.nom)}${b.quantite ? ` <span class="muted">× ${b.quantite === "Varies" ? t("quantité variable") : esc(b.quantite)}</span>` : ""}${cond(b) ? ` <span class="small muted">(${cond(b)})</span>` : ""}</li>`).join("")}</ul>` : `<p class="muted">${t("Butin non publié par le wiki.")}</p>`}
      ${uniques.length ? `<p class="small"><b>${t("Butin propre à un lieu :")}</b></p><ul class="bt-butin">${uniques.map((b) => `<li>${nmh(b.nom)} <span class="small muted">— ${nm(b.lieu) !== b.lieu ? nmh(b.lieu) : API().txt(b.lieu)}</span></li>`).join("")}</ul>` : ""}
      <div class="btn-row" style="margin-top:14px"><a class="btn" href="${esc(c.wiki)}" target="_blank" rel="noopener">${icon("external")}${t("Page du wiki")}</a>
        <button class="btn" type="button" data-bt-share="${esc(c.id)}">${icon("link")}${t("Copier le lien")}</button></div>
      <details class="more" open><summary>${icon("book")}${t("Sources et vérification")}</summary><div>
        <p>${t("Relevé sur le wiki le {0}", fmtDate(B().meta.collecte))}${c.wikiMaj ? ` · ${t("page wiki modifiée le {0}", fmtDate(c.wikiMaj))}` : ""} · ${t("version du jeu suivie par le site : {0}", esc(D.meta.versionJeu))}</p>
        <p>${src(["wiki-bestiaire"])}${c.mesures ? " · " + src(["wiki-combat"]) + ` (${t("page du {0}", fmtDate(B().meta.mecaniques?.maj))})` : ""}${NOTES().pindrop?.[c.nom] ? " · " + src(["pd-bosses"]) : ""}${c.nomFr ? " · " + src(["wiki-fr-bestiaire"]) : ""}</p>
        <p class="muted">${imgSrc(c) ? t("Image : enshrouded.wiki.gg (© Keen Games).") : t("Pas d'image sur le wiki.")}</p></div></details></div>`);
    history.replaceState(null, "", "#bestiaire/" + c.id);
  }

  function sourcesBloc() {
    const { D, fmtDate } = API();
    return `<ul class="tight">${["wiki-bestiaire", "wiki-combat", "wiki-perks", "wiki-fr-bestiaire", "pd-bosses", "pd-enemies"].map((id) => D.sources.find((s) => s.id === id)).filter(Boolean)
      .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(tr(s.nom))}</a>${s.consulte ? ` — ${t("consulté le {0}", fmtDate(s.consulte))}` : ""}${s.miseAJourSource ? `, ${t("màj {0}", fmtDate(s.miseAJourSource))}` : ""}<br><span class="small muted">${API().txt(s.note)}</span></li>`).join("")}</ul>`;
  }

  function aide() {
    API().openDialog(`<h2>${t("Comment lire le bestiaire")}</h2>
      <p>${t("Chaque créature a huit types de dégâts. Le wiki officiel reprend l'indication que le jeu affiche sous les dégâts infligés :")}</p>
      <div class="legend-list">${Object.entries(VAL).map(([v, o]) => `<div><span class="bt-val ${o.cls}">${esc(o.l)}</span><span>${esc(o.desc)}</span></div>`).join("")}</div>
      <p>${t("L'écart exact (par exemple +30 %) varie selon la créature et le type ; le wiki ne le publie que pour une trentaine de créatures, d'après des mesures de joueurs antérieures à la 1.0. Le guide « Boss » du site reprend aussi des pourcentages PinDrop pour quelques boss.")}</p>
      <p>${t("Une icône d'alerte signale un désaccord entre ces sources : la page du wiki, plus récente, reste la valeur principale.")}</p>
      <p>${t("Les suggestions d'armes sont calculées : sorts du type de dégâts efficace, et armes dont un atout ajoute ce type. Ce ne sont ni des statistiques, ni des conseils de guide.")}</p>
      <p class="small muted">${t("Fiabilité : « Wiki après 1.0 » = page modifiée depuis la sortie de la 1.0 (probablement à jour, sans garantie) ; « Ancienne version » = page non modifiée depuis.")}</p>`);
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-creature],[data-btcat],[data-bt-aide],[data-bt-share]");
    if (!el) return;
    if (el.dataset.creature) fiche(el.dataset.creature);
    else if (el.dataset.btcat !== undefined) { F.cat = el.dataset.btcat; store.set("ens.bestiaire1", F); vue("bestiaire"); }
    else if (el.dataset.btAide !== undefined) aide();
    else if (el.dataset.btShare) { const u = location.href.split("#")[0] + "#bestiaire/" + el.dataset.btShare; navigator.clipboard?.writeText(u).then(() => API().toast(t("Lien de la fiche copié")), () => prompt(t("Copiez ce lien :"), u)); }
  });
  // Fermer la fiche : l'adresse revient à la liste (sans recharger la vue)
  // (attribut « open » surveillé : plus fiable que l'évènement « close », pas toujours émis)
  document.addEventListener("DOMContentLoaded", () => {
    const dlg = document.getElementById("dlg");
    if (dlg) new MutationObserver(() => { if (!dlg.open && location.hash.startsWith("#bestiaire/")) history.replaceState(null, "", "#bestiaire"); }).observe(dlg, { attributes: true, attributeFilter: ["open"] });
  });

  const EXT = (window.ENS_EXT = window.ENS_EXT || {});
  (EXT.vues ||= {}).bestiaire = vue;
  // Recherche globale (refonte) : créatures
  window.ENS_BESTIAIRE = { creatures: () => B().creatures, fiche, faction: factionLabel };
})();
