/**
 * immocool.ch — Contrat de bail pour locaux d'habitation
 * 
 * FORMULAIRE ORIGINAL immocool.ch
 * Conforme au Code des Obligations (art. 253-274g CO) et à l'OBLF
 * 
 * Champs requis par la loi :
 * - Identification des parties (art. 253 CO)
 * - Désignation de l'objet loué (art. 253a CO)
 * - Loyer et charges (art. 257-257b CO)
 * - Durée et résiliation (art. 255-266o CO)
 * - Garantie/dépôt (art. 257e CO)
 * - Taux hypothécaire de référence + IPC (OBLF art. 19 al. 1)
 * - Dates de résiliation cantonales
 * 
 * Ce formulaire n'est PAS une reproduction du bail SVIT ni du bail jurassien.
 * Design, mise en page et rédaction sont des créations originales immocool.ch.
 */

export function generateBailHabitation(data) {
  const {
    // Bailleur
    bailleur_civilite = '', bailleur_nom = '', bailleur_prenom = '',
    bailleur_adresse = '', bailleur_npa = '', bailleur_ville = '',
    bailleur_tel = '', bailleur_email = '',
    // Représentant (optionnel)
    representant_nom = '', representant_adresse = '',
    // Locataire(s)
    locataire_civilite = '', locataire_nom = '', locataire_prenom = '',
    locataire_adresse = '', locataire_npa = '', locataire_ville = '',
    locataire_date_naissance = '', locataire_nationalite = '',
    locataire_tel = '', locataire_email = '',
    // Co-locataire (optionnel)
    colocataire_nom = '', colocataire_prenom = '',
    colocataire_date_naissance = '', colocataire_lien = '',
    // Immeuble
    immeuble_rue = '', immeuble_numero = '',
    immeuble_npa = '', immeuble_ville = '',
    // Objet du bail
    numero_appartement = '', nombre_pieces = '',
    etage = '', surface = '', destination = 'Habitation',
    description_locaux = '',
    // Dépendances
    cave = false, cave_numero = '',
    garage = false, garage_numero = '',
    buanderie = false, grenier = false,
    autres_dependances = '',
    // Durée
    date_debut = '', date_fin = '',
    duree_type = 'indeterminee', // 'determinee' | 'indeterminee'
    // Canton & résiliation
    canton = 'JU', dates_resiliation = '31 mars, 30 juin, 30 septembre et 31 décembre',
    delai_resiliation = '3 mois',
    // Loyer
    loyer_net = '', charges_chauffage = '', charges_accessoires = '',
    garage_loyer = '', divers_montant = '', divers_description = '',
    total_mensuel = '',
    paiement_adresse = '', paiement_iban = '',
    // Référence légale (OBLF art. 19)
    taux_hypothecaire = '1.25', date_taux = '01.09.2025',
    ipc_valeur = '', ipc_date = '',
    loyer_ancien_locataire = '',
    // Garantie (art. 257e CO)
    garantie_montant = '', garantie_type = 'Compte bloqué',
    garantie_banque = '',
    // Dispositions
    dispositions_complementaires = '',
    // Signature
    lieu_signature = '', date_signature = '',
  } = data;

  const cantonNames = {
    JU: 'Jura', VD: 'Vaud', GE: 'Genève', NE: 'Neuchâtel',
    FR: 'Fribourg', VS: 'Valais', BE: 'Berne', ZH: 'Zurich',
    BS: 'Bâle-Ville', LU: 'Lucerne', ZG: 'Zoug',
  };
  const cantonName = cantonNames[canton] || canton;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contrat de bail — ${locataire_nom} ${locataire_prenom} — immocool.ch</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    @page { size: A4 portrait; margin: 15mm 18mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; font-size: 9.5pt; line-height: 1.45; color: #1a1a1a; background: #fff; }

    .page { width: 210mm; min-height: 297mm; padding: 15mm 18mm; margin: 0 auto; background: #fff; }
    .page-break { page-break-after: always; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 2px solid #C8A55C; }
    .logo { display: flex; align-items: center; gap: 8px; }
    .logo-icon { width: 28px; height: 28px; background: #FF0000; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
    .logo-icon svg { width: 18px; height: 18px; }
    .logo-text { font-family: 'Playfair Display', serif; font-size: 16pt; font-weight: 700; }
    .logo-text span { color: #C8A55C; }
    .doc-ref { text-align: right; font-size: 8pt; color: #666; }
    .doc-ref .apt-num { font-family: 'JetBrains Mono', monospace; font-size: 14pt; font-weight: 700; color: #1a1a1a; border: 2px solid #C8A55C; padding: 4px 12px; border-radius: 6px; display: inline-block; margin-top: 4px; }

    /* Title */
    .title { font-family: 'Playfair Display', serif; font-size: 20pt; font-weight: 700; text-align: center; margin: 16px 0 4px; letter-spacing: -0.02em; }
    .title-sub { text-align: center; font-size: 9pt; color: #666; margin-bottom: 18px; }

    /* Sections */
    .section { margin-bottom: 14px; }
    .section-num { font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #C8A55C; font-weight: 700; margin-bottom: 3px; }
    .section-title { font-family: 'DM Sans', sans-serif; font-size: 10.5pt; font-weight: 700; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e5e5; }

    /* Grid */
    .grid { display: grid; gap: 0; border: 1px solid #d0d0d0; border-radius: 8px; overflow: hidden; margin-bottom: 10px; }
    .grid-2 { grid-template-columns: 1fr 1fr; }
    .grid-3 { grid-template-columns: 1fr 1fr 1fr; }
    .grid-cell { padding: 8px 10px; border-bottom: 1px solid #e8e8e8; }
    .grid-cell:nth-child(even) { border-left: 1px solid #e8e8e8; }
    .grid-cell:last-child, .grid-cell:nth-last-child(2):nth-child(odd) { border-bottom: none; }
    .grid-label { font-size: 7.5pt; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .grid-value { font-size: 10pt; font-weight: 600; color: #1a1a1a; }

    /* Finance */
    .finance-table { width: 100%; border-collapse: collapse; margin: 8px 0; }
    .finance-table td { padding: 5px 10px; font-size: 9pt; }
    .finance-table .label { color: #555; }
    .finance-table .amount { text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 600; white-space: nowrap; }
    .finance-table .total { border-top: 2px solid #C8A55C; font-size: 11pt; font-weight: 700; }
    .finance-table .total .amount { color: #C8A55C; }

    /* Legal box */
    .legal-box { background: #f8f6f1; border: 1px solid #e5dfd0; border-radius: 8px; padding: 10px 12px; margin: 8px 0; font-size: 8.5pt; line-height: 1.5; color: #444; }
    .legal-box strong { color: #1a1a1a; }
    .legal-highlight { background: #fff8e1; border-left: 3px solid #C8A55C; padding: 8px 12px; margin: 8px 0; font-size: 8.5pt; }

    /* Signature */
    .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
    .sig-block { border: 1px solid #d0d0d0; border-radius: 8px; padding: 14px; }
    .sig-label { font-size: 8pt; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .sig-name { font-size: 11pt; font-weight: 700; margin-bottom: 30px; }
    .sig-line { border-top: 1px solid #999; padding-top: 4px; font-size: 8pt; color: #999; }

    /* Free text */
    .free-text { min-height: 200px; border: 1px solid #d0d0d0; border-radius: 8px; padding: 10px; margin: 8px 0; }

    /* Footer */
    .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #e5e5e5; font-size: 7pt; color: #999; text-align: center; }
    .footer a { color: #C8A55C; text-decoration: none; }

    @media print {
      body { background: #fff; }
      .page { margin: 0; padding: 12mm 15mm; }
    }
  </style>
</head>
<body>

<!-- PAGE 1 -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="3" fill="#FF0000"/><path d="M10 6h4v12h-4z" fill="white"/><path d="M6 10h12v4H6z" fill="white"/></svg>
      </div>
      <div class="logo-text">immo<span>.cool</span></div>
    </div>
    <div class="doc-ref">
      <div>Canton ${canton} — ${cantonName}</div>
      <div>Appartement N°</div>
      <div class="apt-num">${numero_appartement || '___'}</div>
    </div>
  </div>

  <div class="title">Contrat de bail pour locaux d'habitation</div>
  <div class="title-sub">Conforme au Code des Obligations suisse (art. 253–274g CO) et à l'OBLF</div>

  <!-- SECTION 1 — PARTIES -->
  <div class="section">
    <div class="section-num">ART. 1</div>
    <div class="section-title">Parties au contrat</div>
    <div class="grid grid-2">
      <div class="grid-cell" style="background: #fafaf7;">
        <div class="grid-label">Le bailleur</div>
        <div class="grid-value">${bailleur_civilite} ${bailleur_prenom} ${bailleur_nom}</div>
        <div style="font-size: 8.5pt; color: #555; margin-top: 4px;">
          ${bailleur_adresse}<br>
          ${bailleur_npa} ${bailleur_ville}<br>
          Tél. ${bailleur_tel}<br>
          ${bailleur_email}
        </div>
        ${representant_nom ? `<div style="margin-top: 6px; font-size: 8pt; color: #888;">Représenté par : <strong style="color:#1a1a1a;">${representant_nom}</strong><br>${representant_adresse}</div>` : ''}
      </div>
      <div class="grid-cell" style="background: #fafaf7;">
        <div class="grid-label">Le locataire</div>
        <div class="grid-value">${locataire_civilite} ${locataire_prenom} ${locataire_nom}</div>
        <div style="font-size: 8.5pt; color: #555; margin-top: 4px;">
          ${locataire_adresse}<br>
          ${locataire_npa} ${locataire_ville}<br>
          Né(e) le ${locataire_date_naissance}${locataire_nationalite ? ` — ${locataire_nationalite}` : ''}<br>
          Tél. ${locataire_tel}<br>
          ${locataire_email}
        </div>
        ${colocataire_nom ? `<div style="margin-top: 6px; font-size: 8pt; color: #888;">Co-locataire : <strong style="color:#1a1a1a;">${colocataire_prenom} ${colocataire_nom}</strong> — né(e) le ${colocataire_date_naissance}${colocataire_lien ? ` (${colocataire_lien})` : ''}</div>` : ''}
      </div>
    </div>
  </div>

  <!-- SECTION 2 — OBJET DU BAIL -->
  <div class="section">
    <div class="section-num">ART. 2</div>
    <div class="section-title">Objet du bail (art. 253a CO)</div>
    <div class="grid grid-2">
      <div class="grid-cell">
        <div class="grid-label">Immeuble situé à</div>
        <div class="grid-value">${immeuble_rue} ${immeuble_numero}</div>
        <div style="font-size: 8.5pt; color: #555;">${immeuble_npa} ${immeuble_ville}</div>
      </div>
      <div class="grid-cell">
        <div class="grid-label">Destination des locaux</div>
        <div class="grid-value">${destination}</div>
      </div>
    </div>
    <div class="grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="grid-cell">
        <div class="grid-label">Pièces</div>
        <div class="grid-value">${nombre_pieces}</div>
      </div>
      <div class="grid-cell" style="border-left: 1px solid #e8e8e8;">
        <div class="grid-label">Étage</div>
        <div class="grid-value">${etage}</div>
      </div>
      <div class="grid-cell" style="border-left: 1px solid #e8e8e8;">
        <div class="grid-label">Surface habitable</div>
        <div class="grid-value">${surface} m²</div>
      </div>
      <div class="grid-cell" style="border-left: 1px solid #e8e8e8;">
        <div class="grid-label">N° appartement</div>
        <div class="grid-value">${numero_appartement}</div>
      </div>
    </div>
    ${description_locaux ? `<div class="legal-box"><strong>Description :</strong> ${description_locaux}</div>` : ''}
    <div class="legal-box">
      <strong>Dépendances à disposition :</strong>
      ${cave ? `Cave${cave_numero ? ` N° ${cave_numero}` : ''} · ` : ''}${garage ? `Garage/parking${garage_numero ? ` N° ${garage_numero}` : ''} · ` : ''}${buanderie ? 'Buanderie commune · ' : ''}${grenier ? 'Grenier · ' : ''}${autres_dependances || ''}${!cave && !garage && !buanderie && !grenier && !autres_dependances ? 'Aucune' : ''}
    </div>
  </div>

  <!-- SECTION 3 — DURÉE -->
  <div class="section">
    <div class="section-num">ART. 3</div>
    <div class="section-title">Durée du bail et résiliation (art. 255–266o CO)</div>
    <div class="grid grid-2">
      <div class="grid-cell">
        <div class="grid-label">Début du bail</div>
        <div class="grid-value">${date_debut}</div>
      </div>
      <div class="grid-cell">
        <div class="grid-label">${duree_type === 'determinee' ? 'Fin du bail' : 'Durée'}</div>
        <div class="grid-value">${duree_type === 'determinee' ? date_fin : 'Indéterminée'}</div>
      </div>
    </div>
    <div class="legal-box">
      <strong>Résiliation :</strong> Le bail peut être résilié par chacune des parties moyennant un préavis de <strong>${delai_resiliation}</strong>, par lettre recommandée, pour les échéances des <strong>${dates_resiliation}</strong> (dates de résiliation du canton de ${cantonName}).
      <br><br>
      Le bailleur est tenu d'utiliser la <strong>formule officielle agréée</strong> par le canton (art. 266l CO). Le congé doit être communiqué séparément à chaque locataire (art. 266n CO).
      <br><br>
      À défaut de résiliation valable, le bail se renouvelle tacitement aux mêmes conditions pour une durée indéterminée.
    </div>
  </div>

  <!-- SECTION 4 — LOYER -->
  <div class="section">
    <div class="section-num">ART. 4</div>
    <div class="section-title">Loyer et charges (art. 257–257b CO)</div>
    <table class="finance-table">
      <tr><td class="label">Loyer net mensuel</td><td class="amount">CHF ${loyer_net || '______'}.-</td></tr>
      <tr><td class="label">Acompte chauffage et eau chaude</td><td class="amount">CHF ${charges_chauffage || '______'}.-</td></tr>
      <tr><td class="label">Acompte charges accessoires</td><td class="amount">CHF ${charges_accessoires || '______'}.-</td></tr>
      ${garage_loyer ? `<tr><td class="label">Garage / place de parc</td><td class="amount">CHF ${garage_loyer}.-</td></tr>` : ''}
      ${divers_montant ? `<tr><td class="label">${divers_description || 'Divers'}</td><td class="amount">CHF ${divers_montant}.-</td></tr>` : ''}
      <tr class="total"><td class="label"><strong>Total mensuel</strong></td><td class="amount"><strong>CHF ${total_mensuel || '______'}.-</strong></td></tr>
    </table>
    <div class="grid grid-2">
      <div class="grid-cell">
        <div class="grid-label">Paiement à l'adresse de</div>
        <div style="font-size: 8.5pt; color: #555;">${paiement_adresse || '________________________________'}</div>
      </div>
      <div class="grid-cell">
        <div class="grid-label">IBAN / Compte</div>
        <div style="font-family: 'JetBrains Mono'; font-size: 9pt; font-weight: 500;">${paiement_iban || '________________________________'}</div>
      </div>
    </div>
    <div class="legal-box">Le loyer est payable <strong>d'avance</strong>, au plus tard le premier jour de chaque mois (art. 257c CO).</div>
  </div>

  <!-- SECTION 5 — RÉFÉRENCES LÉGALES (OBLF) -->
  <div class="section">
    <div class="section-num">ART. 5</div>
    <div class="section-title">Références légales (OBLF art. 19)</div>
    <div class="grid grid-2">
      <div class="grid-cell">
        <div class="grid-label">Taux hypothécaire de référence</div>
        <div class="grid-value">${taux_hypothecaire}%</div>
        <div style="font-size: 7.5pt; color: #888;">En vigueur depuis le ${date_taux}</div>
      </div>
      <div class="grid-cell">
        <div class="grid-label">Indice des prix à la consommation (IPC)</div>
        <div class="grid-value">${ipc_valeur || '____'} points</div>
        <div style="font-size: 7.5pt; color: #888;">${ipc_date ? `Indice de ${ipc_date}` : ''}</div>
      </div>
    </div>
    ${loyer_ancien_locataire ? `
    <div class="legal-highlight">
      <strong>Information au locataire :</strong> Le loyer du précédent locataire était de <strong>CHF ${loyer_ancien_locataire}.-</strong> par mois. Conformément à l'OBLF art. 19 al. 1, cette information est communiquée au nouveau locataire.
    </div>` : ''}
  </div>

  <div class="footer">
    Document généré par immocool.ch — La plateforme immobilière 100% gratuite pour les locataires<br>
    Conforme au CO art. 253–274g et à l'OBLF — Ce document ne constitue pas un formulaire officiel cantonal
  </div>
</div>

<!-- PAGE 2 -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="3" fill="#FF0000"/><path d="M10 6h4v12h-4z" fill="white"/><path d="M6 10h12v4H6z" fill="white"/></svg>
      </div>
      <div class="logo-text">immo<span>.cool</span></div>
    </div>
    <div class="doc-ref">
      <div style="font-size: 9pt; font-weight: 600;">Contrat de bail — suite</div>
      <div>${locataire_prenom} ${locataire_nom}</div>
    </div>
  </div>

  <!-- SECTION 6 — GARANTIE -->
  <div class="section">
    <div class="section-num">ART. 6</div>
    <div class="section-title">Garantie de loyer (art. 257e CO)</div>
    <div class="grid" style="grid-template-columns: 1fr 1fr 1fr;">
      <div class="grid-cell">
        <div class="grid-label">Montant de la garantie</div>
        <div class="grid-value">CHF ${garantie_montant || '______'}.-</div>
      </div>
      <div class="grid-cell" style="border-left: 1px solid #e8e8e8;">
        <div class="grid-label">Nature de la garantie</div>
        <div class="grid-value">${garantie_type}</div>
      </div>
      <div class="grid-cell" style="border-left: 1px solid #e8e8e8;">
        <div class="grid-label">Banque / garant</div>
        <div class="grid-value">${garantie_banque || '________________'}</div>
      </div>
    </div>
    <div class="legal-box">
      La garantie ne peut excéder <strong>trois mois de loyer</strong> (art. 257e al. 2 CO). Le bailleur est tenu de déposer la garantie sur un <strong>compte d'épargne ou de dépôt au nom du locataire</strong> auprès d'une banque (art. 257e al. 1 CO). Le bailleur ne peut prétendre à la garantie sans le consentement du locataire ou un jugement (art. 257e al. 3 CO).
    </div>
  </div>

  <!-- SECTION 7 — DISPOSITIONS COMPLÉMENTAIRES -->
  <div class="section">
    <div class="section-num">ART. 7</div>
    <div class="section-title">Dispositions complémentaires</div>
    <div class="free-text">${dispositions_complementaires || ''}</div>
  </div>

  <!-- SECTION 8 — DROIT APPLICABLE -->
  <div class="section">
    <div class="section-num">ART. 8</div>
    <div class="section-title">Droit applicable et for</div>
    <div class="legal-box">
      Le présent contrat est soumis au droit suisse, en particulier aux articles 253 à 274g du Code des Obligations et à l'Ordonnance sur le bail à loyer et le bail à ferme d'habitations et de locaux commerciaux (OBLF).
      <br><br>
      Les <strong>dispositions impératives</strong> du CO en matière de bail à loyer s'appliquent même si elles ne sont pas expressément mentionnées dans le présent contrat.
      <br><br>
      Pour tout litige relatif au présent bail, les parties font élection de for au <strong>lieu de situation de l'immeuble</strong>, soit ${immeuble_ville} (${canton}).
      <br><br>
      L'autorité compétente en matière de conciliation est celle du canton de ${cantonName}.
    </div>
  </div>

  <!-- SECTION 9 — ENGAGEMENT -->
  <div class="section">
    <div class="section-num">ART. 9</div>
    <div class="section-title">Engagement des parties</div>
    <div class="legal-box">
      Les parties déclarent avoir pris connaissance de l'intégralité du présent contrat et en accepter toutes les conditions. Le bail n'est réputé conclu qu'une fois signé par les deux parties. Le présent contrat est établi en <strong>deux exemplaires originaux</strong>, un pour chaque partie.
    </div>

    <div style="margin-top: 16px; font-size: 9pt;">
      <strong>Fait à ${lieu_signature || '________________'}, le ${date_signature || '________________'}</strong>
    </div>

    <div class="sig-grid">
      <div class="sig-block">
        <div class="sig-label">Le locataire</div>
        <div class="sig-name">${locataire_prenom} ${locataire_nom}</div>
        <div class="sig-line">Signature</div>
      </div>
      <div class="sig-block">
        <div class="sig-label">Le bailleur</div>
        <div class="sig-name">${bailleur_prenom} ${bailleur_nom}</div>
        <div class="sig-line">Signature</div>
      </div>
    </div>
    ${colocataire_nom ? `
    <div class="sig-grid" style="margin-top: 12px;">
      <div class="sig-block">
        <div class="sig-label">Le co-locataire</div>
        <div class="sig-name">${colocataire_prenom} ${colocataire_nom}</div>
        <div class="sig-line">Signature</div>
      </div>
      <div class="sig-block"></div>
    </div>` : ''}
  </div>

  <div class="footer">
    <strong>immocool.ch</strong> — Formulaire original · Conforme CO art. 253–274g · OBLF<br>
    Ce document n'est pas un formulaire officiel cantonal. Pour la résiliation du bail, utilisez le formulaire officiel du canton de ${cantonName}.<br>
    © 2026 immocool.ch — La plateforme immobilière 100% gratuite pour les locataires
  </div>
</div>

</body>
</html>`;
}
