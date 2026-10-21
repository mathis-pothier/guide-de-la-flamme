# Carte interactive : catégories de lieux et données

État actuel du site : voir la mémoire du projet et `data/map.js` (carte du wiki, fond de nov. 2025 sans Cinder's Cradle,
422 marqueurs, 16 groupes, + iframe AllThings.How). Cette page liste **ce qu'une carte complète devrait contenir**.

## Calques proposés

| Calque | Contenu | Priorité | Notes |
|---|---|---|---|
| Voyage rapide | **Ancient Spires**, autels/bases | haute | révèlent les alentours |
| Shroud | **Shroud Roots**, **Elixir Wells**, zones de Shroud mortel | haute | points de compétence ; 18 racines ajoutées en 1.0 |
| Flamme | **Flame Shrines / Sanctums** (Sparks), **obélisques** | haute | Sparks = monnaie de la Flamme |
| Survivants | **Ancient Vaults**, emplacements des apprentis, Loraine Crim | haute | |
| Donjons | Hollow Halls (6), **donjons-balises** (6), mines, grottes, Black/White Tombs, Sun Temples | haute | |
| Boss | boss nommés + trophées de Flamme | haute | voir table dans 03-progression |
| Coffres | coffres **d'or** / d'argent / communs, coffres verrouillés (crochet) | haute | demande de Theo ; respawn ~1–2 h depuis l'update 7 |
| Minerais | cuivre, étain, fer, argent, or, celestium, moonstone, salpêtre, soufre… | haute | demande de Theo |
| Points d'eau | puits des villages (Longkeep, Rookmore…), plans d'eau de pêche | moyenne | demande de Theo |
| Plantes / récolte | plantes de nuit, plantes propres à une région (ex. Cinder's Cradle) | moyenne | |
| Lieux habités | villes abandonnées (Scavengers), fermes, camps verts (sûrs) / rouges (hostiles) | moyenne | |
| Lore | notes surlignées (XP, indices de quêtes) | basse | |
| Énigmes | portes à symboles, énigme du télescope, temple de Drak'Dal… | moyenne | lien vers les guides de salles |

Catégories de lieux d'après `[techraptor-poi]` ; ajouts 1.0 d'après `[ens-tools-10]`.

## Repères par région (ressources notables)

- Matériaux demandés par la Flamme = bon indicateur de ce que chaque région produit (voir 03-progression).
- **Cinder's Cradle** : exclusifs **Magma Gel, Aurora Beans, Prickle Pearl, Bloomheart Fruit** ; courants : Thyme, Maggots,
  Shell Limestone, **Celestium**, or, fer ; plantes de nuit : Glimmer Gentian, Stapelia Starflower, Calla Luna. Lieux nommés :
  Cinder's Ascent, Mother Flame's Domicile, Ancient Citadel, Andromeda's Eye, Proto Vessel Bay, **Celestium Mining Site**,
  Darya's Daycamp, Manathor's Plaza, Gardens Of Earthly Delights, Drak'Dal Outpost `[ens-tools-cc]`.
- Matériaux de fin de jeu : Cinder Rock, Basalt, Ember Carapace, Tropical Wood, Venom Stinger, Moonstone, Diamond, Archaic
  Shards / Core / Infusion, Shroud Radiance, Shroud Relic, Active Mycelium, Bursting Fell Heart `[yt-04am]`.
- Minage : viser le centre des filons, prendre Miner + Prospector/Mason, améliorer la pioche, **marquer les gisements**
  sur la carte en jeu `[htm-mistakes]`.
- Certaines ressources n'apparaissent **que la nuit** : ne pas toujours sauter la nuit `[htm-mistakes]`.

## Coffres et farm de butin

- Avant la 1.0 (update 7) : boucle de 4 coffres d'or réputée — Cromville Shroud Lair, toit de la Mining Rift, Veilwater
  Basin Tomb (coffre d'argent à l'entrée + coffre d'or au fond), Drak'Dal Temple. Prérequis : Flamme 9, niv. 40+,
  2 crochets (lockpicks) par tour `[games-gg-chests]` [pré-1.0].
- Les coffres ne se réinitialisent plus en se reconnectant : minuteur d'environ 1–2 h, **vider entièrement** un coffre pour
  qu'il compte comme ouvert `[games-gg-chests]`.
- 1.0 : de nouvelles routes de coffres dans Cinder's Cradle circulent en vidéo (« high level loot run », « every spire &
  gold chest route ») — à tester en jeu.

## Contraintes (rappel)

- Ne **jamais** reprendre tuiles, marqueurs ou coordonnées d'AllThings.How, th.gl ou Map Genie (pas de licence).
- Les coordonnées publiées par PinDrop (ex. Vorgoth à 6695, 8369) sont des faits issus des fichiers du jeu, mais leur base
  de données reste leur travail : citer, ne pas aspirer.
- Données réutilisables : wiki (CC BY-SA, collecte automatique déjà en place) et **relevés faits en jeu** par Theo/Mathis.
- Le fond de carte du wiki n'a pas encore Cinder's Cradle : prochaine collecte du wiki ou captures de la carte en jeu.
