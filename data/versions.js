// Suivi des versions du jeu et état de l'actualisation des données du site.
// À mettre à jour à chaque version (voir MISE-A-JOUR.md). `derniereNewsSteam` sert au script scripts/check-updates.mjs.
window.ENS = window.ENS || {};
window.ENS.meta = {
  versionJeu: "1.0.0.2",
  build: "1269579",
  dateVersion: "2026-10-16",
  derniereActualisation: "2026-10-20",
  derniereNewsSteam: "1846651706681725", // renseigné par `node scripts/check-updates.mjs --save`
  actualisationAuto: false,
  couverture: [
    { domaine: "Catalogue d'objets", etat: "partiel", detail: "850 objets (armes, pièces d'armure, sets, anneaux, boucliers, sorts) lus sur le wiki le 20/10/2026 ; 526 pages modifiées depuis la 1.0. Dégâts des armes non repris (calculs du wiki périmés)." },
    { domaine: "Compétences", etat: "partiel", detail: "Effets issus du wiki (structure pré-1.0). Nouvelles compétences 1.0 intégrées avec coûts/rangs, valeurs souvent non publiées." },
    { domaine: "Carte", etat: "partiel", detail: "Carte du wiki intégrée : fond de nov. 2025 (sans Cinder's Cradle), marqueurs d'août 2026. Carte 1.0 complète via AllThings.How (intégrée) et liens vers th.gl et Map Genie." },
    { domaine: "Anneaux", etat: "1.0", detail: "38 anneaux nommés sur le wiki + 7 lignées lues dans les fichiers 1.0 (PinDrop)." },
    { domaine: "Amulettes", etat: "absent", detail: "Aucune catégorie d'amulette sur le wiki ni dans les bases consultées." },
    { domaine: "Builds", etat: "editorial", detail: "10 builds ; équipement 1.0 pièce par pièce pour 9 d'entre eux d'après KeenGamer, AoEAH, PinDrop et Enshrouded Builds, plus un classement automatique du catalogue." }
  ]
};
window.ENS.versions = [
  {
    version: "1.0.0.2", date: "2026-10-16", build: "1269579", sources: ["steam-news", "theclick-hotfix"],
    resume: "Correctif officiel : configuration des paramètres de monde, plantage de migration des sauvegardes (les personnages corrompus ne sont pas migrés pour l'instant), brouillard gris sur cartes Nvidia, nombreux plantages.",
    impact: "Traductions corrigées pour Aerial Wand Attack, Evasion Attack, Wand Evasion Attack et Crash Down Attack. Keen Games annonce d'autres descriptions de compétences dans le prochain correctif : à revérifier.",
    etatSite: "Vérifié sur la note officielle — aucune valeur de jeu modifiée."
  },
  {
    version: "1.0.0.1", date: "2026-10-15", build: "1267041", sources: ["steam-news", "kg-patch"],
    resume: "Correctif officiel : plantages aléatoires, luminosité intérieure, plantages liés à certains périphériques.",
    impact: "Le parchemin « Fire Wisp » a désormais un niveau fixe de 27 (ses dégâts suivaient le niveau du joueur, ce qui le rendait trop fort en fin de partie).",
    etatSite: "Vérifié sur la note officielle. Fire Wisp n'est pas référencé sur ce site. Les données PinDrop « 1.0 » proviennent de ce build (1267041)."
  },
  {
    version: "1.0.0.0", date: "2026-10-15", sources: ["kg-patch", "nodecraft-10", "steam-news"],
    resume: "Sortie de l'accès anticipé : biome Cinder's Cradle, niveau max 50 (équipement 55), Flamme niveau 11, réinitialisation de l'arbre de compétences.",
    impact: [
      "9 nouveaux sorts : Mana Drain, Entangle, Pillar of Flames, Blizzard, Ball Lightning, Summon Fire/Ice/Shock Totem, Summon Hollow Skeleton ; versions « éternelles » de tous les sorts (22 de palier 7).",
      "Nouvelles compétences : Advanced Necromancy, Totem Mastery, Aerial Wand Attack, Wand Evasion Attack, Blast and Cast, Puncture, Barrage, Survival Instinct.",
      "Compétences de dagues déplacées du Guerrier vers l'Assassin ; Veteran, One-Handed Specialization, Inner Fires et Snap ajustées.",
      "Baguettes : attaque lourde perforante qui interrompt les ennemis faibles. Attaques lourdes de mêlée multi-cibles. Le blocage n'empêche plus la régénération d'endurance.",
      "Flèches éternelles (feu, foudre, os). Sets Marksman et Sharpshooter déplacés dans le butin régional ; nouveaux sets Rôdeur à dagues (Revelwood, Nomad Highlands).",
      "Équipement légendaire : runes légendaires requises une étape d'amélioration plus tard. Rééquilibrage de gemmes et de vols de vie/mana/endurance."
    ],
    etatSite: "Partiellement intégré : nouvelles compétences ajoutées ; statistiques d'objets majoritairement pré-1.0 (signalées)."
  }
];
