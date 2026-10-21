// CONTENU ÉDITORIAL — sets d'armure de début et de milieu de partie par build.
// Choix fondés sur la phrase « intended for … » des pages de sets du wiki (rôle prévu par le jeu),
// sur les sets de départ cités par PinDrop (Best Armor Sets) et sur les niveaux du catalogue.
// data/merge.js transforme chaque set en la pièce correspondant à l'emplacement (Tête, Torse, Mains, Jambes, Pieds).
// Début = niveau ≤ 15 ; Milieu = 16 à 35 ; Fin = conseils des guides (builds-1.0.js).
window.ENS = window.ENS || {};
window.ENS.progression = {
  "mage-bataille": { debut: ["set-wizard", "set-alchemist-apprentice"], milieu: ["mystic-set", "warlock-set", "set-hailcaster"], fin: null,
    pourquoi: "Mystic, Warlock et Hailcaster sont « prévus pour les dégâts de baguette » selon le wiki ; Wizard donne +3 % de dégâts de baguette." },
  "sorcier": { debut: ["set-mage", "set-alchemist-apprentice"], milieu: ["magician-set", "thaumaturge-set"], fin: null,
    pourquoi: "Magician et Thaumaturge sont « prévus pour les dégâts de bâton » selon le wiki ; Mage donne du mana." },
  "soigneur": { debut: ["set-healer", "set-alchemist-apprentice"], milieu: ["herbalist-set", "sage-set", "pearlfrost-mentor-set"], fin: null,
    pourquoi: "Herbalist, Sage et Pearlfrost Mentor sont « prévus pour les soigneurs » selon le wiki." },
  "invocateur": { debut: ["set-alchemist-apprentice", "set-mage"], milieu: ["magician-set", "warlock-set", "thaumaturge-set"], fin: null,
    pourquoi: "Aucun set n'est prévu pour l'invocation : sets magiques de bâton ou de baguette, selon votre arme." },
  "tank": { debut: ["tank-set", "set-rising-fighter"], milieu: ["guardian-set", "warden-set"], fin: null,
    pourquoi: "Tank, Guardian et Warden sont « prévus pour les tanks » selon le wiki." },
  "guerrier": { debut: ["warrior-set", "set-rising-fighter"], milieu: ["rogue-set", "wolfs-fang-set"], fin: null,
    pourquoi: "Warrior, Rogue et Wolf's Fang sont « prévus pour les dégâts de Merciless Strike » selon le wiki (le jeu à l'étourdissement du guerrier)." },
  "barbare": { debut: ["set-rising-fighter", "adventurer-set"], milieu: ["soldier-set", "mountains-shadow-set"], fin: null,
    pourquoi: "Soldier et Mountain's Shadow sont « prévus pour les dégâts à deux mains » selon le wiki ; Rising Fighter est le set de départ mêlée cité par PinDrop." },
  "rodeur": { debut: ["ranger-set", "set-scout"], milieu: ["sharpshooter-set", "set-deadeye", "trailblazer-set"], fin: null,
    pourquoi: "Sharpshooter et Trailblazer sont « prévus pour les tirs précis » selon le wiki (Sharpshooter est devenu un butin en 1.0) ; Scout est le set de départ cité par PinDrop." },
  "assassin": { debut: ["archer-set", "set-scout"], milieu: ["fowler-set", "assassin-set", "frostbite-slasher-set"], fin: null,
    pourquoi: "Archer, Fowler, Assassin et Frostbite Slasher sont « prévus pour les dagues » selon le wiki." },
  "hybride-mage-tank": { debut: ["set-wizard", "tank-set"], milieu: ["mystic-set", "warlock-set"], fin: "set-vorgoths-soulbound",
    pourquoi: "Proposition éditoriale : sets de baguette jusqu'au milieu de partie, puis Vorgoth's Soulbound (légendaire 1.0, classé mêlée par le wiki mais recommandé aux mages par les guides)." }
};
