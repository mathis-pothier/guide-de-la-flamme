# Procédure d'actualisation des données

Le site **ne se met pas à jour tout seul**. Les données de jeu ne sont modifiées qu'après vérification humaine.
Le seul automatisme est la **détection** des nouvelles annonces officielles.

## 1. Détecter une nouvelle version

```bash
node scripts/check-updates.mjs
```

Le script interroge l'API publique Steam (`ISteamNews`, app 1203620) et liste les annonces publiées depuis la dernière
vérification (marqueur `derniereNewsSteam` dans `data/versions.js`). Les annonces qui ressemblent à un correctif sont marquées ⚑.

Pour l'automatiser, planifiez cette commande (Planificateur de tâches Windows, cron, ou une GitHub Action quotidienne
qui ouvre une issue si une annonce ⚑ apparaît). Elle ne modifie aucune donnée de jeu.

## 2. Lire les notes et identifier l'impact

1. Lire la note officielle (lien affiché par le script) — c'est la référence.
2. Relever ce qui touche : armes/armures/anneaux (valeurs, lieux), compétences (coût, effet, position), sorts, plafonds de niveau.
3. Consulter les sources communautaires, qui se mettent à jour avec quelques jours de retard :
   - wiki : https://enshrouded.wiki.gg (historique de chaque page pour voir la date)
   - PinDrop : https://pindrop.gg/enshrouded (indique ce qui a été vérifié dans les fichiers du jeu)
4. Rechercher dans `data/` les `id` concernés (`grep -rn "nom-de-l-objet" data/`).

## 3. Rafraîchir le catalogue du wiki

La collecte tourne automatiquement deux fois par semaine (GitHub Action « Collecte du wiki ») et propose ses changements dans une pull request : relisez le résumé, puis fusionnez.

Voir « Rafraîchir le catalogue depuis le wiki » dans le README. Le catalogue (`data/catalog.js`) est **généré** : ne jamais le modifier à la main.
Les pages modifiées après la date de sortie 1.0 reçoivent le statut « Wiki après 1.0 » (`w10`) ; changez `RELEASE_10` dans `scripts/build-data.mjs` si une nouvelle version majeure sort.
Après un patch, relire aussi `data/builds-1.0.js` (conseils des guides).

**Niveaux des objets.** Le niveau d'une arme ou d'un anneau trouvé est celui de sa zone : la collecte relit le champ « Biome Level » des pages de biomes du wiki (Springlands, Revelwood…). Le champ « level » des armes du wiki n'est **pas** un niveau d'objet (valeur de calcul des dégâts) : il est conservé à part (`niveauWiki`) et jamais affiché comme niveau. Seuls les niveaux lus dans les fichiers 1.0 (statut `v1`, ex. « 1–55 ») et ceux des armures, boucliers, sorts et anneaux renseignés sur le wiki sont affichés tels quels. Quand le wiki publiera une page Cinder's Cradle, le niveau PinDrop (46–50) sera remplacé automatiquement.

## 3 bis. Modifier les données vérifiées à la main — règles

- **Ne jamais estimer** une valeur manquante : laisser le champ absent.
- Mettre `verifie` à la date du jour **uniquement** pour les entrées réellement revérifiées.
- Statut des objets : `v1` (fichiers ou jeu actuel), `w10` (page wiki modifiée depuis la 1.0, généré), `pre` (ancienne version), `conflit` (+ remplir `conflits`), `guide` (seulement cité).
- Statut des compétences : `wiki`, `modif`, `nouv`, `guide`.
- Une valeur devenue douteuse après un patch passe en `pre` ou `modif` avec une `note`.
- Toute nouvelle source va dans `data/sources.js` (date `consulte`, `miseAJourSource` si connue, `note` sur ses limites).
- Les **recommandations** (builds, `skillRecs`) vont uniquement dans `data/builds.js` ; les données factuelles jamais.

## 4. Enregistrer la version

Dans `data/versions.js` :

1. Ajouter une entrée **en tête** de `window.ENS.versions` (version, date, build, résumé, impact, `etatSite`, sources).
2. Mettre à jour `meta.versionJeu`, `meta.build`, `meta.dateVersion`, `meta.derniereActualisation` et le tableau `couverture`.
3. Si une partie n'a pas encore été revue, l'écrire dans `etatSite` (ex. « Armes : non revérifiées »).

## 5. Valider puis mémoriser

```bash
node scripts/validate.mjs
node scripts/check-updates.mjs --save
```

`validate.mjs` échoue si une source, un objet ou une compétence référencé n'existe pas, si un statut est invalide,
si une date manque, ou si `meta.versionJeu` ne correspond pas à la dernière entrée de l'historique.

Le site affiche automatiquement un avertissement lorsque `derniereActualisation` a plus de 30 jours.

## 6. Carte : points ajoutés par les administrateurs

Les ajouts de l'onglet Carte vivent dans `data/map-points.json` (un commit par action, voir le README, section
« Carte dynamique »). Après une mise à jour du jeu :

- relire les points **En attente** (case « Voir aussi les ajouts en attente et masqués », une fois connecté) et les valider
  ou les supprimer ;
- **masquer** les points dont l'objet ou l'emplacement a changé, puis les corriger ou les supprimer ;
- si le wiki publie un fond de carte 1.0, mettre à jour `data/map.js` (tuiles, taille) puis vérifier les positions saisies
  à la main (elles sont en coordonnées de 0 à 10240 sur le fond actuel).

`validate.mjs` contrôle aussi `data/map-points.json` (champs, identifiants en double) ; la CI `verification.yml` le lance
à chaque push : un fichier corrompu à la main est signalé avant publication.
