# C204 · 2026 — unité fictive modernisée (simulation 3D)

- Lien jouable : https://passcool17.github.io/c204-2026/?v=5580728
- Dépôt : https://github.com/passcool17/c204-2026 (bot Arcade 3D)
- État : **v0.3.1** — mêmes GLB que la v0.3.0, optimisations au chargement (verre simple, FrontSide, fusion des meshes opaques statiques). Repli primitives si le chargement d'un GLB échoue.
- Lien vers l'app d'origine : [C204 originale (titor-c204)](https://passcool17.github.io/titor-c204/). **Le lien retour dans titor-c204 est à ajouter plus tard** (la remise en ligne de ce dépôt est en pause ; ce dépôt-ci n'y touche pas).
- Cadre : version fictive inspirée du récit de John Titor (document fictif, non vérifié). Aucune machine réelle de ce type n'a été démontrée. Le mode Assemblage est un **guide fictif — pas un vrai plan**.

## Contrôles

- Glisser pour tourner, pincer pour zoomer, toucher une pièce = fiche.
- Boutons (44 px minimum) : **Vue**, **Éclatée**, **Assemblage** (Précédent / Suivant), **Pièces**, **Étiquettes**, **C204 2001** (lien), plein écran.
- Clavier : `V` vue, `E` éclatée, `A` assemblage, `←` / `→` étape précédente / suivante, `L` étiquettes, `P` pièces, `F` ou `F11` plein écran, `Échap` ferme les panneaux.
- Tests : `?demo=explode|assemble|labels`.

## Ressources

- Three.js r170 (licence MIT) via jsDelivr, modules ES + importmap. Chargeurs : GLTFLoader, DRACOLoader, KTX2Loader (transcodeurs jsDelivr).
- Modèles : unité et voiture GLB finales, faites par la chaîne 3D de Pascal (Modélisation → Rig → Rendu), propre au projet, licence originale. Repli primitives si un GLB manque.
- GLB unité : `assets/c204-2026.glb` (1,15 Mo, Draco + WebP, 3 060 triangles, 70 nœuds, 28 clips).
- GLB voiture : `assets/lexus-lc.glb` (v3.2, 147,5 Ko, 151 000 o, Draco + WebP, 11 925 triangles, 46 nœuds, 3 clips : `idle`, `doors_open`, `wheels_roll`). Source et détails : `/workspace/assets3d/c204-2026/MANIFEST.md`.
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

Actions GLB branchées (28 clips, un seul `AnimationMixer`) : `idle` (4 s, boucle, au repos), `lid_open` (1 s, ouvrir le couvercle), `explode` (2 s, vue éclatée), `assemble_01`…`assemble_24` (1,5 s, étapes 1–24), `assemble_all` (8 s). LoopOnce + clampWhenFinished pour tout sauf `idle`. L'étape 25 (vue d'ensemble) revient à la pose finale + `idle`. Si un clip manque, repli sur l'interpolation. Les nœuds sont trouvés par `getObjectByName`, sans supposer qu'ils sont tous enfants directs de la racine (l'écran est enfant du couvercle).

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
| `seat_driver` | Siège conducteur (gauche, +X) |
| `seat_passenger` | Siège passager (droite, −X) |
| `seat_rear_driver` | Banquette arrière côté conducteur |
| `wheel_fl` `wheel_fr` `wheel_rl` `wheel_rr` | Roues (avant gauche, avant droite, arrière gauche, arrière droite) |
| `headlight_l` `headlight_r` | Projecteurs |
| `taillight_l` `taillight_r` | Feux arrière |
| `mirror_l` `mirror_r` | Rétroviseurs (comptent dans la largeur 1,92 m) |
| **`c204_2026_unit`** | **Point d'ancrage** : groupe vide à l'arrière côté passager (−X, −Z). L'unité (`c204_2026_root`) est enfant de ce nœud. |

Position de `c204_2026_unit` (Lexus GLB, espace `lexus_lc_root`) : **x = −0,33 m, y = 0,2981 m, z = −0,88 m** (avant en +Z, côté passager = −X, conducteur à gauche = +X), rotation 0. L'app parent l'unité sur ce nœud (`getObjectByName`), sans hardcoder la position — `MOUNT_POS` (−0,38 ; 0,30 ; −0,92) ne sert que de repli pour la voiture procédurale. L'unité ne traverse ni la caisse ni le coffre. Pas de siège arrière côté passager (la place est prise par l'unité).

Hors-tout visible de la Lexus : **4,771 × 2,10 × 1,341 m** (L × l avec rétros × H). Largeur de caisse 1,92 m hors rétros. Le nœud `soft_top_closed` (capote fermée) reste caché.

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
  "unit": { "url": "assets/c204-2026.glb", "path": "assets/c204-2026.glb", "root": "c204_2026_root" },
  "car":  { "url": "assets/lexus-lc.glb", "path": "assets/lexus-lc.glb", "root": "lexus_lc_root", "mount": "c204_2026_unit" }
}
```

Les deux GLB sont branchés (`url` égal à `path`). Laisser `url` à `null` évite un 404 et déclenche le repli primitives.


## v0.1 — 11 nov. 2026 (provisoire)

- App Three.js r170, dépôt `passcool17/c204-2026`, modèles en primitives (aucun GLB encore : `assets/model.json` a `url: null`).
- Trois modes : Vue (unité dans le cabriolet, à l'arrière côté passager), Éclatée (interpolation des positions), Assemblage à la maison (25 étapes, dont 24 pièces + vue d'ensemble). Bannière « Guide fictif — pas un vrai plan ».
- Lien vers https://passcool17.github.io/titor-c204/. Le lien retour dans titor-c204 est à ajouter plus tard (dépôt en pause, non modifié).
- Dimensions mesurées (primitives) : unité 0,33 × 0,29 × 0,72 m (cible 0,32 × 0,26 × 0,72 ; un peu plus haute à cause de l'écran sur le dessus) ; voiture 1,92 × 1,33 × 4,80 m (cible 1,92 × 1,35 × 4,77). Point d'ancrage `c204_2026_unit` à (−0,38 ; 0,30 ; −0,92).
- Tests Playwright : `/workspace/games3d/c204-2026-tests/t01.js`, 412×915 et 915×412, 54 assertions, 0 échec, 0 erreur console, 0 réponse 404. Captures : `/workspace/games3d/c204-2026-v01.png` (vue) et `c204-2026-v01-assemblage.png` (étape 10).
- Fps réel du S20 et Safari non mesurés (la box rend en logiciel).

## v0.2.0 — 11 nov. 2026

- Unité GLB branchée : `assets/c204-2026.glb` (chaîne 3D de Pascal, propre au projet). `assets/model.json` a `unit.url = "assets/c204-2026.glb"`. Voiture toujours provisoire. Repli primitives si le chargement échoue.
- 28 clips du GLB remplacent l'interpolation : `idle` au repos, `lid_open`, `explode`, `assemble_NN` pour les étapes 1–24, pose finale + `idle` à l'étape 25. Un seul mixer, arrêt/reprise propres, LoopOnce + clampWhenFinished sauf `idle`.
- Ancrage actuel (voiture provisoire) : (−0,38 ; 0,30 ; −0,92), côté passager −X. Échelle du GLB déjà conforme (≈ 0,36 × 0,27 × 0,73 m, avant +Z) — pas de correction. L'ancre exacte de la Lexus finale sera (−0,33 ; 0,2981 ; −0,88).
- Tests Playwright locaux : t01.js 60/60, t02.js 24 fiches en 915×412 et 412×915, 0 erreur console, 0 fiche sans nœud, 0 fiche sous la barre. Captures : `/workspace/games3d/c204-2026-v02.png` (vue, portrait 412×915) et `c204-2026-v02-eclate.png` (vue éclatée).
- Fps réel du S20 et Safari non mesurés (la box rend en logiciel).

## v0.3.0 — 11 nov. 2026

- Voiture GLB branchée : `assets/lexus-lc.glb` v3.2 (chaîne 3D de Pascal, propre au projet ; portes corrigées, plus de clip). `assets/model.json` a `car.url = "assets/lexus-lc.glb"`. Unité inchangée. Repli primitives si le chargement échoue.
- Ancrage par le nœud `c204_2026_unit` du GLB : **(−0,33 ; 0,2981 ; −0,88)**. Position monde de l'unité = position monde du nœud. `MOUNT_POS` conservé seulement pour le repli procédural.
- 3 clips voiture, mixer séparé (les 28 clips de l'unité restent identiques à la v0.2.0) : `idle` en boucle (pose fixe, clés constantes), `doors_open` et `wheels_roll` en LoopOnce + clampWhenFinished. `wheels_roll` en mode Vue, `doors_open` en Éclatée et en Assemblage. `soft_top_closed` reste caché.
- Hors-tout visible : 4,771 × 2,10 × 1,341 m (rétros compris dans la largeur). verify-glb : 0 erreur de validation, 0 erreur console, `doors_open` et `wheels_roll` bougent ; `idle` ne déplace rien (pose fixe acceptée, seul motif du FAIL).
- Tests Playwright locaux : t01.js 70/70, t02.js 24 fiches en 915×412 et 412×915, 0 erreur console, 0 fiche sans nœud, 0 fiche sous la barre. Captures : `/workspace/games3d/c204-2026-v03.png` (vue, portrait 412×915) et `c204-2026-v03-eclate.png` (vue éclatée).
- Fps indicatifs (SwiftShader, pas le S20) : portrait 412×915 Vue 4,8 / Éclatée 4,9 ; paysage 915×412 Vue 6,2 / Éclatée 4,8. Plus bas qu'en v0.2.0 (beaucoup plus d'appels de rendu avec la Lexus). Fps réel du S20 et Safari non mesurés.

## v0.3.1 — 11 nov. 2026

- Pas de ré-export du GLB. Au chargement de la Lexus : le verre `KHR_materials_transmission` + IOR est remplacé par un `MeshStandardMaterial` transparent (opacité 0,35, `depthWrite` false, FrontSide, même teinte) ; les matériaux opaques passent en FrontSide (aucun trou visible, pas besoin de DoubleSide) ; les meshes opaques statiques qui partagent l'atlas sont fusionnés (`mergeGeometries`, transforms cuites dans `lexus_lc_root`). Portes, roues et leurs enfants, `c204_2026_unit` et `convertible_top` restent séparés (clips et masquage). `shadowMap` reste désactivé, `pixelRatio` plafonné à 2.
- Différence visuelle avec la v0.3.0 : le pare-brise et les vitres sont un peu plus « plats » (plus de réfraction ni de second passage de transmission). Peinture, habitacle, unité et ancrage inchangés. Pas de trou.
- Perf SwiftShader (indicatif, pas le S20), avant (v0.3.0 / QA) → après (v0.3.1) :

| Vue | 412×915 | 915×412 | 1280×800 |
|---|---|---|---|
| Vue v0.3.0 | 5,1 · 221 appels · 31 130 tri | 6,4 · 231 appels · 32 218 tri | 2,8 · 231 appels · 32 218 tri |
| Vue v0.3.1 | **22,3** · **86 appels** · **16 177 tri** | **27,8** · 86 appels · 16 177 tri | **14,1** · 86 appels · 16 177 tri |
| Éclatée v0.3.0 | 4,2 · 157 appels | 3,8 · 181 appels | 2,0 · 185 appels |
| Éclatée v0.3.1 | **13,9** · ~83 appels · 16 001 tri | **14,9** | **7,1** |
| Vue v0.2.0 (réf.) | 33,1 · 116 appels · 5 424 tri | 50,4 | 21,1 |

  Les appels de rendu sont sous le niveau v0.2.0 (86 < 116). Les fps remontent d'environ 4 à 5 fois par rapport à la v0.3.0, mais restent sous la v0.2.0 (22 vs 33 en Vue 412) : la Lexus a toujours plus de triangles (≈ 16 k soumis vs 5 424) et trois atlas WebP 1024. Fps réel du S20 non mesuré.
- Tests Playwright : t01.js 81/81 (dont appels ≤ 140 et aucun matériau transmission), t02.js 24 fiches en 915×412 et 412×915, 0 erreur console. Captures : `/workspace/games3d/c204-2026-v031.png` (vue, 412×915) et `c204-2026-v031-eclate.png`.

## Prochaines étapes

- Ajouter plus tard le lien retour depuis titor-c204 (dépôt actuellement en pause).
- Test QA sur le Galaxy S20 de Pascal (fps, tactile). Safari et verrouillage d'orientation non testés.
