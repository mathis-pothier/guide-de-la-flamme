// CONTENU ÉDITORIAL — « tronc commun » : compétences utiles à tous les personnages, quelle que soit la classe.
// `sources` = guides qui la recommandent pour tous ; une entrée sans guide est marquée `site: true` (conseil de ce site,
// fondé uniquement sur l'effet décrit par le wiki). Coûts : arbre 1.0 (PinDrop) — coût par rang × nombre de rangs.
window.ENS = window.ENS || {};
window.ENS.tronc = {
  intro: "Aucune classe n'est imposée : ces compétences servent à tous les personnages, guerrier comme mage. Les guides s'accordent surtout sur le premier groupe, « Indispensables partout ».",
  premiersPoints: ["double-jump", "airborne", "rebound", "mason", "miner", "dessert-stomach", "updraft"],
  premiersPointsSources: ["gamesgg-skills", "htm-skills"],
  premiersPointsNote: "Ordre inspiré de games.gg (« tous les builds, tôt » : Double Jump, Airborne, Rebound, Miner) puis des deux autres incontournables de Hack The Minotaur. Un seul rang compté par compétence.",
  groupes: [
    { titre: "Indispensables partout", icone: "star", niveau: "indispensable", competences: [
      { id: "double-jump", pourquoi: "Second saut : explorer, grimper, esquiver les attaques au sol, enchaîner une attaque plongeante.", sources: ["htm-skills", "gamesgg-skills", "gameboost-reset"], citation: "« à prendre sur tous les builds » (Hack The Minotaur, n° 1)" },
      { id: "dessert-stomach", pourquoi: "Un emplacement de nourriture en plus, donc un bonus actif en permanence (santé, endurance ou mana).", sources: ["htm-skills", "gamesgg-skills"], citation: "« utile pour tous les builds » (Hack The Minotaur)" },
      { id: "airborne", pourquoi: "Le planeur consomme moins d'endurance : on vole plus loin.", sources: ["gamesgg-skills", "htm-skills"], citation: "dans « tous les builds, tôt » (games.gg)" },
      { id: "updraft", pourquoi: "La « propulsion » du planeur : un saut vers le haut en plein vol, pour reprendre de l'altitude.", sources: ["htm-skills", "gamesgg-skills"], nuance: "Coûte 100 mana : prévoyez un peu d'Esprit si vous jouez guerrier ou archer." },
      { id: "rebound", pourquoi: "Endurance qui remonte plus vite : sprint, escalade, esquives et planeur en profitent.", sources: ["gamesgg-skills", "htm-skills"] }
    ] },
    { titre: "Survie et santé", icone: "heart", niveau: "conseille", competences: [
      { id: "constitution", pourquoi: "+50 points de vie par point investi : la santé en plus, pour toutes les classes.", sources: ["eb-battlemage", "kg-builds"], nuance: "Les guides de build la placent en priorité haute même pour les mages ; un archer qui reste loin peut en prendre moins." },
      { id: "good-metabolism", pourquoi: "Orbes de soin 3 fois plus efficaces et potions de vie/mana +20 %.", site: true },
      { id: "inner-fires", pourquoi: "Plus de temps dans le Voile avant de mourir : indispensable pour explorer les zones voilées et leurs coffres.", site: true, nuance: "Modifiée en 1.0 : valeur à vérifier en jeu." },
      { id: "vigorous-deflection", pourquoi: "Chaque parade rend de l'endurance : utile à toute classe qui pare (y compris les mages avec garde).", site: true }
    ] },
    { titre: "Déplacements et exploration", icone: "compass", niveau: "conseille", competences: [
      { id: "runner", pourquoi: "Sprint plus rapide et moins coûteux.", sources: ["htm-skills"] },
      { id: "arachnoid", pourquoi: "Escalade deux fois moins coûteuse en endurance.", site: true },
      { id: "giant-slayer-hook", pourquoi: "Le grappin vous tire vers les grands ennemis : utile en combat comme pour traverser.", site: true },
      { id: "airborne-architect", pourquoi: "Vol libre en mode construction : énorme gain de temps pour bâtir.", sources: ["htm-skills"], nuance: "Hack The Minotaur conseille de la prendre en milieu de partie." }
    ] },
    { titre: "Récolte", icone: "hammer", niveau: "conseille", competences: [
      { id: "mason", pourquoi: "La pioche casse la pierre et les filons 30 % plus vite. Nécessaire pour Miner selon games.gg.", sources: ["gamesgg-skills"] },
      { id: "miner", pourquoi: "10 % de chance d'obtenir une ressource en plus en minant.", sources: ["gamesgg-skills"], citation: "« à prendre quelle que soit l'orientation combat » (games.gg)" },
      { id: "lumberjack", pourquoi: "Abattre les arbres plus vite.", site: true },
      { id: "quality-gear", pourquoi: "Vos outils s'usent moins vite.", site: true }
    ] },
    { titre: "Combat de base (toutes armes)", icone: "sword", niveau: "conseille", competences: [
      { id: "power-parry", pourquoi: "Les parades étourdissent les ennemis 30 % plus vite, avec n'importe quelle arme ou garde.", sources: ["kg-builds"] },
      { id: "merciless-attack", pourquoi: "Frappe lourde gratuite sur un ennemi étourdi : gros dégâts pour toutes les classes.", sources: ["kg-builds", "aoeah-tier"] },
      { id: "opportunity", pourquoi: "Double les multiplicateurs de Merciless Attack et Sneak Attack.", site: true }
    ], note: "Hack The Minotaur recommande aussi la spécialisation de votre arme (baguette, épée, arc…) « pour tous les builds » : elle se trouve dans la branche de votre classe." },
    { titre: "En équipe", icone: "users", niveau: "selon", competences: [
      { id: "saviour", pourquoi: "Réanimez vos alliés en 3 s au lieu de 6.", site: true, nuance: "Inutile en solo." },
      { id: "healing-revive", pourquoi: "Les alliés réanimés reviennent avec 25 % de vie au lieu de 10 %.", site: true, nuance: "Inutile en solo." }
    ] },
    { titre: "Très recommandées, selon votre style", icone: "spell", niveau: "selon", competences: [
      { id: "blink", pourquoi: "Remplace la roulade par une téléportation : la meilleure mobilité en combat selon les guides.", sources: ["htm-skills", "gamesgg-skills", "gameboost-reset"], nuance: "Dans la branche Mage (4 pts) : surtout pour les mages et hybrides, mais certains guerriers la prennent." },
      { id: "water-aura", pourquoi: "Soin passif autour de vous, qui dépend de l'Intelligence.", sources: ["htm-skills", "gamesgg-skills"], nuance: "Peu efficace sans Intelligence." },
      { id: "battle-heal", pourquoi: "Les critiques en mêlée vous soignent.", sources: ["htm-skills", "gamesgg-skills"], nuance: "Seulement pour les builds de mêlée." }
    ] }
  ]
};
