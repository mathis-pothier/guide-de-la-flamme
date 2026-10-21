/* Guide de la Flamme — refonte (aperçu). Chargé avant app.js : déclare window.ENS_EXT (vue d'accueil, recherche globale,
   navigation mobile). Toutes les autres vues viennent d'app.js, partagé avec le site actuel. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const API = () => window.ENS_API;
  const TITRES = { accueil: "Accueil", guides: "Guides", builds: "Builds", build: "Build", planner: "Mon build", equipements: "Équipements", competences: "Compétences",
    construction: "Construction", carte: "Carte", comparateur: "Comparateur", maj: "Mises à jour et sources" };
  // Personnage affiché selon la famille du build (rendus de sets du wiki, © Keen Games)
  const FIGURE = { "c-war": "guerrier", "c-rng": "rodeur", "c-mag": "mage", "c-hyb": "hybride", "c-base": "base" };
  const fig = (k, cls = "") => `<img class="${cls}" src="refonte/img/heros-${k}.webp" alt="" loading="lazy" decoding="async">`;

  // ════════════ ACCUEIL ════════════
  function vueAccueil() {
    const { app, D, icon, esc, buildCard, gcard, G, CONS, BUILDS } = API();
    const n = (x) => x.toLocaleString("fr-FR");
    const pins = D.items.filter((it) => (it.marqueurs || []).length).length;
    const guide = (id) => G.liste.find((g) => g.id === id);
    const etapes = [
      ["premieres-heures", "1", "Vos premières heures", "Sortir du tutoriel, choisir sa base, éviter les pièges du début."],
      ["builds", "2", "Trouvez votre build", "Trois questions pour choisir un style, puis l'équipement pièce par pièce."],
      ["flamme-paliers", "3", "Faites grandir la Flamme", "Les paliers 1 à 11, ce qu'ils débloquent et l'ordre des régions."]
    ];
    const rubriques = [
      ["guides", "book", "Guides", `${G.liste.length} guides en ${G.categories.length} catégories`, "c-base"],
      ["builds", "star", "Builds", `${D.builds.length} styles, équipement par étape`, "c-war"],
      ["equipements", "sword", "Équipements", `${n(D.items.length)} objets et leurs sources`, "c-rng"],
      ["carte", "map", "Carte", `${n(pins)} objets épinglés`, "c-hyb"],
      ["competences", "tree", "Compétences", `${D.skills.length} compétences, tronc commun`, "c-mag"],
      ["construction", "home", "Construction", `${CONS.blocs.length} blocs, ${CONS.batiments.length} bâtiments`, "c-base"]
    ];
    const une = ["mage-bataille", "barbare", "rodeur", "soigneur"].map((id) => BUILDS[id]).filter(Boolean);
    const essentiels = ["regions", "boss-faiblesses", "equipement-fin", "base"].map(guide).filter(Boolean);
    app.innerHTML = `
      <section class="rf-hero">
        <div class="rf-hero-txt">
          <p class="rf-kicker">${icon("flame")}Enshrouded · version ${esc(D.meta.versionJeu)}</p>
          <h1>Ravivez la Flamme,<br>repoussez le Shroud.</h1>
          <p class="rf-hero-lead">Le guide de fan en français : builds, guides pas à pas, équipement, carte et construction. Chaque information affiche sa source et sa fiabilité.</p>
          <button class="rf-hero-search" type="button" data-palette>${icon("search")}<span>Un objet, un boss, un guide…</span><kbd>/</kbd></button>
          <div class="rf-hero-stats">
            <span><b>${n(D.items.length)}</b>objets</span><span><b>${G.liste.length}</b>guides</span><span><b>${D.builds.length}</b>builds</span><span><b>${CONS.blocs.length}</b>blocs</span>
          </div>
        </div>
        <div class="rf-hero-art" aria-hidden="true">
          <span class="rf-ember"></span>${fig("guerrier", "f1")}${fig("mage", "f2")}${fig("rodeur", "f3")}
        </div>
      </section>

      <h2>${icon("compass")}Par où commencer ?</h2>
      <div class="rf-steps">${etapes.map(([id, k, t, d]) => { const g = guide(id); const href = g ? `#guides/${id}` : `#${id}`; return `
        <a class="rf-step" href="${href}"><span class="rf-step-n">${k}</span><span><b>${esc(t)}</b><small>${esc(d)}</small></span>${icon("arrow")}</a>`; }).join("")}</div>

      <h2>${icon("grid")}Explorer le guide</h2>
      <div class="rf-tiles">${rubriques.map(([h, ic, t, d, c]) => `
        <a class="rf-tile ${c}" href="#${h}"><span class="emblem">${icon(ic)}</span><span><b>${t}</b><small>${d}</small></span></a>`).join("")}</div>

      <h2>${icon("star")}Builds à la une</h2>
      <div class="grid rf-rail">${une.map(buildCard).join("")}</div>
      <p class="rf-more"><a class="btn" href="#builds">${icon("star")}Tous les builds et le questionnaire</a></p>

      <h2>${icon("book")}Guides essentiels</h2>
      <div class="bgrid">${essentiels.map(gcard).join("")}</div>
      <p class="rf-more"><a class="btn" href="#guides">${icon("book")}Les ${G.liste.length} guides</a></p>

      <section class="rf-trust">
        <span class="emblem c-mag">${icon("check")}</span>
        <div><h3>Un guide qui dit d'où il tient ses infos</h3>
          <p>Chaque objet porte une pastille de fiabilité (vérifié en 1.0, ancienne version, sources en désaccord…) et ses sources. Dernière vérification le ${new Date(D.meta.derniereActualisation + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.</p>
          <div class="btn-row"><button class="btn small" type="button" data-help>${icon("help")}Comment lire les pastilles</button><a class="btn small" href="#maj">${icon("refresh")}Versions et sources</a></div></div>
      </section>`;
  }

  // ════════════ RECHERCHE GLOBALE ════════════
  let index = null, results = [], active = 0;
  const pal = $("#palette"), palQ = $("#pal-q"), palRes = $("#pal-res");
  function buildIndex() {
    const { D, G, CONS, TAGS, norm, lvTxt } = API();
    const out = [];
    const add = (groupe, label, sub, extra, go, visuel) => out.push({ groupe, label, sub, go, visuel, n: norm(label), hay: norm([label, sub, extra].join(" ")) });
    Object.entries(TITRES).filter(([k]) => !["build", "planner"].includes(k)).forEach(([k, t]) => add("Rubriques", t, "Rubrique du guide", "", { hash: k }, { icone: "grid" }));
    G.liste.forEach((g) => add("Guides", g.titre, g.resume, g.sections.map((s) => s.titre).join(" "), { hash: "guides/" + g.id }, { icone: g.icone }));
    D.builds.forEach((b) => add("Builds", TAGS[b.id]?.court || b.nom, TAGS[b.id]?.accroche || b.role, b.nom + " " + b.style, { hash: "build/" + b.id }, { icone: "star" }));
    D.items.forEach((it) => add("Objets", it.nom, [lvTxt(it), it.rarete || it.type].filter(Boolean).join(" · "), [it.type, ...(it.atouts || []), ...(it.effets || []), it.obtention].join(" "), { item: it.id }, { item: it.id }));
    D.skills.forEach((s) => add("Compétences", s.nom, `${s.arbre} · ${s.effet}`, s.sous, { skill: s.id }, { icone: "tree" }));
    CONS.blocs.forEach((b) => add("Blocs", b.nom, b.recette, [b.lieu, b.region].join(" "), { hash: "construction/blocs" }, { icone: "block" }));
    return out;
  }
  const LIMITE = { Rubriques: 3, Guides: 5, Builds: 4, Objets: 8, "Compétences": 5, Blocs: 3 };
  function search(q) {
    const { norm } = API();
    index ||= buildIndex();
    const words = norm(q).trim().split(/\s+/).filter(Boolean);
    if (!words.length) return index.filter((x) => x.groupe === "Rubriques" || ["premieres-heures", "boss-faiblesses", "regions"].some((id) => x.go.hash === "guides/" + id));
    const nq = words.join(" ");
    const scored = index.filter((x) => words.every((w) => x.hay.includes(w))).map((x) => ({ x, s: (x.n === nq ? 100 : x.n.startsWith(nq) ? 60 : x.n.includes(nq) ? 40 : words.every((w) => x.n.includes(w)) ? 25 : 0) - x.n.length / 100 }));
    scored.sort((a, b) => b.s - a.s);
    const count = {};
    return scored.filter(({ x }) => (count[x.groupe] = (count[x.groupe] || 0) + 1) <= LIMITE[x.groupe]).map(({ x }) => x)
      .sort((a, b) => Object.keys(LIMITE).indexOf(a.groupe) - Object.keys(LIMITE).indexOf(b.groupe));
  }
  function renderResults() {
    const { esc, icon, art, getItem } = API();
    results = search(palQ.value);
    active = Math.min(active, Math.max(0, results.length - 1));
    let last = "";
    palRes.innerHTML = results.map((r, i) => {
      const q = palQ.value.trim();
      const head = (q ? r.groupe !== last : i === 0) ? `<div class="rf-pal-group" role="presentation">${esc(q ? r.groupe : "Suggestions")}</div>` : "";
      last = r.groupe;
      const vis = r.visuel.item ? art(getItem(r.visuel.item), "xs") : `<span class="rf-pal-ic">${icon(r.visuel.icone)}</span>`;
      return `${head}<div class="rf-pal-row" role="option" id="pal-${i}" data-pal="${i}" aria-selected="${i === active}">${vis}<span><b>${esc(r.label)}</b><small>${esc(r.sub || "")}</small></span><span class="rf-pal-kind">${esc(r.groupe.replace(/s$/, ""))}</span></div>`;
    }).join("") || `<p class="rf-pal-empty">Rien trouvé pour « ${esc(palQ.value)} ». Essayez le nom anglais d'un objet ou un mot plus court.</p>`;
    palQ.setAttribute("aria-activedescendant", results.length ? "pal-" + active : "");
  }
  function openPalette(q = "") {
    if (!API()) return;
    if (pal.open) return;
    palQ.value = q; active = 0;
    pal.showModal ? pal.showModal() : pal.setAttribute("open", "");
    renderResults(); palQ.focus();
  }
  function choose(i) {
    const r = results[i]; if (!r) return;
    pal.close();
    const { itemDetail, skillDetail } = API();
    if (r.go.item) itemDetail(r.go.item);
    else if (r.go.skill) skillDetail(r.go.skill);
    else if (location.hash === "#" + r.go.hash) window.scrollTo(0, 0);
    else location.hash = r.go.hash;
  }
  palQ.addEventListener("input", () => { active = 0; renderResults(); });
  palQ.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      active = (active + (e.key === "ArrowDown" ? 1 : -1) + results.length) % Math.max(1, results.length);
      $$("[data-pal]", palRes).forEach((el) => el.setAttribute("aria-selected", Number(el.dataset.pal) === active));
      palQ.setAttribute("aria-activedescendant", "pal-" + active);
      $("#pal-" + active)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") { e.preventDefault(); choose(active); }
    else if (e.key === "Escape") { e.preventDefault(); pal.close(); }
  });
  palRes.addEventListener("click", (e) => { const row = e.target.closest("[data-pal]"); if (row) choose(Number(row.dataset.pal)); });
  pal.addEventListener("click", (e) => { if (e.target === pal || e.target.closest("[data-pal-close]")) pal.close(); });

  // ════════════ NAVIGATION MOBILE (« Plus ») ════════════
  const sheet = $("#rf-sheet"), more = $("#rf-more");
  const setSheet = (open) => { sheet.hidden = !open; more.setAttribute("aria-expanded", open); document.body.classList.toggle("rf-sheet-open", open); };
  more.addEventListener("click", () => setSheet(sheet.hidden));
  sheet.addEventListener("click", (e) => { if (e.target === sheet) setSheet(false); });

  document.addEventListener("click", (e) => { if (e.target.closest("[data-palette]")) { e.preventDefault(); openPalette(); } });
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openPalette(); }
    else if (e.key === "/" && !typing && !$("#dlg").open) { e.preventDefault(); openPalette(); }
    else if (e.key === "Escape" && !sheet.hidden) setSheet(false);
  });

  // ════════════ APRÈS CHAQUE NAVIGATION ════════════
  const bar = document.createElement("div");
  bar.className = "rf-progress"; bar.setAttribute("aria-hidden", "true");
  document.body.append(bar);
  const progress = () => {
    if (!document.body.classList.contains("rf-lecture")) return;
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
  };
  addEventListener("scroll", progress, { passive: true });
  let premier = true;
  function apres(view, h) {
    setSheet(false);
    if (pal.open) pal.close();
    document.body.className = document.body.className.replace(/\brf-v-\S+/g, "").trim() + " rf-v-" + view;
    const lecture = view === "guides" && h.includes("/");
    document.body.classList.toggle("rf-lecture", lecture);
    bar.style.transform = "scaleX(0)";
    $$("a[data-view]").forEach((a) => a.classList.contains("active") ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    const titre = $("#app h1")?.textContent.trim();
    document.title = `${view === "accueil" ? "" : (titre || TITRES[view] || "") + " · "}Guide de la Flamme`;
    // Fiche de build : silhouette du personnage dans le bandeau
    const hero = $("#app .hero");
    if (hero) {
      const k = FIGURE[[...hero.classList].find((c) => FIGURE[c])] || "base";
      hero.insertAdjacentHTML("beforeend", fig(k, "rf-hero-fig"));
    }
    if (!premier) $("#app").focus({ preventScroll: true });
    premier = false;
  }

  window.ENS_EXT = { accueil: "accueil", vues: { accueil: vueAccueil }, apres };
})();
