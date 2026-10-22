export const meta = {
  name: 'gorosei-mobilisation',
  description: 'Mobilisation générale : audit des 6 sites, maquettes 3D par boutique, piques factuelles, vague 2 de prospection, playbook commercial',
  phases: [
    { title: 'Audit', detail: '6 auditeurs, un par boutique' },
    { title: 'Studio', detail: 'maquette, revue anti-template, correction' },
    { title: 'Piques', detail: 'ouvertures factuelles par boutique' },
    { title: 'Prospection', detail: 'vague 2 : les 19 autres fleuristes' },
    { title: 'Playbook', detail: 'appel de présentation, objections, prix, offre' },
  ],
}

const REPO = args.repo
const TMP = args.tmp
const FICHE = `${REPO}/gorosei/fiches/2026-10-21-cold-call-technique-illegale.md`
const CTX = `Tu fais partie du Gorosei, l organisation d agents de Maison Vitura, agence parisienne de sites internet 3D réalistes et animés. Ordre direct du fondateur : énergie maximale, travail de niveau agence surpuissante, aucune approximation. Règles permanentes : n invente aucun fait (chaque fait vient d une source que tu as lue, avec son URL) ; aucun envoi de message à qui que ce soit ; écris en français simple ; aucun tiret long (caractère U+2014) dans les fichiers ; le dépôt GitHub est public, donc aucune donnée personnelle (pas d email ou de téléphone personnel, seulement les coordonnées professionnelles publiées par la boutique).`

const SHOPS = [
  { slug: 'debeaulieu', nom: 'Debeaulieu', site: 'https://www.debeaulieu-paris.com/' },
  { slug: 'lachaume', nom: 'Lachaume', site: 'https://www.lachaume.com/' },
  { slug: 'desiree', nom: 'Désirée (café-fleuriste)', site: 'https://desireefleurs.fr/' },
  { slug: 'flash-fleurs', nom: 'Ateliers Flash Fleurs', site: 'https://www.ateliersflashfleurs.com/' },
  { slug: 'akiko-usami', nom: 'Akiko Usami', site: 'https://www.akiko-usami.com/' },
  { slug: 'boule-de-neige', nom: 'Boule de Neige', site: 'https://www.bouledeneige.fr/' },
]

const AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    boutique: { type: 'string' }, site: { type: 'string' }, plateforme: { type: 'string' },
    poids_total_accueil_mo: { type: 'number' }, nb_requetes: { type: 'number' }, temps_chargement_mobile_s: { type: 'number' },
    referencement: { type: 'string' }, hebergement: { type: 'string' }, mobile: { type: 'string' },
    defauts_verifies: { type: 'array', items: { type: 'object', properties: { defaut: { type: 'string' }, preuve: { type: 'string' }, lien_avec_valeurs: { type: 'string' } }, required: ['defaut', 'preuve', 'lien_avec_valeurs'] } },
    valeurs_et_identite: { type: 'string' },
    faits_marque: { type: 'array', items: { type: 'object', properties: { fait: { type: 'string' }, source_url: { type: 'string' } }, required: ['fait', 'source_url'] } },
    kit_marque: { type: 'object', properties: { couleurs: { type: 'array', items: { type: 'string' } }, typographies: { type: 'array', items: { type: 'string' } }, ton: { type: 'string' }, phrases_cles: { type: 'array', items: { type: 'string' } } }, required: ['couleurs', 'typographies', 'ton', 'phrases_cles'] },
    photos: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, description: { type: 'string' }, largeur: { type: 'number' } }, required: ['url', 'description'] } },
    produits_signature: { type: 'array', items: { type: 'string' } },
    infos_pratiques: { type: 'object', properties: { adresse: { type: 'string' }, horaires: { type: 'string' }, telephone_boutique: { type: 'string' }, instagram: { type: 'string' }, commande_en_ligne: { type: 'string' } }, required: ['adresse', 'horaires', 'telephone_boutique', 'instagram', 'commande_en_ligne'] },
  },
  required: ['boutique', 'site', 'plateforme', 'poids_total_accueil_mo', 'nb_requetes', 'temps_chargement_mobile_s', 'referencement', 'hebergement', 'mobile', 'defauts_verifies', 'valeurs_et_identite', 'faits_marque', 'kit_marque', 'photos', 'produits_signature', 'infos_pratiques'],
}

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['agence surpuissante', 'presque', 'template'] },
    note_sur_10: { type: 'number' },
    corrections: { type: 'array', items: { type: 'string' } },
    inventions_detectees: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict', 'note_sur_10', 'corrections', 'inventions_detectees'],
}

const PIQUE_SCHEMA = {
  type: 'object',
  properties: {
    ouvertures: { type: 'array', items: { type: 'object', properties: { deux_premieres_lignes: { type: 'string' }, technique: { type: 'string' }, fait_utilise: { type: 'string' } }, required: ['deux_premieres_lignes', 'technique', 'fait_utilise'] } },
    objet: { type: 'string' }, j0_propose: { type: 'string' }, controle_j0: { type: 'string' },
  },
  required: ['ouvertures', 'objet', 'j0_propose', 'controle_j0'],
}

const GATE = `cd ${REPO}/gorosei/harvey && python3 -c "import importlib.util,sys; s=importlib.util.spec_from_file_location('gate','harvey/gate.py'); g=importlib.util.module_from_spec(s); s.loader.exec_module(g); r=g.pre_send_check(sys.argv[1], sys.argv[2], open(sys.argv[3],encoding='utf-8').read()); print('OK' if r.ok else 'BLOQUÉ', r.reasons)" "contact@exemple.fr" "<objet>" <fichier>`

const PW = `Pour tester une page, utilise Playwright en Node (require('playwright') fonctionne, Chromium est installé ; ne lance jamais "playwright install") avec un viewport 390x844 et deviceScaleFactor 2 ; enregistre les captures dans ${TMP}/<slug>/ et regarde-les avec l outil Read.`

// Front 1 : par boutique, audit puis studio et piques
const front1 = () => pipeline(SHOPS,
  shop => agent(`${CTX}

Tu es l auditeur du Gorosei pour la boutique ${shop.nom}, site ${shop.site}. Le commercial que le fondateur veut imiter attaque avec un défaut RÉEL du site, en contradiction avec les valeurs du client (lis ${FICHE}, techniques 14 à 19). Ton audit fournit ces munitions et le kit de marque pour le Studio.

Fais un audit réel et prouvé :
- Charge la page d accueil en mobile avec Playwright (Node) : poids total transféré, nombre de requêtes, temps de chargement, erreurs console, affichage sur 390 px (capture dans ${TMP}/${shop.slug}/audit-accueil.png, regarde-la). ${PW}
- Référencement : balise title, meta description, h1, texte alternatif des images, données structurées, présence dans les résultats Google pour "fleuriste" + quartier si tu peux le vérifier.
- Plateforme (Shopify, Wix, WordPress, Squarespace...) d après le code source ; hébergement si tu peux le prouver (en-têtes, DNS public via https://dns.google/resolve?name=..., puis pays de l IP via un service public).
- Valeurs et identité de la boutique, avec leurs propres mots (pages accueil, à propos, presse), et les faits de marque sourcés.
- Kit de marque : couleurs (codes hex relevés dans le CSS), typographies, ton, phrases clés réelles.
- Photos : URLs absolues des meilleures photos de la boutique (bouquets, boutique, ateliers), en haute définition si possible, avec leur description.
- Produits signature, infos pratiques publiées (adresse, horaires, téléphone de la boutique, Instagram, commande en ligne).
Ne garde dans defauts_verifies que des défauts prouvés (chiffre, capture, extrait de code), chacun relié à une valeur de la boutique quand c est honnête.`,
    { label: `audit:${shop.slug}`, phase: 'Audit', schema: AUDIT_SCHEMA }),
  (audit, shop) => {
    if (!audit) return null
    const A = JSON.stringify(audit, null, 1)
    const file = `${REPO}/gorosei/maquettes/${shop.slug}.html`
    const studio = agent(`${CTX}

Tu es développeur senior du Studio 3D. Construis ${file} : la maquette privée de la page d accueil de ${shop.nom}, celle qu Alice dira "avoir déjà dessinée" dans son email. Elle doit faire dire au fleuriste : "c est moi, en mieux".

Audit et kit de marque (JSON) :
${A}

Exigences :
- Réalisme d abord (règle 7 de CLAUDE.md) : les VRAIES photos de la boutique (URLs de l audit) animées au défilement : zoom lent, parallaxe de profondeur en 2 ou 3 plans, fondus, révélations, lumière. Aucune fleur, aucun bouquet ni aucun produit fabriqué en 3D par du code : la démo Corolle a été jugée bon marché le 17/10. Un effet WebGL n est permis que pour la lumière ou le grain, jamais pour un objet.
- Identité : couleurs et typographies de la marque, leurs phrases réelles, leurs produits signature, leurs infos pratiques réelles. Aucune invention : pas d avis client, pas de prix, pas de récompense, pas de chiffre qui ne vienne de l audit.
- Mobile d abord (390 px), marge latérale de 16 px, aucun défilement horizontal, texte lisible, prefers-reduced-motion respecté, fluide.
- Un seul fichier HTML. Scripts uniquement depuis cdnjs.cloudflare.com avec une version exacte (par exemple three.js r128, gsap 3.12.5) ; polices Google Fonts ; aucune autre ressource externe, sauf les photos de la boutique, toutes déclarées dans une constante en tête du script : const PHOTOS = [ ... ] (elles seront intégrées au moment de la publication privée) et utilisées seulement via cette constante.
- Balise title de 2 à 4 mots (le nom de la boutique) ; couleurs en variables CSS sur :root ; fond explicite sur body ; un bloc @media (prefers-color-scheme: dark) avec :root:not([data-theme="light"]) qui redéfinit les variables (version sombre de la marque), et la même chose sous :root[data-theme="dark"].
- Bandeau discret en bas : "Maquette privée préparée par Maison Vitura pour ${shop.nom}. Photos et textes : ${shop.nom}."
${PW} Prends des captures en haut, au milieu et en bas, regarde-les, et améliore jusqu à ce que ce soit vraiment beau. Aucune erreur console. Rends un court compte rendu.`,
      { label: `studio:${shop.slug}`, phase: 'Studio', agentType: 'Senior Developer' })
      .then(() => agent(`${CTX}

Tu es le relecteur sans complaisance du Studio. Ouvre ${file} avec Playwright, captures à 5 positions de défilement (0 %, 25 %, 50 %, 75 %, 100 %) dans ${TMP}/${shop.slug}/revue-*.png, et regarde-les. ${PW}
Juge : est-ce que ça fait "agence surpuissante" ou "template" ? Réalisme (aucune 3D bon marché) ? Identité de ${shop.nom} respectée (comparer au kit ci-dessous) ? Lisibilité et fluidité sur téléphone ? Erreurs console ? Une information inventée par rapport à l audit ? Règles techniques (une seule constante PHOTOS, scripts cdnjs versionnés, variables :root, mode sombre, bandeau) ?
Audit (JSON) : ${A}
Ne modifie rien. Rends ton verdict et des corrections précises, classées de la plus importante à la moins importante.`,
        { label: `revue:${shop.slug}`, phase: 'Studio', agentType: 'UI Finish-Gate Reviewer', schema: REVIEW_SCHEMA }))
      .then(rev => rev ? agent(`${CTX}

Applique ces corrections du relecteur à ${file}, de la plus importante à la moins importante, puis reteste avec Playwright et regarde les captures. Verdict : ${rev.verdict} (${rev.note_sur_10}/10).
Corrections : ${JSON.stringify(rev.corrections)}
Inventions à retirer : ${JSON.stringify(rev.inventions_detectees)}
${PW} Rends un compte rendu : ce qui a été corrigé, et la note que tu donnerais maintenant.`,
        { label: `correction:${shop.slug}`, phase: 'Studio', agentType: 'Senior Developer' }).then(fix => ({ revue: rev, correction: fix })) : null)

    const pique = agent(`${CTX}

Tu es Alice, commerciale senior de Maison Vitura. Lis ${FICHE} en entier (les deux Reels). Voici l audit réel du site de ${shop.nom} (JSON) :
${A}

Écris 3 ouvertures différentes (les deux premières lignes de l email) qui frappent comme le commercial des Reels : une pique fondée sur un défaut PROUVÉ de l audit, reliée aux valeurs de la boutique, avec ses propres mots ; le miroir de l identité ; aucune attaque contre la personne ; aucune blague sur l identité. Puis un J0 complet : 75 mots au plus hors signature, objet de 2 à 6 mots en minuscules sans le nom de la boutique, une seule demande minuscule avec choix alternatif ou question de curiosité, le levier "Alice a déjà dessiné votre page d accueil, en mouvement, avec vos propres photos" (la maquette existe : gorosei/maquettes/${shop.slug}.html ; ne dis pas « 3D » : ce sont des photos animées), aucun lien, aucun "je me permets", aucun conditionnel mou, pas de point d exclamation. Signature : "Alice" puis "Commerciale senior, Maison Vitura", puis la ligne : Pour ne plus recevoir de message de ma part, répondez simplement « stop ».
Vérifie le J0 avec la porte de contrôle (écris-le dans ${TMP}/${shop.slug}-j0.txt) : ${GATE}`,
      { label: `pique:${shop.slug}`, phase: 'Piques', agentType: 'Sales Outreach', schema: PIQUE_SCHEMA })

    return parallel([() => studio, () => pique]).then(([s, p]) => ({ slug: shop.slug, audit, studio: s, pique: p }))
  })

// Front 2 : vague 2 de prospection
const VAGUE_SCHEMA = {
  type: 'object',
  properties: { prospects: { type: 'array', items: { type: 'object', properties: {
    nom: { type: 'string' }, tier: { type: 'string' }, site: { type: 'string' }, site_ok: { type: 'boolean' },
    email_generique: { type: 'string' }, formulaire: { type: 'string' }, instagram: { type: 'string' },
    defauts_verifies: { type: 'array', items: { type: 'object', properties: { defaut: { type: 'string' }, preuve: { type: 'string' } }, required: ['defaut', 'preuve'] } },
    valeurs: { type: 'string' }, statut: { type: 'string', enum: ['prêt à écrire', 'à compléter', 'écarté'] }, notes: { type: 'string' },
  }, required: ['nom', 'tier', 'site', 'site_ok', 'email_generique', 'formulaire', 'instagram', 'defauts_verifies', 'valeurs', 'statut', 'notes'] } } },
  required: ['prospects'],
}
const DEJA = SHOPS.map(s => s.nom).join(', ')
const front2 = () => parallel([[0, 8], [9, 16], [17, 24]].map(([a, b]) => () =>
  agent(`${CTX}

Tu es prospecteur du Gorosei. Le fichier ${REPO}/gorosei/donnees/verification-25-fleuristes-2026-10-17.json contient 25 fleuristes de Paris (clé "resultat"). Prends ceux d indice ${a} à ${b} (ordre du fichier, en partant de 0), en ignorant ceux déjà traités : ${DEJA}.
Le 17 octobre, le réseau était limité : beaucoup de sites semblaient injoignables alors qu ils marchent. Pour chacun, maintenant que le réseau est complet :
- vérifie le site (curl -L, et Playwright en Node si besoin) ;
- trouve un contact professionnel public : email générique publié par la boutique (contact@, bonjour@, info@, boutique@...), sinon formulaire de contact, sinon compte Instagram de la boutique. Jamais d adresse personnelle ;
- relève 1 ou 2 défauts PROUVÉS du site (poids, lenteur sur mobile, référencement, mise en page sur téléphone, absence de commande en ligne...) ;
- résume ses valeurs avec ses propres mots.
Statut "prêt à écrire" seulement si un contact public est confirmé et au moins un défaut prouvé.`,
    { label: `prospection:${a}-${b}`, phase: 'Prospection', agentType: 'Sales Outreach', schema: VAGUE_SCHEMA })))

// Front 3 : playbook commercial
const SPECS = [
  { key: 'appel', type: 'Discovery Coach', ask: 'le script complet de l appel ou de la visio de 5 minutes où Alice montre la maquette au fleuriste : ouverture, présentation de la maquette écran par écran, 3 questions de découverte, passage au prix, conclusion avec un choix alternatif de prochaine étape. Dans l énergie et l assurance des Reels.' },
  { key: 'objections', type: 'Sales Coach', ask: 'les réponses aux objections des fleuristes, en email et à l oral : "c est combien", "je n ai pas le temps", "j ai déjà un site", "mon neveu s en occupe", "Instagram me suffit", "la 3D c est un gadget", "on verra après les fêtes", "envoyez-moi une plaquette". Chaque réponse courte, sûre d elle, qui ramène vers la maquette.' },
  { key: 'prix', type: 'Pricing Analyst', ask: 'les vrais prix du marché en France (sources avec URL, recherche web) pour : un site vitrine de fleuriste, un site e-commerce de fleuriste, un site premium animé ou 3D par une agence. Le Reel annonce "+2997 €" pour un site refait : c est un repère non vérifié, à confronter aux sources. Propose une échelle de prix en trois niveaux pour Maison Vitura et un prix d ouverture à tester, sans rien inventer.' },
  { key: 'offre', type: 'Offer & Lead Gen Strategist', ask: 'l offre irrésistible pour un fleuriste parisien : ce qui est livré, en combien de temps, une garantie que l agence peut tenir, des bonus honnêtes, une urgence réelle (Toussaint le 1er novembre, fêtes de fin d année, Saint-Valentin), un nom d offre. Lis aussi ${REPO}/skills/founder-offer/SKILL.md pour la méthode.' },
]
const front3 = () => parallel(SPECS.map(s => () =>
  agent(`${CTX}\n\nLis ${FICHE}. Ta mission : ${s.ask}\nRends un texte prêt à intégrer, en français simple.`,
    { label: `playbook:${s.key}`, phase: 'Playbook', agentType: s.type }).then(t => t ? { key: s.key, texte: t } : null)))
  .then(parts => agent(`${CTX}

Assemble ces contributions en un seul document ${REPO}/gorosei/commercial/playbook-fleuristes.md (crée le dossier) : sommaire, puis 1. L offre, 2. Les prix, 3. Le script de l appel de 5 minutes, 4. Les objections. Garde chaque source avec son URL. Supprime toute invention non sourcée. Aucun tiret long. Contributions (JSON) :
${JSON.stringify(parts.filter(Boolean), null, 1)}
Rends un résumé de 10 lignes.`, { label: 'playbook:assemblage', phase: 'Playbook' }))

const [shops, vague2, playbook] = await parallel([front1, front2, front3])
return { shops, vague2: (vague2 || []).filter(Boolean).flatMap(v => v.prospects), playbook }