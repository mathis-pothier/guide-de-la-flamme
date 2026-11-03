// Bestiaire — compléments rédigés à la main (jamais écrasés par scripts/build-bestiaire.mjs).
// Chaque note cite ses sources (identifiants de data/sources.js) et la date de la source. Ne rien ajouter sans source :
// une faiblesse « logique » (loup → feu…) n'est pas une donnée tant qu'aucune source ne la publie.
window.ENS = window.ENS || {};
window.ENS.bestiaireNotes = {
  // Phrases générales de la page « Combat Mechanics » du wiki (mesures de joueurs, page modifiée le 25/04/2026, donc avant la 1.0)
  familles: {
    Fell: { texte: "D'après les mesures publiées sur le wiki (avant la 1.0), tous les Déchus (Fell) sont vulnérables au feu et immunisés contre les dégâts du Voile.", sources: ["wiki-combat"] },
    Wildlife: { texte: "D'après les mesures publiées sur le wiki (avant la 1.0), la faune sauvage est vulnérable aux dégâts du Voile ; ce n'est pas le cas de ses équivalents déchus.", sources: ["wiki-combat"] },
    Scavenger: { texte: "D'après le wiki (avant la 1.0), les pillards sont très vulnérables à la glace et très résistants au feu (sauf le loup pillard) jusqu'aux Sommets de l'Albaneve et au Bassin des eaux voilées, où c'est l'inverse. L'infobox de chaque pillard ne donne qu'une valeur : vérifiez l'indication « Effective » / « Resisted » en jeu selon la région.", sources: ["wiki-combat"] },
    Vukah: { texte: "D'après les mesures publiées sur le wiki (avant la 1.0), les Vukah sont vulnérables au feu et au Voile et résistants à la glace.", sources: ["wiki-combat"] }
  },
  // Faiblesses des boss reprises du guide « Boss : où, quel niveau, quelles faiblesses » (data/guides.js, source PinDrop).
  // Pourcentage de dégâts subis (120 = +20 %). Seules les faiblesses sont publiées : un type absent n'est pas « neutre ».
  pindrop: {
    "Vukah Brawler": { Poison: 120, Shroud: 120 },
    "Fell Critter Queen": { Fire: 140, Poison: 120 },
    "Hollow Cyclops": { Blunt: 150, Fire: 120 },
    "Fell Monstrosity": { Fire: 120 },
    "Fell Cyclops": { Poison: 140, Fire: 140 },
    "Fell Dragon Youngling": { Fire: 120 },
    "Scavenger Tyrant": { Piercing: 130, Ice: 130 },
    "Hydrak'Dal": { Piercing: 140, Ice: 120 }
  },
  // Images quand la page du wiki n'en a pas (vérifiées le 03/11/2026), toujours signalées dans la fiche :
  //   type « creature » = fichier du wiki montrant la créature mais non rattaché à sa page ;
  //   type « trophee »  = trophée de la créature (tête montée sur plaque), fichier du wiki ;
  //   comme : nom d'une autre créature dont la page du wiki dit que celle-ci est une variante (image de la forme de base).
  // Une capture en jeu (images/creatures-jeu/<id>.jpg, voir scripts/import-captures-creatures.ps1) reste prioritaire.
  images: {
    "Hydrak'Dal": { url: "https://enshrouded.wiki.gg/images/thumb/Hydrak%27Dal.png/320px-Hydrak%27Dal.png", type: "creature" },
    "Ancient S.P.D.R. Construct": { url: "https://enshrouded.wiki.gg/images/Ancient_S.P.D.R._Construct_Trophy.png", type: "trophee" },
    "Direwolf": { url: "https://enshrouded.wiki.gg/images/Direwolf_Trophy.png", type: "trophee" },
    "Fell Crimson Critter Queen": { url: "https://enshrouded.wiki.gg/images/Fell_Crimson_Critter_Queen_Trophy.png", type: "trophee" },
    "Fell Striker": { url: "https://enshrouded.wiki.gg/images/Fell_Striker_Trophy.png", type: "trophee" },
    "Hollow Titan": { url: "https://enshrouded.wiki.gg/images/Hollow_Titan_Trophy.png", type: "trophee" },
    "Hollow Wispwyvern": { url: "https://enshrouded.wiki.gg/images/Hollow_Wispwyvern_Trophy.png", type: "trophee" },
    "Armored Fell Thunderbrute": { comme: "Fell Thunderbrute" },
    "Scavenger Gorger Matron": { comme: "Scavenger Matron" },
    "Scavenger Grizzler Matron": { comme: "Scavenger Matron" }
  },
  // Notes propres à une créature (nom anglais du wiki → [{ texte, sources }])
  creatures: {
    "Fell Wispwyvern": [{ texte: "Les mesures du wiki (avant la 1.0) donnent deux valeurs par type de dégâts (ex. 0,5/2,5) sans les expliquer. Voir aussi le guide du site consacré à ce boss.", sources: ["wiki-combat"] }]
  }
};
