# Mécaniques de jeu

## Le Shroud (brume / voile)

- Entrer dans le Shroud lance un **minuteur** ; à zéro, le personnage meurt. Le minuteur se recharge en sortant du brouillard
  `[xgs-shroud]`.
- **Shroud normal** (blanc/violet) et **Shroud mortel** (rouge) : le rouge vide la jauge beaucoup plus vite tant que le
  **niveau de Flamme** est insuffisant. Seule la Flamme fait monter ce « niveau de passage » : ni l'équipement ni les
  compétences `[xgs-shroud]`.
- **Allonger le temps** :
  - niveau de Flamme (≈ 5 min au niveau 1, +1 min par niveau ; ≈ 13 min au niveau 9 d'après une source de juin 2026) [pré-1.0, à revérifier pour les niveaux 10–11] ;
  - compétence centrale **Inner Fires** : +60 s par rang (3 rangs) `[allthings-center]` ;
  - **Shroud Survival Flask** (potion) : +2 min (ou +4 min pour la version améliorée) au maximum pendant 45 min ; à boire
    **avant** d'entrer, elle n'augmente pas un minuteur déjà entamé `[gamerguides-tips]` `[xgs-shroud]` ;
  - points de réapparition et **sabliers / fontaines de Shroud** trouvés dans la brume (plus fréquents en 1.0, lâchés aussi
    par les gros Fell, mais durée plus courte) `[guided-changelog]`.
- Dans le Shroud : ennemis **Fell** (créatures corrompues), meilleur butin, **Shroud Roots**, **Elixir Wells**, mines.
- **Shroud Cores** (cœurs) : lâchés par les mini-boss des Elixir Wells, servent à agrandir la zone de construction de l'autel `[xgs-shroud]`.
- **En 1.0, Flamme 11** : les autels repoussent le Shroud autour d'eux. Le niveau de Flamme requis pour cela est réglable dans
  les paramètres du monde `[guided-changelog]`.

## La Flamme et les autels

Deux améliorations distinctes à l'autel `[gamerguides-tips]` `[games-gg-progression]` :

1. **Renforcer la Flamme** (« Strengthen the Flame ») : niveau global du monde, payé en **Sparks** + matériaux + **trophée
   de boss**. Effets : temps de Shroud, passage dans le Shroud mortel, bonus d'attributs, nombre d'autels actifs, capacité
   d'artisans par autel, et en 1.0 débloque le palier d'armure suivant. Coûts détaillés : [03-progression.md](03-progression.md).
2. **Agrandir l'autel** (zone de construction) : payé en **Shroud Cores** (puis matériaux de Shroud plus rares). Zone de
   40×40×40 au départ jusqu'à 120×120×120 d'après games.gg [pré-1.0].

Autres règles :
- Les modifications de terrain **dans** la zone d'un autel sont permanentes ; **hors** zone, le terrain se reforme avec le temps `[xgs-base]`.
- Autels **indestructibles**, servent de point de voyage rapide et de réapparition, et permettent de **réinitialiser
  l'arbre de compétences** (1 rune par point dépensé) `[gamerguides-tips]` `[xgs-skills]`.
- Nombre d'autels : **15** à la Flamme 10, **16** à la Flamme 11 en 1.0 `[guided-changelog]`.
- **Sparks** : récoltés aux **Flame Shrines / Flame Sanctums** (sanctuaires de la Flamme), qui se rechargent `[techraptor-poi]`.

## Base, repos et confort

- **Rested** (« Reposé ») : buff d'endurance max et de régénération. Conditions : à l'abri (toit + murs), près d'une source
  de chaleur, sans ennemi proche, assis ou couché, avec des objets de confort `[xgs-base]`.
- **Confort** : chaque point ajoute environ **1 min** de durée au Rested. **Seul le meilleur objet de chaque catégorie de
  mobilier compte** : varier les meubles plutôt que les multiplier. Jouer d'un instrument avant de partir aide aussi.
  Compétence centrale **Well Rested** : +2 min par rang `[htm-mistakes]` `[allthings-center]`.
- Conseil répandu : **ne pas sur-investir la première base** dans la zone de départ ; installer la base principale près des
  ressources de fin de jeu, et semer des autels secondaires (avec un établi) comme relais `[htm-mistakes]`.
- **Coffres magiques** : stockage partagé, à débloquer tôt. En 1.0, les coffres s'améliorent sur place `[htm-mistakes]` `[guided-changelog]`.

## Survivants (artisans)

Retrouvés endormis dans des **Ancient Vaults** (caveaux), on les réveille puis on les invoque à la base avec le **Summoning
Staff**. Chacun débloque une branche d'artisanat et des quêtes. Ils doivent être « abrités » (lit dans un espace couvert)
pour certaines recettes `[gamerguides-tips]` `[sk-survivors]`.

| Rôle | Nom | Où (pré-1.0) | Apprenti(e) à retrouver |
|---|---|---|---|
| Forgeron | Oswald Anders | Cinder Vault (départ) | Rochelle Anders — Fanning Ranch |
| Alchimiste | Balthazar | Ancient Vault à l'ouest de la tour de Springlands | Lady Leclair — Glenwood's End (cave cachée) |
| Fermière | Emily Fray | Ancient Vault au nord de la tour de Springlands | Fenrig Mills Jr. — grotte aux loups au sud de Fenrig's Farm |
| Chasseuse | Athalan Skree | Ancient Vault à l'est de la tour de Springlands (près de Braelyn Bridge) | Galen Yager — nid de vautours, Nomad Highlands |
| Charpentier | Cade Hawthorn | Ancient Vault au sud-ouest de la tour de Low Meadows | Aunt Braelyn — temple caché de Blackmire |
| Barde | Melody | Cité antique engloutie, nord de la tour de Blackmire (quête après la tour de Revelwood et niv. 12) | — |
| Collectionneur | Aiden Crowley | Hollow Halls (quête de l'alchimiste) | — |
| **Nouveau 1.0** | **Loraine Crim** | Cinder's Ascent, Cinder's Cradle | — |

Source : `[sk-survivors]` (non daté, pré-1.0), `[ens-tools-10]` pour Loraine. Il existe aussi des **villageois** (non artisans)
qui augmentent la capacité de la base. La Flamme exige un nombre de survivants abrités dans des lits pour chaque palier
(2 au palier 3, jusqu'à 18 au palier 11) `[allthings-flame]`. En 1.0, les artisans proposent l'amélioration des sorts et
flèches éternels, et les survivants circulent mieux (lits, chaises, escaliers).

## Artisanat

- Établi (Workbench) au départ : **planeur** et **grappin** sont prioritaires (catégorie Survie) `[gamerguides-tips]`.
  Grappin : 4 Metal Scraps, 7 String, 10 Shroud Spores [pré-1.0] `[games-gg-progression]`.
- Le **point d'exclamation orange** sur un objet fabriqué signale qu'il débloque d'autres recettes (ex. Bug Dust → Goo,
  nécessaire à la Flamme) `[gamerguides-tips]`.
- Chaque survivant débloque des stations (forge, table d'alchimie, métier à tisser…). Les stations améliorées viennent avec
  les apprentis.
- Équipement : amélioration par paliers jusqu'au niveau 55 ; **runes** (rare/épique/légendaire) nécessaires aux
  améliorations, la rune légendaire une étape plus tard qu'avant en 1.0.

## Eau

Sources `[techraptor-water]` [pré-1.0] :
- **Puits des villages** (Longkeep, Rookmore) : on y puise, ils se rechargent ; contenants cassés dans les villages.
- **Water Well** à construire (Charpentier) : 20 Linen, 100 Stone, 1 Wooden Bucket ; nécessite Charpentier, Forgeron et
  Chasseuse. **Improved Water Well** : 100 Sandstone (Kindlewastes) + 2 Iron Bars, plus rapide.
- Wooden Bucket : 2 planches, 1 Metal Sheets, 1 Charcoal.
- Usage : recettes de cuisine et d'alchimie.
- Pour la carte : les **puits de villages** sont les « points d'eau » à cartographier en priorité.

## Nourriture

- Pas de faim mortelle : la nourriture donne des **buffs** (vie, endurance, mana, régénération). On peut avoir plusieurs
  plats actifs ; conseil : toujours **trois types** de nourriture (viande → vie, baies → soin dans le temps, etc.) `[gamerguides-tips]`.
- Nouveaux en-cas et recettes en 1.0 (Cinder's Cradle : Aurora Beans, Bloomheart Fruit, Prickle Pearl…) `[ens-tools-cc]`.

## Élevage et animaux de compagnie

Depuis l'update « Frozen Frontier » [pré-1.0] `[holy-taming]` :
- Quête de la fermière (*Animal Farming*). Il faut une mangeoire, des coussins, de la **nourriture** et un **appât**.
- S'approcher accroupi, lancer l'appât, caresser l'animal pendant qu'il mange pour remplir les cœurs ; « ? » = s'arrêter,
  « ! » = l'animal fuit.
- **8 espèces** : chèvre, hophare, cerf féerique (Fae Deer), redtail sans ailes (œufs), chèvre frisée, yak (laine), chat, chien.
- Reproduction : deux animaux de même espèce, un lit chacun + un pour le petit.
- **Chat et chien** : quêtes *Cat Search* (alchimiste) et *Dog Search* (chasseuse) ; les caresser donne +25 PV pendant 30 min.

## Pêche (refondue en 1.0)

Tous les poissons dans toutes les eaux ; **l'appât** garantit le palier du poisson, **la canne** limite ce qu'on peut
attraper ; plus de chances de rares/épiques. Compétence centrale **Fisherman's Resolve** `[guided-changelog]` `[allthings-center]`.

## Sparkworks (nouveau 1.0)

Système de logique type « redstone » `[games-gg-sparkworks]` `[pcgames-review]` :
- **Déblocage** : abriter le Charpentier, quête *Contraptions and Mechanisms*, trouver le **Sparkworks Tool** dans un coffre
  du **Trapped Night Sanctum**, fabriquer le **Sparkworks Workbench**.
- **Entrées** : leviers, boutons, plaques de pression, zones de déclenchement. **Sorties** : portes, trappes, pièges,
  apparitions d'ennemis (Spawner), feux d'artifice. **Logique** : portes NOT et OR, horloges (délais).
- Éditeur de **graphe 2D**, boîtiers de jonction renommables. L'outil n'est nécessaire que pour éditer, pas pour utiliser.
- Les mondes se partagent via **Adventure Sharing** : de quoi créer des donjons et énigmes pour la communauté.
- Idée de contenu : section « créations Sparkworks » (tutos, schémas).

## Multijoueur

- Jusqu'à 16 joueurs (PC) / 8 (PS5), serveurs dédiés possibles. Le Flame level et le monde sont partagés ; personnage et
  inventaire sont propres à chaque joueur.
- Coop : le boss final gagne **+70 % de vie et +5 % de dégâts par joueur supplémentaire** `[pd-final-boss]`.
- Pas de cross-play PC/PS5 au lancement.
