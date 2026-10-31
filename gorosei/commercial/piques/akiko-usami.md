> **À NE PAS ENVOYER EN L'ÉTAT.** Maquette à relire avant tout envoi, et envoi validé par le fondateur (voir `gorosei/PASSATION.md`, journal du 31/10).

# Akiko Usami : piques et séquence

Date : 2026-10-30. Canal : formulaire https://www.akiko-usami.com/contact/ (le fondateur envoie lui-même, rien n'a été envoyé).
Source des défauts : gorosei/audits/akiko-usami.json (defauts_verifies).

ATTENTION, à lever avant tout envoi : aucune maquette Akiko Usami n'existe dans gorosei/maquettes/ (vérifié le 30/10/2026). La phrase « J'ai déjà préparé votre page d'accueil » et le détail du J+3 ne sont vrais qu'une fois la maquette faite, avec ses photos publiques, et le menu visible dès l'arrivée. Sinon, ne pas envoyer (règle 3 de CLAUDE.md et règle 4 de « Puissance d'ouverture »).

Exclus volontairement : « grands hôtels parisiens », toute rue, le sujet des traceurs et mentions légales.

## 1. Trois ouvertures (deux premières lignes)

A. Nom rempli par l'image de démonstration (retenue)
« Je me demandais comment, sur votre site, votre nom sous « Designer. » peut être rempli par l'image de démonstration du thème, et non par une de vos fleurs.
Pour « l'art de faire vivre les fleurs », ce détail compte. »
Preuve : --text-mask-background-image vers placeholder-image-01-6.jpg (« Mila Albrecht Placeholder image »).

B. Menu invisible sur téléphone
« Je me demandais comment un site aussi soigné que le vôtre arrive sur téléphone sans aucun menu visible : ni Ikebana, ni Wafuka, ni Contact avant de faire défiler.
Pour « son sens de l'écoute », le premier geste du visiteur ne mène nulle part. »
Preuve : capture accueil-haut-10s-iphone.png, div.head-meta opacity 0 à scrollY 0.

C. Logo appelé depuis un site de test disparu
« Je me demandais comment votre page d'accueil peut encore demander votre logo à test.akiko-usami.com, un site de test qui n'existe plus.
Vous dites que « c'est la simplicité » qui vous a plu dans l'ikebana : ce reste de chantier, lui, se voit dans la page. »
Preuve : img src vers test.akiko-usami.com, NXDOMAIN chez dns.google, erreur console.

## 2. J0 retenu

Objet : votre nom en image de démonstration

Bonjour Madame Usami,

Je me demandais comment, sur votre site, votre nom sous « Designer. » peut être rempli par l'image de démonstration du thème, et non par une de vos fleurs.
Pour « l'art de faire vivre les fleurs », ce détail compte.

C'est de la prospection, je le dis tout de suite. J'ai déjà préparé votre page d'accueil, en mouvement, avec vos propres photos.

Seriez-vous curieuse de la voir, 5 minutes, jeudi ou vendredi ?

L'équipe de Maison Vitura
support.maisonvitura@gmail.com
Pour ne plus recevoir de message de ma part, répondez simplement « stop ».

## 3. J+3

Objet : votre nom, avec vos fleurs

Bonjour Madame Usami,

Un détail de la page préparée : votre nom se remplit enfin de vos fleurs, la vignette wafuka et son anneau de tiges, qui bougent lentement à l'ouverture.
Et le menu se voit dès l'arrivée sur téléphone.

Seriez-vous curieuse de la voir, 5 minutes, mardi ou mercredi ?

L'équipe de Maison Vitura
support.maisonvitura@gmail.com
Pour ne plus recevoir de message de ma part, répondez simplement « stop ».

Élément nouveau : détail de la maquette (nom rempli par la vignette wafuka, anneau de tiges, photo publique 10-1000x750.jpg ; menu visible). À réaliser tel quel dans la maquette avant envoi.

## 4. J+7

Objet : votre page reste prête

Bonjour Madame Usami,

Je ne vous écrirai plus à ce sujet.
La page d'accueil préparée avec vos photos reste disponible.

Préférez-vous la voir ce mois-ci, ou que je revienne au printemps ?

L'équipe de Maison Vitura
support.maisonvitura@gmail.com
Pour ne plus recevoir de message de ma part, répondez simplement « stop ».

## 5. Contrôles (porte gorosei/harvey/harvey/gate.py, destinataire contact@exemple.fr)

| Message | Objet | Résultat | Mots hors signature (wc, guillemets comptés) | Limite |
|---|---|---|---|---|
| J0 | votre nom en image de démonstration | OK [] | 74 | 75 |
| J+3 | votre nom, avec vos fleurs | OK [] | 50 | 60 |
| J+7 | votre page reste prête | OK [] | 31 | 40 |

Vérifié à la main : aucun lien, aucun prix, aucun « je me permets », aucun conditionnel mou, aucun point d'exclamation, une seule demande avec deux moments, objets en minuscules sans son nom.
