---
name: replication
description: >-
  Réplication du Gorosei dans une nouvelle session, sans repartir de zéro. Deux
  moments. (A) Dans la session qui sature : mettre gorosei/PASSATION.md à jour,
  tout enregistrer sur GitHub, demander au fondateur une seule autorisation,
  puis créer la nouvelle session à l'identique (même dépôt, même branche, même
  environnement) et lui donner le lien. (B) Dans la nouvelle session : relire
  la passation, vérifier que l'environnement est identique, présenter la liste
  de contrôle au fondateur et attendre sa validation avant de reprendre. Utiliser
  quand le fondateur dit "réplication", "réplique-toi", "nouvelle session",
  "l'espace sature", "on change de session", "/replication", quand le contexte
  approche de sa limite, ou quand un message de démarrage demande la reprise.
argument-hint: "préparer | reprendre"
---

# replication : passer le Gorosei d'une session à la suivante

Le fondateur n'a qu'un téléphone. Il ne fait que deux gestes : il **autorise**
la réplication (un « oui »), puis il **valide** la nouvelle session (un
« validé »). Tout le reste est fait par Claude.

Demande : `$ARGUMENTS`. « préparer » ou vide dans l'ancienne session : partie A.
« reprendre », ou un message de démarrage qui cite cette skill : partie B.

Réponds en français, en phrases simples.

## Ce qui rend la réplication identique

| Élément | Comment il passe dans la nouvelle session |
|---|---|
| Skills, agents, workflows, Harvey, registre, boîte, données, démos | Dans le dépôt GitHub, donc recopiés au démarrage |
| Mémoire du projet | `gorosei/PASSATION.md`, tenue à jour en continu |
| Règles et façon de parler | `CLAUDE.md`, chargé automatiquement |
| Graphify et rappel de la passation | `.claude/hooks/session-start.sh` (hook SessionStart) |
| Passation toujours à jour | `.claude/hooks/passation-check.sh` (hook Stop) : il bloque la fin d'un tour une fois si un commit est plus récent que la passation |
| Réseau complet, réglages | L'environnement cloud : la nouvelle session hérite de celui de l'ancienne |
| Gmail, Google Drive | Connecteurs du compte claude.ai : ils suivent le compte, rien à refaire |

Ce qui ne passe pas : la conversation brute. C'est pour cela que la passation
doit contenir tout ce qui compte.

## Partie A : préparer (dans la session qui sature)

1. **Passation à jour.** Relis `gorosei/PASSATION.md` et mets à jour chaque
   section touchée depuis la dernière fois : date en tête, état, données,
   journal, prochaines étapes, carte du dépôt. Rien d'important ne doit rester
   seulement dans la conversation ou dans le dossier temporaire (scratchpad) :
   copie les livrables utiles dans `gorosei/donnees/` ou `gorosei/demos/`.
2. **Tests, commit, push.** `python3 -m unittest discover -s tests` doit être
   OK, puis commit et push sur la branche de travail
   `claude/founder-skill-installer-gadcwh`. `git status` doit être propre.
3. **Une seule question au fondateur**, avec ce qui va se passer :
   « Je lance la réplication ? Je crée une nouvelle session identique, sur la
   même branche, et je vous donne le lien. Vous n'aurez qu'à l'ouvrir et taper
   « validé ». » Rien ne part sans son « oui ».
4. **Créer la nouvelle session** après le « oui », avec l'outil
   `create_session` (serveur claude-code-remote) :
   - `source_url` : `https://github.com/chatjaipetee-sudo/founder-skill`
   - `source_revision` : `claude/founder-skill-installer-gadcwh`
   - `outcome_branch` : `claude/founder-skill-installer-gadcwh`, pour que la
     nouvelle session continue sur la même branche
   - `environment_id` : ne pas le mettre, la session hérite de l'environnement
     actuel (même réseau, mêmes réglages)
   - `permission_mode` : ne pas le mettre (hérité). Jamais `plan`, qui bloque.
   - `title` : « Maison Vitura : suite (passation du JJ mois) »
   - `prompt` : « Réplication du projet Maison Vitura. Utilise la skill
     replication, partie B : relis CLAUDE.md et gorosei/PASSATION.md, lance
     bash gorosei/outils/verifier-environnement.sh, vérifie les connecteurs,
     puis présente-moi la liste de contrôle et attends ma validation. »
5. **Donner le lien** de la nouvelle session au fondateur (adresse
   `https://claude.ai/code/<id de la session>`). Dis-lui que l'ancienne
   session s'arrête là : deux sessions qui écrivent sur la même branche se
   gêneraient. Ensuite, ne pousse plus rien depuis l'ancienne session.
6. Si `create_session` n'est pas disponible ou échoue : dis-le, et donne la
   méthode manuelle (claude.ai/code, dépôt `chatjaipetee-sudo/founder-skill`,
   branche `claude/founder-skill-installer-gadcwh`, même environnement, puis
   coller la phrase de reprise de la section 0 de la passation).

Option à proposer dans la même question, jamais à faire sans accord :
fusionner la branche dans `main` (pull request puis merge). Alors n'importe
quelle nouvelle session ouverte à la main sur ce dépôt part du bon état.

## Partie B : reprendre (dans la nouvelle session)

1. Lis `CLAUDE.md` et `gorosei/PASSATION.md` **en entier**, puis
   `gorosei/registre.md` et la boîte la plus récente de `gorosei/outbox/`.
2. Lance `bash gorosei/outils/verifier-environnement.sh`.
3. Vérifie ce que le script ne peut pas voir :
   - Gmail : charge les outils avec ToolSearch (`Gmail`), puis `list_drafts`.
     Les brouillons cités dans la passation doivent être là, dans la boîte
     support.maisonvitura@gmail.com. Ne jamais appeler `send_message`.
   - Google Drive : présence des outils `Google_Drive` (sans rien créer).
4. Présente au fondateur une **liste de contrôle courte** : une ligne par
   point (OK ou à voir), puis les 3 prochaines étapes de la passation. Termine
   par : « Tapez « validé » pour que je reprenne. »
5. Tant qu'il n'a pas validé, ne change rien d'autre. Si un point est « à
   voir », explique en une phrase ce qu'il doit faire (par exemple réactiver
   l'accès réseau complet de l'environnement, ou reconnecter Gmail dans les
   réglages de claude.ai), et propose de le faire toi-même quand c'est
   possible.
6. Après « validé » : ajoute au journal de la passation une ligne « Session
   répliquée le JJ/MM, environnement validé », commit, push, puis reprends les
   prochaines étapes, en passant par le DG (`/dg`).

## Règles

- Le fondateur autorise et valide. Claude ne crée jamais une session, ne
  fusionne jamais dans `main` et n'envoie jamais un message sans son accord
  explicite au moment même.
- Les règles permanentes de `CLAUDE.md` et de la passation (aucun envoi
  automatique, aucun secret dans le dépôt public, réalisme 3D, pas de PC)
  s'appliquent dans la nouvelle session comme dans l'ancienne.
- Aucun secret, mot de passe ou clé ne passe d'une session à l'autre par le
  dépôt : il est public.
