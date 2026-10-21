# Progression

## Ordre des régions [1.0]

L'ordre est imposé par la Flamme : chaque palier coûte des ressources de la région précédente et ouvre le Shroud de la
suivante. À l'intérieur des zones ouvertes, l'exploration est libre `[pd-progression]`.

| # | Région | Niveau ennemis (typique) | Ouverte à la Flamme | Boss notables | Racines / Puits |
|---|---|---|---|---|---|
| 1 | Springlands (+ Low Meadows, Blackmire) | 3–9 (≈5) | départ ; Flamme 2 ouvre le reste | Vukah Brawler, Scavenger Matron, Fell Thunderbrute, Direwolf (1.0) | 5 / 3 |
| 2 | Revelwood | 11–15 (≈13) | 3 | Fell Wispwyvern (The Pike), Fell Critter Queen | 7 / 3 |
| 3 | Nomad Highlands | 16–20 (≈18) | 4 | Fell Monstrosity | 7 / 3 |
| 4 | Kindlewastes | 21–27 (≈25) | 5 | Fell Sicklescythe | 8 / 4 |
| 5 | Albaneve Summits | 28–35 (≈32) | 6 (7 ouvre le reste) | Cyclops, Fell Cyclops, Fell Dragon Youngling (Howling Peak), Scavenger Tyrant (1.0), Ancient S.P.D.R. (1.0) | 11 / 2 |
| 6 | Veilwater Basin | 37–45 (≈41) | 8 (9 ouvre le reste) | Hydrak'Dal (1.0) | 6 / 3 |
| 7 | **Cinder's Cradle** (1.0) | 46–50 (≈48) | 10 (11 ouvre le reste) | Vorgoth (final), Fell Striker… | 9 / 0 (⚠ 12 racines selon le changelog) |

Le site affiche déjà des tranches proches dans `data/map.js` (d'après le wiki).

## Paliers de Flamme 1 → 11 [1.0]

Source principale `[allthings-flame]` (consulté pour les faits, texte reformulé). Survivants = nombre de survivants qui
doivent dormir dans un lit abrité.

| Palier | Survivants | Trophée de boss | Matériaux |
|---|---|---|---|
| 1 → 2 | — | aucun | 1 Spark, 5 Resin, 5 Penny Bun, 5 Bones, 5 Shroud Liquid, 5 Animal Fur |
| 2 → 3 | 2 | casque de la **Scavenger Matron** | 5 Spark, 10 Wax, 10 Salt, 10 Shroud Wood, 10 Flintstone, 25 Mycelium |
| 3 → 4 | 4 | tête du **Fell Wispwyvern** | 10 Spark, 15 Goo, 15 Corrupted Boar Tusk, 15 Indigo Plant, 15 Amber, 15 Copper Ore |
| 4 → 5 | 6 | tête du **Fell Monstrosity** | 20 Spark, 20 Mint Mushroom Meat, 20 Fossilized Bone, 20 Ammonia Gland, 20 Tin Ore, 20 Rooibos |
| 5 → 6 | 8 | tête du **Fell Sicklescythe** | 30 Spark, 30 Enshrouded Vulture Talon, 30 Saffron, 30 Iron Ore, 30 Lapislazuli, 30 Brittle Shroud Flakes |
| 6 → 7 | 10 | tête du **Fell Cyclops** | 30 Spark, 30 Wool, 30 Gentian, 30 Ice, 30 Granite, 30 Flammable Goo |
| 7 → 8 | 12 | tête du **Fell Dragon Youngling** | 40 Spark, 40 Obsidian, 40 Silver Bars, 40 Mauveine, 40 Wolfsbane, 40 Amethyst |
| 8 → 9 | 14 | tête de **Hydrak'Dal** | 50 Spark, 50 Gold Ore, 30 Green Vitriol Dust, 30 Passionflower, 50 Aquamarine, 30 Pearl |
| 9 → 10 | 16 | **Broken Guard Of The North Crown** | 60 Spark, 15 Gleam Root Dust, 10 Piscine Ivory Dust, 30 Drak Blood, 10 Shroud Sludge, 30 Daylily |
| 10 → 11 | 18 | **Vorgoth's Bound Essence** + **Vorgoth's Eye** | 20 Spark, 10 Celestium Bars, 15 Moonstone, 20 Diamond Dust, 15 Ember Carapace |

⚠ Divergences à vérifier en jeu :
- Avant la 1.0, le passage 1 → 2 demandait la tête du **Fell Thunderbrute** `[games-gg-progression]` ; en 1.0 aucune tête
  n'est listée `[allthings-flame]`.
- PinDrop rattache la couronne du palier 9 → 10 à Vorgoth `[pd-final-boss]` ; AllThings.How parle d'une couronne
  « Broken Guard of the North ». **Piste des vidéos** : cette garde brisée se récupère sur le bras d'une statue de la salle
  du trône du château de **Cromville** (nord de Veilwater), pas sur un boss (une seule vidéo, voir [Vidéos : nouveautés 1.0](videos/01-nouveautes-1-0.md)).
- Effets par palier (temps de Shroud, bonus d'attribut, autels) : seules des tables pré-1.0 existent (niveau 1 : 5 min,
  2 autels, +0 ; niveau 6 : 10 min, 8 autels, +5 ; niveau 9 : ≈13 min, 10 autels, +8) `[games-gg-progression]` `[xgs-base]`.
  En 1.0 : 15 autels à la Flamme 10, 16 à la Flamme 11.

## Boss et faiblesses [1.0 partiel]

D'après `[pd-bosses]` (faiblesses lues dans les fichiers 1.0 quand le boss a pu être identifié).

| Boss | Région | Niveau | Faiblesses | Rôle |
|---|---|---|---|---|
| Fell Thunderbrute | Springlands → Kindlewastes | 3–9 | ? | garde Puits et Racines |
| Scavenger Matron | Springlands → Kindlewastes | 3–9 | ? | trophée Flamme 3 ; deux formes |
| Vukah Brawler | plusieurs | 3–9 | poison 120 %, Shroud 120 % | — |
| Fell Critter Queen | Revelwood → Cinder's Cradle | 11–15 | feu 140 %, poison 120 % | — |
| Fell Wispwyvern | Revelwood (The Pike) | 11–15 | ? | trophée Flamme 4 |
| Hollow Cyclops | Hollow Halls | 11–15 | contondant 150 %, feu 120 % | boss de Hollow Halls |
| Fell Monstrosity | Nomad Highlands, Kindlewastes | 16–20 | feu 120 % | trophée Flamme 5 |
| Fell Sicklescythe | Kindlewastes | 21–27 | ? | trophée Flamme 6 |
| Cyclops | Albaneve Summits (5 antres) | 28–35 | Shroud 120 % | — |
| Fell Cyclops | Albaneve, Cinder's Cradle | 28–35 | poison 140 %, feu 140 % | trophée Flamme 7 |
| Fell Dragon Youngling | Albaneve (Howling Peak) | 28–35 | feu 120 % | trophée Flamme 8 |
| Scavenger Tyrant (1.0) | Albaneve (×3) | 28–35 | perforant 130 %, glace 130 % | — |
| Hydrak'Dal (1.0) | Veilwater Basin | 37–45 | perforant 140 %, glace 120 % | trophée Flamme 9 ; lié à la quête du pêcheur *Vengeance* |
| Lord Vorgoth (1.0) | Cinder's Cradle | 50 | feu 120 %, **immunisé au Shroud** | boss final, trophées Flamme 11 |

Autres boss 1.0 : Direwolf (Springlands), Fell Striker (Springlands, Revelwood), Hollow Titan, Hollow Wispwyvern, Ancient
S.P.D.R. Construct (Albaneve), Armored Fell Thunderbrute et Fell Crimson Critter Queen (Cinder's Cradle) `[ens-tools-10]` `[ens-tools-cc]`.
En 1.0, un boss **regagne sa vie** si on quitte le combat.

## XP et points de compétence

- **XP** : tuer, découvrir des lieux, **miner** (méthode la plus rapide au début selon Prima : petite mine de silex au nord
  de Braelyn Bridge). Construire et couper du bois ne rapportent pas d'XP. Les notes de lore surlignées donnent de l'XP
  `[prima-xp]` `[gamerguides-tips]`.
- **Points** (modèle pré-1.0, budget 184) : 2 par niveau (88 jusqu'au niv. 45), 1 par **Shroud Root** (39), 3 par
  **Elixir Well** (19 puits = 57) `[xgs-skills]`.
- **En 1.0** : niveau 50, +18 racines, nouvelles régions sans puits dans Cinder's Cradle → **total exact non confirmé**
  (les calculateurs en ligne sont encore en données 0.9.1.2) `[companion-10]`. Deux vidéos 1.0 avancent **212 points**
  avec toutes les racines ([Vidéos : builds](videos/03-builds-competences.md)). À compter en jeu.
- Points bonus uniquement à la **première** destruction de chaque racine/puits (par sauvegarde).
- Les **Ancient Spires** (tours) révèlent les racines proches sur la carte ; les **obélisques** révèlent les sanctuaires `[prima-xp]` `[techraptor-poi]`.

## Repères d'équipement

- Le site couvre déjà en détail armes, armures, anneaux, sets par build (`data/`). À retenir pour les guides :
  - en 1.0 chaque palier de Flamme débloque la recette d'armure du palier suivant ;
  - les sets n'ont pas toujours de bonus de set : mieux vaut les **meilleures pièces individuelles** (tête et gants pour
    les dégâts) que le set complet `[htm-mistakes]` ;
  - ne pas dépenser ses runes avant la fin de jeu : farmer les coffres des zones de niveau max `[htm-mistakes]`.
- Fin de jeu 1.0 : set **Vorgoth's Soulbound** (5 pièces, matériaux du boss final), **Shroud Vessel's Greatsword**
  (légendaire, moitié dégâts Shroud), 16 nouveaux sets dont Artificer's (à trouver dans Cinder's Cradle) `[ens-tools-10]` `[allthings-ending]`.
- Matériaux de fin de jeu (Cinder's Cradle) : Celestium, Moonstone, Diamond Dust, Ember Carapace, Magma Gel, Archaic
  Shards / Core / Infusion, Shroud Radiance, Shroud Relic `[yt-04am]` `[ens-tools-cc]`.
