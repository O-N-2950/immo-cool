/**
 * immocool.ch — Quittance de remise de clés
 * Conforme aux usages locatifs suisses
 */

export function generateQuittanceCles(data) {
  const {
    type = 'remise', // 'remise' | 'restitution'
    date = '',
    bailleur_nom = '', bailleur_prenom = '',
    bailleur_adresse = '', bailleur_npa = '', bailleur_ville = '',
    locataire_nom = '', locataire_prenom = '',
    locataire_adresse = '', locataire_npa = '', locataire_ville = '',
    immeuble_rue = '', immeuble_numero = '',
    immeuble_npa = '', immeuble_ville = '',
    numero_appartement = '', etage = '',
    cles = [
      { description: 'Clé(s) porte immeuble', quantite: '', numero: '' },
      { description: 'Clé(s) appartement', quantite: '', numero: '' },
      { description: 'Clé(s) boîte aux lettres', quantite: '', numero: '' },
      { description: 'Clé(s) cave', quantite: '', numero: '' },
      { description: 'Clé(s) buanderie', quantite: '', numero: '' },
      { description: 'Badge / télécommande parking', quantite: '', numero: '' },
      { description: 'Autres', quantite: '', numero: '' },
    ],
    lieu_signature = '',
    canton = 'JU',
  } = data;

  const isRemise = type === 'remise';
  const title = isRemise ? 'QUITTANCE DE REMISE DE CLÉS' : 'QUITTANCE DE RESTITUTION DE CLÉS';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title} — immocool.ch</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    @page { size: A4 portrait; margin: 20mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; font-size: 10pt; line-height: 1.5; color: #1a1a1a; background: #fff; }
    .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 2px solid #C8A55C; margin-bottom: 20px; }
    .logo-text { font-family: 'Playfair Display', serif; font-size: 14pt; font-weight: 700; }
    .logo-text span { color: #C8A55C; }
    .title { font-family: 'Playfair Display', serif; font-size: 16pt; text-align: center; margin-bottom: 24px; }
    .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .info-block { border: 1px solid #ddd; border-radius: 6px; padding: 12px; }
    .info-label { font-size: 7.5pt; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
    .info-value { font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #f5f5f5; border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 8.5pt; text-transform: uppercase; }
    td { border: 1px solid #ddd; padding: 6px 10px; }
    .center { text-align: center; }
    .note { background: #f8f6f1; border: 1px solid #e5dfd0; border-radius: 6px; padding: 12px; font-size: 9pt; color: #444; margin: 20px 0; }
    .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; }
    .sig-block { border: 1px solid #ccc; border-radius: 6px; padding: 14px; }
    .sig-label { font-size: 7.5pt; color: #888; text-transform: uppercase; margin-bottom: 3px; }
    .sig-name { font-weight: 700; margin-bottom: 35px; }
    .sig-line { border-top: 1px solid #999; padding-top: 4px; font-size: 7.5pt; color: #999; }
    .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; font-size: 7pt; color: #aaa; text-align: center; }
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo-text">immo<span>.cool</span></div>
    <div style="font-size: 8pt; color: #888;">Canton ${canton}</div>
  </div>

  <div class="title">${title}</div>

  <div class="info-section">
    <div class="info-block">
      <div class="info-label">Bailleur</div>
      <div class="info-value">${bailleur_prenom} ${bailleur_nom}</div>
      <div style="font-size: 8.5pt; color: #555;">${bailleur_adresse}, ${bailleur_npa} ${bailleur_ville}</div>
    </div>
    <div class="info-block">
      <div class="info-label">Locataire</div>
      <div class="info-value">${locataire_prenom} ${locataire_nom}</div>
      <div style="font-size: 8.5pt; color: #555;">${locataire_adresse}, ${locataire_npa} ${locataire_ville}</div>
    </div>
    <div class="info-block" style="grid-column: 1/-1;">
      <div class="info-label">Objet loué</div>
      <div class="info-value">${immeuble_rue} ${immeuble_numero}, ${immeuble_npa} ${immeuble_ville} — App. ${numero_appartement}${etage ? `, ${etage}e étage` : ''}</div>
    </div>
  </div>

  <p style="margin-bottom: 8px;">
    ${isRemise
      ? `Le bailleur remet ce jour au locataire les clés et moyens d'accès suivants :`
      : `Le locataire restitue ce jour au bailleur les clés et moyens d'accès suivants :`}
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 45%;">Description</th>
        <th style="width: 15%;" class="center">Quantité</th>
        <th style="width: 20%;">N° / Marque</th>
        <th style="width: 20%;">Observations</th>
      </tr>
    </thead>
    <tbody>
      ${cles.map(c => `
      <tr>
        <td>${c.description}</td>
        <td class="center">${c.quantite}</td>
        <td>${c.numero || ''}</td>
        <td></td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div class="note">
    ${isRemise
      ? `<strong>Important :</strong> Le locataire s'engage à ne pas faire de double des clés remises sans autorisation écrite du bailleur. En cas de perte, le locataire en informera immédiatement le bailleur. Le coût de remplacement des clés et, le cas échéant, du changement de serrure, sera à la charge du locataire.`
      : `<strong>Important :</strong> Le locataire déclare avoir restitué l'ensemble des clés et moyens d'accès qui lui avaient été remis. En cas de non-restitution, le coût du remplacement des clés et du changement de serrure sera déduit de la garantie de loyer.`}
  </div>

  <p style="margin-top: 20px;">
    <strong>Fait à ${lieu_signature || '________________'}, le ${date || '________________'}</strong>
  </p>

  <div class="sig-grid">
    <div class="sig-block">
      <div class="sig-label">${isRemise ? 'Reçu par le locataire' : 'Restitué par le locataire'}</div>
      <div class="sig-name">${locataire_prenom} ${locataire_nom}</div>
      <div class="sig-line">Date et signature</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">${isRemise ? 'Remis par le bailleur' : 'Reçu par le bailleur'}</div>
      <div class="sig-name">${bailleur_prenom} ${bailleur_nom}</div>
      <div class="sig-line">Date et signature</div>
    </div>
  </div>

  <div class="footer">
    Document original immocool.ch — © 2026 immocool.ch
  </div>
</div>
</body>
</html>`;
}
