/**
 * immocool.ch — État des lieux d'entrée / sortie
 * 
 * FORMULAIRE ORIGINAL immocool.ch
 * Conforme à l'art. 256 CO (obligation de délivrance)
 * et art. 267-267a CO (restitution)
 * 
 * Fonctionnalité clé : génération dynamique des pièces
 * selon la configuration réelle de l'appartement.
 */

const ELEMENTS_PAR_PIECE = {
  'Entrée / Hall': [
    'Porte d\'entrée (serrure, poignée, seuil)',
    'Murs et plafond',
    'Sol',
    'Éclairage',
    'Interrupteurs et prises',
    'Porte-manteau / patère (si présent)',
  ],
  'Salon / Séjour': [
    'Murs et plafond',
    'Sol (parquet / carrelage / moquette)',
    'Fenêtres (vitrages, cadres, joints)',
    'Volets / stores',
    'Radiateurs / chauffage',
    'Éclairage',
    'Interrupteurs et prises',
  ],
  'Cuisine': [
    'Murs et plafond',
    'Sol (carrelage)',
    'Plan de travail',
    'Évier et robinetterie',
    'Placards / meubles de cuisine',
    'Four / cuisinière / plaques',
    'Hotte aspirante (filtre)',
    'Réfrigérateur / congélateur',
    'Lave-vaisselle (si présent)',
    'Éclairage',
    'Interrupteurs et prises',
  ],
  'Chambre': [
    'Murs et plafond',
    'Sol (parquet / carrelage / moquette)',
    'Fenêtres (vitrages, cadres, joints)',
    'Volets / stores',
    'Radiateurs / chauffage',
    'Placards intégrés (si présents)',
    'Éclairage',
    'Interrupteurs et prises',
  ],
  'Salle de bains': [
    'Murs et plafond',
    'Sol (carrelage)',
    'Carrelage mural / faïence',
    'Lavabo et robinetterie',
    'Baignoire / douche et robinetterie',
    'WC (cuvette, chasse d\'eau, abattant)',
    'Miroir',
    'Meubles de salle de bains',
    'Ventilation / VMC',
    'Éclairage',
    'Interrupteurs et prises',
    'Joints silicone',
  ],
  'WC séparé': [
    'Murs et plafond',
    'Sol',
    'WC (cuvette, chasse d\'eau, abattant)',
    'Lave-mains et robinetterie',
    'Éclairage',
    'Ventilation',
  ],
  'Balcon / Terrasse': [
    'Porte-fenêtre d\'accès',
    'Sol (carrelage / béton / bois)',
    'Garde-corps / rambarde',
    'Évacuation d\'eau',
  ],
  'Cave / Réduit': [
    'Porte et serrure',
    'Murs et plafond',
    'Sol',
    'Éclairage',
  ],
  'Buanderie': [
    'Accès',
    'Raccordements machine à laver',
    'Étendage / séchoir',
    'Éclairage',
  ],
  'Garage / Parking': [
    'Porte / portail / télécommande',
    'Sol',
    'Éclairage',
    'Prise électrique',
  ],
};

export function generateEtatDesLieux(data) {
  const {
    type = 'entree', // 'entree' | 'sortie'
    date_etat_lieux = '',
    // Bien
    immeuble_rue = '', immeuble_numero = '',
    immeuble_npa = '', immeuble_ville = '',
    numero_appartement = '', surface = '', nombre_pieces = '',
    etage = '',
    // Bailleur
    bailleur_nom = '', bailleur_prenom = '',
    bailleur_adresse = '', bailleur_npa = '', bailleur_ville = '',
    bailleur_tel = '',
    // Locataire
    locataire_nom = '', locataire_prenom = '',
    locataire_adresse = '', locataire_npa = '', locataire_ville = '',
    locataire_tel = '', locataire_email = '',
    // Locataire sortant (pour sortie)
    locataire_sortant_nom = '', locataire_sortant_prenom = '',
    nouvelle_adresse = '',
    // Pièces : tableau dynamique
    pieces = null,
    // Clés
    cles = [
      { description: 'Clés appartement', quantite: '' },
      { description: 'Clé boîte aux lettres', quantite: '' },
      { description: 'Clé cave', quantite: '' },
      { description: 'Badge / télécommande', quantite: '' },
    ],
    // Compteurs
    compteurs = [
      { type: 'Électricité', numero: '', index: '' },
      { type: 'Eau froide', numero: '', index: '' },
      { type: 'Eau chaude', numero: '', index: '' },
    ],
    // Canton
    canton = 'JU',
    // Signature
    lieu_signature = '',
  } = data;

  const isEntree = type === 'entree';
  const title = isEntree ? "ÉTAT DES LIEUX D'ENTRÉE" : "ÉTAT DES LIEUX DE SORTIE";

  // Build rooms list dynamically or use defaults
  const defaultPieces = [
    'Entrée / Hall', 'Salon / Séjour', 'Cuisine',
    ...Array.from({ length: Math.max(1, parseInt(nombre_pieces) - 2 || 1) }, (_, i) => `Chambre ${i + 1}`),
    'Salle de bains', 'WC séparé', 'Balcon / Terrasse', 'Cave / Réduit',
  ];
  const piecesList = pieces || defaultPieces;

  function getElements(pieceName) {
    // Match base name (e.g., "Chambre 1" → "Chambre")
    const baseName = Object.keys(ELEMENTS_PAR_PIECE).find(k => pieceName.startsWith(k));
    return ELEMENTS_PAR_PIECE[baseName] || ELEMENTS_PAR_PIECE['Chambre'];
  }

  function renderPieceTable(pieceName, index) {
    const elements = getElements(pieceName);
    return `
    <div class="section-wrapper">
      <h2>${index}. ${pieceName.toUpperCase()}</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 35%;">Élément</th>
            <th style="width: 13%;">État</th>
            <th style="width: 52%;">Observations / Photos</th>
          </tr>
        </thead>
        <tbody>
          ${elements.map(el => `
          <tr>
            <td>${el}</td>
            <td class="state-cell"></td>
            <td></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }

  // Calculate page breaks (approx 5-6 sections per page)
  const sections = piecesList.map((p, i) => renderPieceTable(p, i + 1));

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title} — ${locataire_prenom} ${locataire_nom} — immocool.ch</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    @page { size: A4 portrait; margin: 12mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; font-size: 9pt; line-height: 1.4; color: #1a1a1a; background: #fff; }

    .page { width: 210mm; min-height: 297mm; padding: 12mm 15mm; margin: 0 auto; background: #fff; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 2px solid ${isEntree ? '#2E7D32' : '#C62828'}; margin-bottom: 14px; }
    .logo { display: flex; align-items: center; gap: 6px; }
    .logo-icon { width: 22px; height: 22px; background: #FF0000; border-radius: 3px; }
    .logo-text { font-family: 'Playfair Display', serif; font-size: 13pt; font-weight: 700; }
    .logo-text span { color: #C8A55C; }
    .type-badge { background: ${isEntree ? '#E8F5E9' : '#FFEBEE'}; color: ${isEntree ? '#2E7D32' : '#C62828'}; font-size: 8pt; font-weight: 700; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; }

    /* Title */
    .title { font-family: 'Playfair Display', serif; font-size: 17pt; font-weight: 700; text-align: center; margin-bottom: 12px; }

    /* Info boxes */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .info-box { border: 1px solid #d0d0d0; border-radius: 6px; padding: 8px 10px; }
    .info-box.full { grid-column: 1 / -1; }
    .info-label { font-size: 7pt; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .info-value { font-size: 9.5pt; font-weight: 600; }
    .info-detail { font-size: 8pt; color: #555; }

    /* Sections */
    .section-wrapper { margin-bottom: 12px; page-break-inside: avoid; }
    h2 { font-family: 'DM Sans', sans-serif; font-size: 10pt; font-weight: 700; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; padding: 5px 10px; margin-bottom: 6px; page-break-after: avoid; }

    /* Tables */
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 8.5pt; }
    thead { display: table-header-group; }
    th { background: #f0f0f0; border: 1px solid #ccc; padding: 4px 6px; text-align: left; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
    td { border: 1px solid #ddd; padding: 5px 6px; vertical-align: top; min-height: 22px; }
    tr { page-break-inside: avoid; }
    .state-cell { text-align: center; font-size: 8pt; }

    /* Compteurs */
    .compteur-table td { min-height: 18px; }

    /* Signature */
    .sig-section { display: flex; justify-content: space-between; gap: 20px; margin-top: 20px; page-break-inside: avoid; }
    .sig-block { flex: 1; border: 1px solid #ccc; border-radius: 6px; padding: 10px; }
    .sig-label { font-size: 7pt; color: #888; text-transform: uppercase; margin-bottom: 2px; }
    .sig-name { font-size: 10pt; font-weight: 700; margin-bottom: 25px; }
    .sig-line { border-top: 1px solid #999; padding-top: 3px; font-size: 7pt; color: #999; }

    /* Legend */
    .legend { font-size: 7.5pt; color: #666; margin: 10px 0; padding: 8px; background: #fafafa; border-radius: 4px; }
    .legend strong { color: #333; }

    /* Footer */
    .footer { margin-top: 16px; padding-top: 8px; border-top: 1px solid #e0e0e0; font-size: 6.5pt; color: #aaa; text-align: center; }

    @media print {
      .page { margin: 0; padding: 10mm 13mm; }
      h2 { background: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon"></div>
      <div class="logo-text">immo<span>.cool</span></div>
    </div>
    <div class="type-badge">${isEntree ? '▶ Entrée' : '◀ Sortie'}</div>
  </div>

  <div class="title">${title}</div>

  <!-- Informations générales -->
  <div class="info-grid">
    <div class="info-box">
      <div class="info-label">Date</div>
      <div class="info-value">${date_etat_lieux || '____________________'}</div>
    </div>
    <div class="info-box">
      <div class="info-label">Adresse du bien</div>
      <div class="info-value">${immeuble_rue} ${immeuble_numero}, ${immeuble_npa} ${immeuble_ville}</div>
    </div>
    <div class="info-box">
      <div class="info-label">Bailleur</div>
      <div class="info-value">${bailleur_prenom} ${bailleur_nom}</div>
      <div class="info-detail">${bailleur_tel}</div>
    </div>
    <div class="info-box">
      <div class="info-label">Locataire ${!isEntree ? 'sortant' : ''}</div>
      <div class="info-value">${isEntree ? `${locataire_prenom} ${locataire_nom}` : `${locataire_sortant_prenom || locataire_prenom} ${locataire_sortant_nom || locataire_nom}`}</div>
      <div class="info-detail">${locataire_tel}${!isEntree && nouvelle_adresse ? ` — Nouvelle adresse : ${nouvelle_adresse}` : ''}</div>
    </div>
    <div class="info-box" style="display: flex; gap: 20px;">
      <div><div class="info-label">App. N°</div><div class="info-value">${numero_appartement}</div></div>
      <div><div class="info-label">Pièces</div><div class="info-value">${nombre_pieces}</div></div>
      <div><div class="info-label">Surface</div><div class="info-value">${surface} m²</div></div>
      <div><div class="info-label">Étage</div><div class="info-value">${etage}</div></div>
    </div>
  </div>

  <!-- Légende -->
  <div class="legend">
    <strong>Légende des états :</strong>
    <strong>N</strong> = Neuf · <strong>TB</strong> = Très bon · <strong>B</strong> = Bon · <strong>M</strong> = Moyen · <strong>U</strong> = Usé / À réparer ·
    Indiquer les observations et dégâts constatés. Joindre des photos si possible.
  </div>

  <!-- Clés -->
  <div class="section-wrapper">
    <h2>REMISE DES CLÉS ET ACCÈS</h2>
    <table>
      <thead>
        <tr><th style="width: 50%;">Description</th><th style="width: 15%;">Quantité</th><th style="width: 35%;">N° / Observations</th></tr>
      </thead>
      <tbody>
        ${cles.map(c => `<tr><td>${c.description}</td><td class="state-cell">${c.quantite}</td><td></td></tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- Pièces dynamiques -->
  ${sections.join('\n')}

  <!-- Compteurs -->
  <div class="section-wrapper">
    <h2>${piecesList.length + 1}. RELEVÉS DES COMPTEURS</h2>
    <table class="compteur-table">
      <thead>
        <tr><th style="width: 30%;">Compteur</th><th style="width: 25%;">N° compteur</th><th style="width: 22%;">Index ${isEntree ? "à l'entrée" : "à la sortie"}</th><th style="width: 23%;">Observations</th></tr>
      </thead>
      <tbody>
        ${compteurs.map(c => `<tr><td>${c.type}</td><td>${c.numero}</td><td>${c.index}</td><td></td></tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- Observations -->
  <div class="section-wrapper">
    <h2>${piecesList.length + 2}. OBSERVATIONS GÉNÉRALES</h2>
    <table>
      <tr><td style="min-height: 30px;"><strong>Propreté générale :</strong></td></tr>
      <tr><td style="min-height: 30px;"><strong>${isEntree ? 'Travaux à réaliser avant entrée :' : 'Travaux / réparations à charge du locataire sortant :'}</strong></td></tr>
      <tr><td style="min-height: 40px;"><strong>Autres remarques :</strong></td></tr>
    </table>
  </div>

  <!-- État général -->
  <div class="section-wrapper">
    <h2>${piecesList.length + 3}. ÉTAT GÉNÉRAL DU LOGEMENT</h2>
    <div style="padding: 8px; display: flex; gap: 24px; font-size: 9pt;">
      <label>☐ Excellent</label>
      <label>☐ Très bon</label>
      <label>☐ Bon</label>
      <label>☐ Moyen</label>
      <label>☐ À rénover</label>
    </div>
  </div>

  ${!isEntree ? `
  <!-- Montant des réparations (sortie) -->
  <div class="section-wrapper">
    <h2>${piecesList.length + 4}. DÉCOMPTE DES RÉPARATIONS</h2>
    <div style="padding: 8px; font-size: 8.5pt;">
      <p>Montant estimé des réparations à charge du locataire : CHF ________________.-</p>
      <p style="margin-top: 6px; font-size: 7.5pt; color: #666;">
        Conformément à l'art. 267a CO, le bailleur doit signaler immédiatement au locataire les défauts constatés, 
        sous peine de perdre ses droits. Le présent procès-verbal vaut comme reconnaissance de dette au sens de l'art. 82 LP.
        Sans nouvelles écrites du locataire entrant <strong>dans les dix jours</strong>, les réserves sont liquidées à son entière satisfaction.
      </p>
    </div>
  </div>` : ''}

  <!-- Signatures -->
  <div style="margin-top: 12px; font-size: 9pt;">
    <strong>Fait à ${lieu_signature || '________________'}, le ${date_etat_lieux || '________________'}</strong>
  </div>

  <div class="sig-section">
    <div class="sig-block">
      <div class="sig-label">Le locataire${!isEntree ? ' sortant' : ''}</div>
      <div class="sig-name">${locataire_prenom} ${locataire_nom}</div>
      <div class="sig-line">Signature</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">Le bailleur</div>
      <div class="sig-name">${bailleur_prenom} ${bailleur_nom}</div>
      <div class="sig-line">Signature</div>
    </div>
  </div>

  <div class="footer">
    État des lieux établi conformément aux art. 256 et 267-267a CO — Canton ${canton}<br>
    Document original immocool.ch — À conserver pour l'état des lieux ${isEntree ? 'de sortie' : 'de comparaison'}<br>
    © 2026 immocool.ch
  </div>
</div>

</body>
</html>`;
}
