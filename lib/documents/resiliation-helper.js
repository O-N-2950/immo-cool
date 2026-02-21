/**
 * immocool.ch — Module d'aide à la résiliation
 * 
 * IMPORTANT : L'art. 266l CO impose l'utilisation du FORMULAIRE OFFICIEL
 * agréé par le canton pour la résiliation du bail par le bailleur.
 * 
 * immocool.ch ne génère PAS de formulaire de résiliation.
 * Ce module :
 * 1. Vérifie la validité des dates et délais
 * 2. Génère une lettre d'accompagnement
 * 3. Renvoie vers le formulaire officiel du canton
 */

// Liens vers les formulaires officiels cantonaux
const FORMULAIRES_OFFICIELS = {
  JU: {
    nom: 'Formule agréée par la République et Canton du Jura',
    url: 'https://www.jura.ch/DEN/SDT/Logement.html',
    autorite: 'Service juridique cantonal, Delémont',
    tel: '+41 32 420 51 11',
  },
  VD: {
    nom: 'Formule officielle du Canton de Vaud',
    url: 'https://www.vd.ch/themes/vie-privee/logement/',
    autorite: 'Tribunal des baux du canton de Vaud',
    tel: '+41 21 316 12 00',
  },
  GE: {
    nom: 'Formule officielle du Canton de Genève',
    url: 'https://www.ge.ch/document/avis-resiliation-bail',
    autorite: 'Commission de conciliation en matière de baux et loyers',
    tel: '+41 22 327 93 93',
  },
  NE: {
    nom: 'Formule officielle du Canton de Neuchâtel',
    url: 'https://www.ne.ch/autorites/DJSC/JUST/Pages/accueil.aspx',
    autorite: 'Autorité de conciliation en matière de bail à loyer',
    tel: '+41 32 889 63 25',
  },
  FR: {
    nom: 'Formule officielle du Canton de Fribourg',
    url: 'https://www.fr.ch/institutions-et-droits-politiques/justice/commission-de-conciliation-en-matiere-de-bail-a-loyer',
    autorite: 'Commission de conciliation en matière de bail à loyer',
    tel: '+41 26 305 15 80',
  },
  VS: {
    nom: 'Formule officielle du Canton du Valais',
    url: 'https://www.vs.ch/web/sj/commission-de-conciliation',
    autorite: 'Commission cantonale de conciliation',
    tel: '+41 27 606 29 00',
  },
  BE: {
    nom: 'Formule officielle du Canton de Berne',
    url: 'https://www.justice.be.ch/',
    autorite: 'Schlichtungsbehörde / Autorité de conciliation',
    tel: '+41 31 635 48 48',
  },
  ZH: {
    nom: 'Formule officielle du Canton de Zurich',
    url: 'https://www.zh.ch/de/sicherheit-justiz/schlichtungsbehoerden.html',
    autorite: 'Schlichtungsbehörde in Mietsachen',
    tel: null,
  },
  BS: {
    nom: 'Formule officielle du Canton de Bâle-Ville',
    url: 'https://www.gerichte.bs.ch/',
    autorite: 'Schlichtungsstelle für Mietrecht',
    tel: null,
  },
};

/**
 * Vérifie si une résiliation est valide
 */
export function verifierResiliation(data) {
  const {
    canton = 'JU',
    date_envoi, // Date d'envoi du recommandé
    date_resiliation_souhaitee, // Terme souhaité
    delai_mois = 3, // Délai de préavis en mois
    type_bail = 'habitation', // 'habitation' | 'commercial'
    bailleur = true, // true = bailleur résilie, false = locataire
  } = data;

  const errors = [];
  const warnings = [];

  // Parse dates
  const envoi = new Date(date_envoi);
  const terme = new Date(date_resiliation_souhaitee);
  const aujourd_hui = new Date();

  // 1. Date d'envoi dans le futur ?
  if (envoi < aujourd_hui) {
    warnings.push("La date d'envoi est dans le passé.");
  }

  // 2. Calculer la date limite d'envoi (terme - délai)
  const dateLimite = new Date(terme);
  dateLimite.setMonth(dateLimite.getMonth() - delai_mois);

  if (envoi > dateLimite) {
    errors.push(
      `Le recommandé doit être reçu au plus tard le ${dateLimite.toLocaleDateString('fr-CH')} ` +
      `(${delai_mois} mois avant le terme du ${terme.toLocaleDateString('fr-CH')}). ` +
      `Le délai est insuffisant.`
    );
  }

  // 3. Bailleur : formulaire officiel obligatoire
  if (bailleur) {
    warnings.push(
      "En tant que bailleur, vous DEVEZ utiliser le formulaire officiel agréé par le canton " +
      `(art. 266l CO). Une résiliation par simple lettre est nulle.`
    );
  }

  // 4. Envoi recommandé obligatoire
  warnings.push(
    "La résiliation doit être envoyée par lettre recommandée (art. 266l al. 1 CO)."
  );

  // 5. Couple marié / partenariat : envoi séparé
  warnings.push(
    "Si le locataire est marié ou en partenariat enregistré, un exemplaire séparé doit être " +
    "envoyé à chaque conjoint/partenaire (art. 266n CO)."
  );

  const formulaire = FORMULAIRES_OFFICIELS[canton];

  return {
    valide: errors.length === 0,
    errors,
    warnings,
    dates: {
      envoi: envoi.toLocaleDateString('fr-CH'),
      terme: terme.toLocaleDateString('fr-CH'),
      date_limite_envoi: dateLimite.toLocaleDateString('fr-CH'),
      delai_respecte: envoi <= dateLimite,
    },
    formulaire_officiel: formulaire || {
      nom: `Formulaire officiel du canton ${canton}`,
      url: null,
      autorite: "Se renseigner auprès de l'autorité cantonale compétente",
    },
    rappels_legaux: [
      "Art. 266l CO — Le bailleur doit utiliser une formule agréée par le canton.",
      "Art. 266n CO — Notification séparée à chaque locataire (couple).",
      "Art. 271-271a CO — Le locataire peut contester le congé dans les 30 jours.",
      "Art. 272-272d CO — Le locataire peut demander une prolongation du bail.",
    ],
  };
}

/**
 * Génère une lettre d'accompagnement pour la résiliation
 * (à joindre au formulaire officiel)
 */
export function generateLettreAccompagnement(data) {
  const {
    bailleur_nom = '', bailleur_prenom = '',
    bailleur_adresse = '', bailleur_npa = '', bailleur_ville = '',
    locataire_nom = '', locataire_prenom = '',
    locataire_adresse_actuelle = '', locataire_npa = '', locataire_ville = '',
    immeuble_rue = '', immeuble_numero = '',
    numero_appartement = '',
    date_resiliation = '',
    motif = '',
    lieu = '', date = '',
    canton = 'JU',
  } = data;

  const formulaire = FORMULAIRES_OFFICIELS[canton];

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Lettre d'accompagnement — Résiliation de bail — immocool.ch</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    @page { size: A4; margin: 25mm 20mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; font-size: 10.5pt; line-height: 1.6; color: #1a1a1a; }
    .page { width: 210mm; min-height: 297mm; padding: 25mm 20mm; margin: 0 auto; }
    .expediteur { font-size: 9.5pt; margin-bottom: 30px; }
    .destinataire { margin-bottom: 30px; font-weight: 600; }
    .date-line { text-align: right; margin-bottom: 30px; font-size: 9.5pt; }
    .objet { font-weight: 700; font-size: 11pt; margin-bottom: 20px; }
    .corps p { margin-bottom: 10px; }
    .recommande { display: inline-block; border: 2px solid #C62828; color: #C62828; font-weight: 700; padding: 3px 12px; font-size: 9pt; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
    .warning-box { background: #fff8e1; border-left: 3px solid #C8A55C; padding: 10px 14px; margin: 16px 0; font-size: 9pt; }
    .signature { margin-top: 40px; }
    .footer { margin-top: 50px; padding-top: 10px; border-top: 1px solid #eee; font-size: 7pt; color: #aaa; }
  </style>
</head>
<body>
<div class="page">
  <div class="expediteur">
    ${bailleur_prenom} ${bailleur_nom}<br>
    ${bailleur_adresse}<br>
    ${bailleur_npa} ${bailleur_ville}
  </div>

  <div class="recommande">Recommandé</div>

  <div class="destinataire">
    ${locataire_prenom} ${locataire_nom}<br>
    ${locataire_adresse_actuelle}<br>
    ${locataire_npa} ${locataire_ville}
  </div>

  <div class="date-line">${lieu || bailleur_ville}, le ${date || '________________'}</div>

  <div class="objet">
    Objet : Résiliation du bail — ${immeuble_rue} ${immeuble_numero}, app. ${numero_appartement}
  </div>

  <div class="corps">
    <p>${locataire_civilite || 'Madame, Monsieur'},</p>

    <p>
      Par la présente et conformément au formulaire officiel ci-joint, nous vous signifions la 
      résiliation de votre bail portant sur l'appartement ${numero_appartement} sis 
      ${immeuble_rue} ${immeuble_numero}, pour le <strong>${date_resiliation || '________________'}</strong>.
    </p>

    ${motif ? `<p>Motif de la résiliation : ${motif}</p>` : ''}

    <p>
      Conformément à l'article 271 alinéa 2 du Code des Obligations, nous vous informons que 
      le congé doit être motivé si le locataire le demande. Cette démarche ne suspend pas le 
      délai de 30 jours pour saisir la commission de conciliation compétente.
    </p>

    <div class="warning-box">
      <strong>Vos droits :</strong> Vous disposez de 30 jours dès réception du présent avis pour 
      contester cette résiliation auprès de la commission de conciliation compétente 
      (art. 271 et 271a CO). Vous pouvez également demander une prolongation du bail 
      (art. 272-272d CO). Si aucune démarche n'est entreprise dans ce délai, la résiliation 
      est réputée acceptée.
      ${formulaire ? `<br><br><strong>Autorité compétente :</strong> ${formulaire.autorite}${formulaire.tel ? ` — Tél. ${formulaire.tel}` : ''}` : ''}
    </div>

    <p>
      Nous vous prions de bien vouloir prendre contact avec nous pour organiser l'état des lieux 
      de sortie et la remise des clés.
    </p>

    <p>Nous vous prions d'agréer, ${locataire_civilite || 'Madame, Monsieur'}, nos salutations distinguées.</p>
  </div>

  <div class="signature">
    <p>${bailleur_prenom} ${bailleur_nom}</p>
    <div style="height: 40px;"></div>
    <p style="font-size: 8.5pt; color: #888;">Signature</p>
  </div>

  <div style="margin-top: 24px; font-size: 9pt; color: #555;">
    <strong>Annexe :</strong> Formulaire officiel de résiliation agréé par le canton${canton ? ` de ${canton}` : ''}
  </div>

  <div class="footer">
    Lettre d'accompagnement générée par immocool.ch<br>
    RAPPEL : La résiliation par le bailleur n'est valable que si le formulaire officiel agréé par le canton est joint (art. 266l CO).<br>
    © 2026 immocool.ch
  </div>
</div>
</body>
</html>`;
}

export { FORMULAIRES_OFFICIELS };
