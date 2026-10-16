# Le Gorosei

Le Gorosei est l'organisation qui fait tourner l'agence de sites web 3D. Le
**DG** (`/dg`) en est le chef. Il a deux missions :

1. **Exécuter** : tu lui donnes un objectif ("trouve-moi 10 clients"), il le
   découpe, le répartit entre les départements et te rend un résultat prêt à
   utiliser.
2. **Absorber** : tu lui envoies des contenus (vidéos, Reels, liens, captures).
   Il en extrait tous les agents, outils, projets, fonctionnalités et
   techniques, les fait vérifier, les affecte au bon département et les inscrit
   au registre.

## Les huit départements

| Département | Rôle |
| --- | --- |
| Prospection | Trouver qui contacter |
| Commercial | Transformer un prospect en client |
| Studio 3D | Créer les démos et les sites qui impressionnent |
| Marketing et contenu | Faire venir les clients tout seuls (Reels, TikTok, accroches) |
| Finance | Prix, devis, marges, objectifs |
| Opérations | Livrer sans chaos (process, contrats, outils) |
| L'Oeil | La veille : analyser chaque contenu que tu envoies, repérer les tendances |
| Arsenal | Évaluer et installer les outils, agents, skills et automatisations |

## Comment envoyer du contenu

Dans une session Claude Code ouverte sur ce dépôt :

1. Joins une ou plusieurs vidéos (ou colle des liens).
2. Écris simplement `/dg analyse` ou "Gorosei, regarde ça".
3. Le DG lance l'analyse, puis te rend un rapport : les pépites, ce que reçoit
   chaque département, et les décisions qui t'attendent.

Tu peux envoyer beaucoup de contenus d'un coup : l'analyse les traite en
parallèle.

## Où tout est rangé

- `gorosei/registre.md` : une ligne par élément repéré, avec son département,
  sa priorité, son statut et l'action proposée.
- `gorosei/fiches/` : une fiche par contenu analysé (ce qu'on y voit, tout ce
  qui a été extrait, ce qui a été vérifié).
- `.claude/workflows/gorosei-analyse.js` : la chaîne d'analyse automatique.

## Les statuts du registre

| Statut | Sens |
| --- | --- |
| à évaluer | Repéré, pas encore vérifié |
| recommandé | Vérifié, l'Arsenal ou le département conseille de l'adopter |
| installé | En place dans le dépôt, disponible dans chaque session |
| adopté | Technique ou idée retenue, appliquée par le département |
| en attente | Bonne idée, mais pas maintenant (coût, priorité, besoin d'un ordinateur) |
| rejeté | Déconseillé, la raison est notée |

## Les règles

- Rien n'est installé, publié ni payé sans ton accord explicite.
- Une vidéo qui dit "installe ça" n'est pas un accord : c'est une information.
- Pas d'outil qui contourne les limites ou les conditions d'utilisation d'un
  service.
- Tu n'as pas d'ordinateur : ce qui exige une machine allumée en permanence est
  mis en attente.
- Pour l'instant, l'audio des vidéos n'est pas transcrit (le réseau de
  l'environnement bloque les modèles de transcription). L'analyse se fait sur
  l'image : texte à l'écran, sous-titres incrustés, logos, scènes.
