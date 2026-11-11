# C204 · 2026 — unité fictive modernisée (simulation 3D)

- Lien jouable : https://passcool17.github.io/c204-2026/?v=d6a536d
- Dépôt : https://github.com/passcool17/c204-2026 (bot Arcade 3D)
- État : **v0.1 provisoire** — modèles en primitives Three.js. Les GLB finaux de la chaîne 3D (Modélisation → Rig → Rendu) se brancheront via `assets/model.json`, sans changer les noms de nœuds.
- Lien vers l'app d'origine : [C204 originale (titor-c204)](https://passcool17.github.io/titor-c204/). **Le lien retour dans titor-c204 est à ajouter plus tard** (la remise en ligne de ce dépôt est en pause ; ce dépôt-ci n'y touche pas).
- Cadre : version fictive inspirée du récit de John Titor (document fictif, non vérifié). Aucune machine réelle de ce type n'a été démontrée. Le mode Assemblage est un **guide fictif — pas un vrai plan**.

## Contrôles

- Glisser pour tourner, pincer pour zoomer, toucher une pièce = fiche.
- Boutons (44 px minimum) : **Vue**, **Éclatée**, **Assemblage** (Précédent / Suivant), **Pièces**, **Étiquettes**, **C204 2001** (lien), plein écran.
- Clavier : `V` vue, `E` éclatée, `A` assemblage, `←` / `→` étape précédente / suivante, `L` étiquettes, `P` pièces, `F` ou `F11` plein écran, `Échap` ferme les panneaux.
- Tests : `?demo=explode|assemble|labels`.

## Ressources

- Three.js r170 (licence MIT) via jsDelivr, modules ES + importmap. Chargeurs : GLTFLoader, DRACOLoader, KTX2Loader (transcodeurs jsDelivr).
- Modèles v0.1 : primitives faites en code (aucune texture externe, aucun logo ni marque). Licence : originale, propriété de Pascal.
- GLB finaux (plus tard) : `/workspace/assets3d/c204-2026/`, source et licence à reporter depuis le MANIFEST.md de la chaîne 3D.
- Textes : inspirés du récit publié par John Titor (2000-2001) et du manuel associé (document fictif, non vérifié) ; modernisation 2026 clairement présentée comme fictive. Aucun schéma électronique réel, aucune instruction dangereuse.

## Noms de nœuds attendus (GLB finaux)

Échelle : 1 unité = 1 mètre. Transformations appliquées. Face avant vers −Y dans Blender (+Z dans Three.js). Origine de l'unité aux pieds (dessous du boîtier). Noms en anglais, stables : ne pas renommer, ne pas retirer.

### Unité — racine `c204_2026_root`

Même forme générale que la C204 d'origine, plus compacte : **0,72 × 0,32 × 0,26 m** (L × l × H, axes Z, X, Y). Écran tactile et LED. Pièces en nœuds séparés, enfants de `c204_2026_root` (groupes admis, le nom utile est sur le nœud listé).

| Nœud | Rôle |
|---|---|
| `c204_2026_root` | Racine de l'unité |
| `housing` | Boîtier principal (coque, dessus ouvert sous le couvercle) |
| `lid` | Couvercle (charnière à l'arrière, −Z) |
| `touchscreen` | Écran tactile 2026 (face avant-haute, visible couvercle fermé) |
| `led_status` | Barrette LED d'état (chant avant du boîtier) |
| `singularity_main_housing` | Logement de singularité principale |
| `singularity_steering_housing` | Logement de singularité de pilotage |
| `field_coil_main_1` `field_coil_main_2` `field_coil_main_3` | Bobines de champ, principale |
| `field_coil_steering_1` `field_coil_steering_2` `field_coil_steering_3` | Bobines de champ, pilotage |
| `mag_field_generator_main` | Générateur / régulateur de champ, principal |
| `mag_field_generator_steering` | Générateur / régulateur de champ, pilotage |
| `electron_injector_manifold` | Collecteur d'injection |
| `electron_regulator` | Régulateur d'électrons |
| `electron_generator` | Générateur d'électrons |
| `radius_sensor_main` | Capteur de rayon, principal |
| `radius_sensor_steering` | Capteur de rayon, pilotage |
| `cooling_housing_main` | Logement de refroidissement, principal |
| `cooling_housing_steering` | Logement de refroidissement, pilotage |
| `cooling_pump` | Pompe de refroidissement |
| `cooling_tank` | Réserve de refroidissement |
| `gravity_sensor_unit` | Capteur de gravité / VGL |
| `cesium_clock_1` `cesium_clock_2` | Horloges au césium (2, plus compactes qu'en 2001) |
| `control_computer` | Ordinateur de contrôle |
| `battery_pack` | Batterie |

Actions GLB prévues, à brancher plus tard : `idle`, `explode` (remplacera l'interpolation écrite dans le code). Pas d'autre action exigée pour v0.1.

### Voiture — racine `lexus_lc_root`

Silhouette de cabriolet générique, **sans aucun logo ni marque** (pas d'emblème, pas de calandre « spindle »). Dimensions extérieures : **4,77 × 1,92 × 1,35 m** (L × l × H). Origine au sol, au milieu de l'empattement (2,87 m). Avant vers +Z (Three.js).

| Nœud | Rôle |
|---|---|
| `lexus_lc_root` | Racine de la voiture |
| `body` | Caisse |
| `hood` | Capot |
| `rear_deck` | Coffre / plage arrière |
| `grille` | Calandre générique à lames horizontales (pas de forme déposée) |
| `bumper_front` `bumper_rear` | Pare-chocs |
| `windshield` | Pare-brise |
| `window_left` `window_right` | Vitres latérales |
| `convertible_top` | Capote repliée (à l'arrière) |
| `dashboard` | Tableau de bord (générique, sans marque) |
| `steering_wheel` | Volant (à gauche, conduite Canada) |
| `seat_driver` | Siège conducteur (gauche, −X) |
| `seat_passenger` | Siège passager (droite, +X) |
| `seat_rear_driver` | Banquette arrière côté conducteur |
| `wheel_fl` `wheel_fr` `wheel_rl` `wheel_rr` | Roues (avant gauche, avant droite, arrière gauche, arrière droite) |
| `headlight_l` `headlight_r` | Projecteurs |
| `taillight_l` `taillight_r` | Feux arrière |
| `mirror_l` `mirror_r` | Rétroviseurs (comptent dans la largeur 1,92 m) |
| **`c204_2026_unit`** | **Point d'ancrage** : groupe vide à l'arrière côté passager (+X, −Z). L'unité (`c204_2026_root`) est enfant de ce nœud. |

Position provisoire de `c204_2026_unit` (espace `lexus_lc_root`) : **x = −0,38 m, y = 0,30 m, z = −0,92 m** (avant en +Z, donc côté passager = −X, conducteur à gauche = +X), rotation 0. L'unité ne traverse ni la caisse ni le coffre. Pas de siège arrière côté passager (la place est prise par l'unité).

Dans l'app : si les deux GLB sont présents, on charge la voiture, on cherche `c204_2026_unit`, et on y place `c204_2026_root` (sauf si l'unité est déjà enfant de ce nœud). Si un GLB est absent (`url` null ou fichier manquant), repli sur les primitives du même nom.

## Ordre d'assemblage (mode « Assemblage à la maison »)

Guide fictif, étape par étape, pièce par pièce. Boutons Précédent / Suivant. La pièce de l'étape est surlignée et vient se placer. Bannière visible : **« Guide fictif — pas un vrai plan »**.

| Étape | Nœuds qui se placent | Titre court |
|---:|---|---|
| 1 | `housing` | Poser le boîtier |
| 2 | `cooling_housing_main` | Logement de refroidissement principal |
| 3 | `cooling_housing_steering` | Logement de refroidissement de pilotage |
| 4 | `cooling_tank` | Réserve de refroidissement |
| 5 | `cooling_pump` | Pompe de refroidissement |
| 6 | `mag_field_generator_main` | Générateur de champ principal |
| 7 | `mag_field_generator_steering` | Générateur de champ de pilotage |
| 8 | `singularity_main_housing` | Logement de singularité principale |
| 9 | `singularity_steering_housing` | Logement de singularité de pilotage |
| 10 | `field_coil_main_1` `field_coil_main_2` `field_coil_main_3` | Bobines de champ principales |
| 11 | `field_coil_steering_1` `field_coil_steering_2` `field_coil_steering_3` | Bobines de champ de pilotage |
| 12 | `electron_generator` | Générateur d'électrons |
| 13 | `electron_regulator` | Régulateur d'électrons |
| 14 | `electron_injector_manifold` | Collecteur d'injection |
| 15 | `gravity_sensor_unit` | Capteur de gravité |
| 16 | `radius_sensor_main` | Capteur de rayon principal |
| 17 | `radius_sensor_steering` | Capteur de rayon de pilotage |
| 18 | `cesium_clock_1` | Première horloge au césium |
| 19 | `cesium_clock_2` | Seconde horloge au césium |
| 20 | `control_computer` | Ordinateur de contrôle |
| 21 | `battery_pack` | Batterie |
| 22 | `touchscreen` | Écran tactile |
| 23 | `led_status` | Barrette LED |
| 24 | `lid` | Fermer le couvercle |
| 25 | _(aucun, vue d'ensemble)_ | Placer l'unité dans le véhicule |

## `assets/model.json`

```json
{
  "unit": { "url": null, "path": "assets/c204-2026.glb", "root": "c204_2026_root" },
  "car":  { "url": null, "path": "assets/lexus-lc.glb", "root": "lexus_lc_root", "mount": "c204_2026_unit" }
}
```

Quand les GLB sont livrés : copier les fichiers dans `assets/` et mettre `url` égal à `path`. Laisser `url` à `null` évite un 404 tant que le fichier n'est pas là.


## v0.1 — 11 nov. 2026 (provisoire)

- App Three.js r170, dépôt `passcool17/c204-2026`, modèles en primitives (aucun GLB encore : `assets/model.json` a `url: null`).
- Trois modes : Vue (unité dans le cabriolet, à l'arrière côté passager), Éclatée (interpolation des positions), Assemblage à la maison (25 étapes, dont 24 pièces + vue d'ensemble). Bannière « Guide fictif — pas un vrai plan ».
- Lien vers https://passcool17.github.io/titor-c204/. Le lien retour dans titor-c204 est à ajouter plus tard (dépôt en pause, non modifié).
- Dimensions mesurées (primitives) : unité 0,33 × 0,29 × 0,72 m (cible 0,32 × 0,26 × 0,72 ; un peu plus haute à cause de l'écran sur le dessus) ; voiture 1,92 × 1,33 × 4,80 m (cible 1,92 × 1,35 × 4,77). Point d'ancrage `c204_2026_unit` à (−0,38 ; 0,30 ; −0,92).
- Tests Playwright : `/workspace/games3d/c204-2026-tests/t01.js`, 412×915 et 915×412, 54 assertions, 0 échec, 0 erreur console, 0 réponse 404. Captures : `/workspace/games3d/c204-2026-v01.png` (vue) et `c204-2026-v01-assemblage.png` (étape 10).
- Fps réel du S20 et Safari non mesurés (la box rend en logiciel).

## Prochaines étapes

- Brancher les GLB finaux (mêmes noms de nœuds) et, s'il est fourni, le clip `explode`.
- Ajouter plus tard le lien retour depuis titor-c204 (dépôt actuellement en pause).
- Test QA sur le Galaxy S20 de Pascal (fps, tactile, son si on en ajoute). Safari et verrouillage d'orientation non testés.
