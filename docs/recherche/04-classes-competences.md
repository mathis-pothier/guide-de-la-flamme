# Classes et arbre de compétences

Le site a déjà un onglet Compétences et 10 builds (`data/skills.js`, `data/builds.js`, `data/builds-1.0.js`). Cette page
résume la **structure** à expliquer aux joueurs.

## Pas de classe figée

- Un **arbre unique** partagé, ouvert avec **H**. On choisit une « classe » en investissant dans une zone de l'arbre ; on
  peut mélanger librement tant que les nœuds sont reliés `[xgs-skills]`.
- **Trois grandes zones** partent d'un anneau central : **Guerrier** (rouge, mêlée), **Mage** (bleu, magie), **Rôdeur**
  (vert, distance) ; l'Athlète / Survivant (mobilité) sert de pont `[xgs-skills]` `[allthings-center]`.
- **12 archétypes**, par groupe :
  - Guerrier : **Warrior** (une main, rogue), **Tank** (bouclier, parade, vitalité), **Barbarian** (deux mains), **Athlete** (endurance, mobilité) ;
  - Mage : **Wizard** (bâtons, sorts élémentaires), **Battlemage** (baguettes, hybride), **Healer** (soins, coop), **Trickster** ;
  - Rôdeur : **Ranger** (arc, tirs multiples), **Assassin** (critiques, et en 1.0 les **dagues**), **Beastmaster** (les Vukah
    deviennent passifs), **Survivor** (récolte, double saut, construction).
- La plupart des builds piochent dans **2 ou 3 archétypes**.

## Attributs (par point) [pré-1.0, d'après le wiki]

| Attribut | Effet | Pour qui |
|---|---|---|
| Constitution | +50 PV | Tank, mêlée |
| Strength | +5 % dégâts de mêlée | Warrior, Barbarian |
| Dexterity | +5 % dégâts arc et dagues | Ranger, Assassin |
| Endurance | +10 endurance | mobilité, mêlée |
| Spirit | +20 mana | Wizard, Battlemage, Healer |
| Intelligence | +5 % dégâts magiques | Wizard, Battlemage |

Chaque attribut de dégâts va de pair avec un attribut de ressource. La Flamme ajoute aussi des points d'attribut à chaque palier.

## Le centre de l'arbre [1.0]

19 compétences sans classe, **50 points** pour tout prendre `[allthings-center]`. Un anneau de **12 nœuds Spark** (0 point)
permet de réapparaître à l'autel.

- 3 rangs : Fisherman's Resolve, **Inner Fires** (+60 s de Shroud/rang), Lumberjack, Mason, Prospector (+10 % dégâts d'outil
  bois / pierre / métal), Opportunity (+40 % Merciless Attack), Power Parry, Saviour (réanimation plus rapide), **Well Rested** (+2 min de Rested).
- 1 rang : **Airborne Architect** (3 pts, nouveau), **Double Jump** (2), Felling Axe / Pickaxe Specialization (2),
  Giant Slayer Hook (3), Grounding Hook (4), **Merciless Attack** (2, 500 % sur un ennemi étourdi, pas aux armes à distance),
  Miner (2), Quality Gear (1), Snap (2, rend 20 % de mana sur Merciless Attack).

Compétences de mobilité jugées prioritaires par les guides : **Double Jump**, **Updraft**, **Airborne** `[htm-mistakes]`.

## Nouveautés 1.0

- 9 nouveaux nœuds (222 → 231), 100 modifiés `[ens-tools-10]`.
- Mage : Advanced Necromancy, Totem Mastery (plafonds d'invocations), Aerial Wand Attack, Wand Evasion Attack, Blast and Cast.
- Rôdeur : Barrage, Puncture, Survival Instinct.
- Dagues : du Guerrier vers l'Assassin. Veteran, One-Handed Specialization, Inner Fires, Snap ajustés.
- **Réinitialisation** de l'arbre au chargement d'une sauvegarde 1.0.
- **Respec** : à l'autel, **1 rune par point dépensé** `[xgs-skills]` `[pd-final-boss]`.

## Méta 1.0 (à croiser avec les builds du site)

- Contre le boss final, tout build avec du **feu** fonctionne ; le **Shroud** est inutile contre les Fell `[pd-final-boss]` `[whisper-vorgoth]`.
- Les tier lists 1.0 (Hack The Minotaur, AoEAH, KeenGamer, G2A) sont déjà sourcées dans `data/sources.js`.
- La presse trouve la magie « faible en ressenti » alors qu'elle est efficace `[pcgames-review]` : un guide « bien démarrer
  en mage » aurait un public.
