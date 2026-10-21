/* Administration de la carte : lecture et écriture de data/map-points.json via l'API GitHub.
   Sécurité : l'écriture est autorisée par GitHub (le jeton doit appartenir à un compte ayant le droit d'écriture sur le dépôt).
   Le site ne contient aucun secret : chaque administrateur saisit son propre jeton, gardé dans son navigateur
   (sessionStorage par défaut, localStorage s'il coche « Rester connecté sur cet appareil »). */
window.ENS_ADMIN = (() => {
  "use strict";
  const C = window.ENS.mapConfig.stockage;
  const KEY = "ens.ghToken";
  // Serveur de test local (scripts/mock-github.mjs) : uniquement quand le site tourne sur la machine du développeur.
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const apiBase = () => { try { return (isLocal && localStorage.getItem("ens.devApi")) || "https://api.github.com"; } catch { return "https://api.github.com"; } };
  const store = {
    get() { try { return sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || ""; } catch { return ""; } },
    set(t, remember) { try { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); (remember ? localStorage : sessionStorage).setItem(KEY, t); } catch { /* stockage indisponible : jeton gardé en mémoire */ } },
    clear() { try { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); } catch { /* rien */ } }
  };
  let token = store.get();
  let session = null; // { login, name, avatar }

  const b64encode = (s) => btoa(unescape(encodeURIComponent(s)));
  const b64decode = (s) => decodeURIComponent(escape(atob(String(s).replace(/\s/g, ""))));

  async function gh(path, opts = {}) {
    let r;
    try {
      r = await fetch(apiBase() + path, {
        ...opts,
        cache: "no-store",
        headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(token ? { Authorization: "Bearer " + token } : {}), ...(opts.body ? { "Content-Type": "application/json" } : {}) }
      });
    } catch { throw new Error("GitHub est injoignable (connexion réseau ?)."); }
    const data = r.status === 204 ? null : await r.json().catch(() => null);
    if (!r.ok) {
      const msg = r.status === 401 ? "Jeton refusé par GitHub (invalide ou expiré)."
        : r.status === 403 ? "GitHub refuse l'opération : ce jeton n'a pas le droit d'écriture sur le dépôt (ou la limite de requêtes est atteinte)."
        : r.status === 404 ? "Dépôt ou fichier introuvable pour ce jeton (droits insuffisants ?)."
        : r.status === 409 || r.status === 422 ? "conflit" : `Erreur GitHub ${r.status}${data?.message ? " : " + data.message : ""}.`;
      const err = new Error(msg); err.status = r.status; throw err;
    }
    return data;
  }

  // Vérifie le jeton : identité du compte + droit d'écriture sur le dépôt (contrôle aussi refait par GitHub à chaque écriture).
  async function connect(t, remember) {
    const prev = token;
    token = String(t || "").trim();
    try {
      if (!/^[A-Za-z0-9_]{20,255}$/.test(token)) throw new Error("Format de jeton inattendu.");
      const user = await gh("/user");
      const repo = await gh(`/repos/${C.depot}`);
      if (!repo?.permissions?.push) throw new Error(`Le compte « ${user.login} » n'a pas le droit d'écriture sur ${C.depot} : il n'est pas administrateur de la carte.`);
      session = { login: user.login, name: user.name || user.login, avatar: user.avatar_url };
      store.set(token, remember);
      return session;
    } catch (e) { token = prev; throw e; }
  }
  async function restore() {
    if (!token) return null;
    try {
      const user = await gh("/user");
      const repo = await gh(`/repos/${C.depot}`);
      if (!repo?.permissions?.push) { logout(); return null; }
      session = { login: user.login, name: user.name || user.login, avatar: user.avatar_url };
      return session;
    } catch (e) { if (e.status === 401) logout(); return null; }
  }
  function logout() { token = ""; session = null; store.clear(); }

  // Lecture publique (fichier publié par GitHub Pages) — pas besoin d'être connecté.
  async function loadPublic() {
    const r = await fetch(`${C.fichier}?t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`Fichier des points introuvable (${r.status}).`);
    return r.json();
  }
  // Lecture de la dernière version dans le dépôt (pour les administrateurs : sans attendre la publication du site).
  async function loadRemote() {
    const f = await gh(`/repos/${C.depot}/contents/${C.fichier}?ref=${encodeURIComponent(C.branche)}`);
    return { data: JSON.parse(b64decode(f.content)), sha: f.sha };
  }

  // Applique une modification et l'enregistre par un commit ; réessaie si quelqu'un a modifié le fichier entre-temps.
  async function save(mutate, message) {
    if (!session) throw new Error("Connectez-vous d'abord en administrateur.");
    for (let i = 0; i < 3; i++) {
      const { data, sha } = await loadRemote();
      if (!Array.isArray(data.points)) data.points = [];
      mutate(data);
      for (const p of data.points) {
        const errs = window.ENS.validateMapPoint(p);
        if (errs.length) throw new Error(`Point « ${p.nom || p.id} » invalide : ${errs.join(", ")}.`);
      }
      try {
        const res = await gh(`/repos/${C.depot}/contents/${C.fichier}`, {
          method: "PUT",
          body: JSON.stringify({ message: `${message}\n\nPar ${session.login} depuis l'onglet Carte du site.`, content: b64encode(JSON.stringify(data, null, 2) + "\n"), sha, branch: C.branche })
        });
        return { data, commit: res?.commit?.sha?.slice(0, 7) || "", url: res?.commit?.html_url || "" };
      } catch (e) { if (e.message !== "conflit" || i === 2) throw e.message === "conflit" ? new Error("Le fichier a été modifié en même temps par un autre administrateur : réessayez.") : e; }
    }
  }
  const newId = () => "pt-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);

  return { connect, restore, logout, loadPublic, loadRemote, save, newId, get session() { return session; }, get hasToken() { return !!token; }, repo: C, isLocal };
})();
