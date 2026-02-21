/**
 * immocool.ch — Générateur d'état des lieux d'entrée/sortie
 * 
 * Conforme à l'art. 256 CO — État de la chose louée
 * Adapté dynamiquement au nombre de pièces et aux équipements réels
 * 
 * Usage :
 *   import { generateEtatDesLieux } from '@/lib/documents/etat-des-lieux';
 *   const html = generateEtatDesLieux({ type: 'entree', ...data });
 */

// ============================================================
// TEMPLATES DE PIÈCES — Éléments à inspecter par type
// ============================================================
const ROOM_TEMPLATES = {
  entree_corridor: {
    title: 'HALL D\'ENTRÉE / CORRIDOR',
    elements: [
      'Porte d\'entrée (serrure, poignée)',
      'Murs et plafond', 'Sol (parquet/carrelage)',
      'Éclairage', 'Interrupteurs et prises',
    ],
  },
  salon_sejour: {
    title: 'SALON / SÉJOUR',
    elements: [
      'Murs et plafond', 'Sol (parquet/carrelage)',
      'Fenêtres (vitrages, cadres, joints)', 'Volets / stores',
      'Radiateurs / chauffage', 'Éclairage', 'Interrupteurs et prises',
    ],
  },
  cuisine: {
    title: 'CUISINE',
    elements: [
      'Murs et plafond', 'Sol (carrelage)', 'Plan de travail',
      'Évier et robinetterie', 'Placards / meubles de cuisine',
      'Four / cuisinière / plaques', 'Hotte aspirante',
      'Réfrigérateur', 'Lave-vaisselle',
      'Éclairage', 'Interrupteurs et prises',
    ],
  },
  chambre: {
    title: 'CHAMBRE',
    elements: [
      'Murs et plafond', 'Sol (parquet/carrelage/moquette)',
      'Fenêtres (vitrages, cadres, joints)', 'Volets / stores',
      'Radiateurs / chauffage', 'Placards intégrés (si présents)',
      'Éclairage', 'Interrupteurs et prises',
    ],
  },
  salle_de_bain: {
    title: 'SALLE DE BAIN',
    elements: [
      'Murs et plafond', 'Sol (carrelage)', 'Carrelage mural / faïence',
      'Lavabo et robinetterie', 'Baignoire / douche',
      'Robinetterie baignoire/douche',
      'WC (cuvette, chasse d\'eau, abattant)', 'Miroir',
      'Meubles de salle de bain', 'Ventilation / VMC',
      'Éclairage', 'Interrupteurs et prises',
    ],
  },
  balcon: {
    title: 'BALCON / TERRASSE',
    elements: [
      'Porte-fenêtre d\'accès', 'Sol (carrelage/béton)',
      'Garde-corps / rambarde', 'Étanchéité / évacuation d\'eau',
    ],
  },
  wc_separe: {
    title: 'WC SÉPARÉ',
    elements: [
      'Murs et plafond', 'Sol (carrelage)',
      'WC (cuvette, chasse d\'eau, abattant)', 'Lavabo (si présent)',
      'Éclairage', 'Ventilation',
    ],
  },
  cave: {
    title: 'CAVE / RÉDUIT',
    elements: ['Accès et porte', 'Murs et plafond', 'Sol', 'Éclairage'],
  },
  buanderie: {
    title: 'BUANDERIE',
    elements: ['Accès et porte', 'Sol', 'Raccordements (eau, électricité)', 'Éclairage'],
  },
};

// ============================================================
// DEFAULTS
// ============================================================
const DEFAULTS = {
  type: 'entree',
  canton: 'République et Canton du Jura',
  date: new Date().toLocaleDateString('fr-CH'),
  nombre_pieces: 3.5,
  surface: '', etage: '',
  nb_cles: 3,
  has_garage: false, has_cave: true, has_balcon: true,
  has_wc_separe: false, has_buanderie: false,
  bailleur_nom: '', bailleur_adresse: '', bailleur_npa: '', bailleur_ville: '', bailleur_tel: '',
  locataire_nom: '', locataire_adresse: '', locataire_npa: '', locataire_ville: '',
  locataire_tel: '', locataire_email: '',
  adresse_rue: '', adresse_numero: '', adresse_npa: '', adresse_ville: '',
  numero_appartement: '',
};

// ============================================================
// RENDER HELPERS
// ============================================================
function renderRoomTable(num, room) {
  const rows = room.elements.map(el =>
    `<tr><td>${el}</td><td></td><td></td></tr>`
  ).join('\n                ');

  return `
        <div class="section-wrapper">
            <h2>${num}. ${room.title}</h2>
            <table>
                <tr>
                    <th style="width:35%">Élément</th>
                    <th class="state-col">État</th>
                    <th class="obs-col">Observations</th>
                </tr>
                ${rows}
            </table>
        </div>`;
}

// ============================================================
// MAIN GENERATOR
// ============================================================
export function generateEtatDesLieux(data) {
  const d = { ...DEFAULTS, ...data };
  const isEntree = d.type === 'entree';
  const titre = isEntree ? "ÉTAT DES LIEUX D'ENTRÉE" : "ÉTAT DES LIEUX DE SORTIE";

  let secNum = 0;
  const sec = () => ++secNum;

  // -- CLÉS --
  const cles = d.cles || [
    { desc: 'Clés porte immeuble + appartement + boîte aux lettres', qty: d.nb_cles || 3 },
    ...(d.has_garage ? [{ desc: `Télécommande garage${d.garage_numero ? ` (place N° ${d.garage_numero})` : ''}`, qty: 1 }] : []),
    ...(d.has_cave ? [{ desc: `Clé cave${d.cave_numero ? ` N° ${d.cave_numero}` : ''}`, qty: 1 }] : []),
  ];
  const keysRows = cles.map(c =>
    `<tr><td>${c.desc}</td><td style="text-align:center"><strong>${c.qty}</strong></td><td></td></tr>`
  ).join('\n                ');

  const keysSection = `
        <div class="section-wrapper">
            <h2>${sec()}. REMISE DES CLÉS ET ACCÈS</h2>
            <table>
                <tr><th style="width:50%">Description</th><th style="width:15%">Qté</th><th style="width:35%">Observations</th></tr>
                ${keysRows}
            </table>
        </div>`;

  // -- PIÈCES --
  const rooms = [];
  rooms.push(renderRoomTable(sec(), ROOM_TEMPLATES.entree_corridor));
  rooms.push(renderRoomTable(sec(), ROOM_TEMPLATES.salon_sejour));
  rooms.push(renderRoomTable(sec(), ROOM_TEMPLATES.cuisine));

  // Chambres dynamiques : 3.5 pièces → 2 chambres, 4.5 → 3, 2.5 → 1
  const nbChambres = Math.max(1, Math.floor(d.nombre_pieces) - 2);
  for (let i = 1; i <= nbChambres; i++) {
    rooms.push(renderRoomTable(sec(), {
      ...ROOM_TEMPLATES.chambre,
      title: nbChambres === 1 ? 'CHAMBRE' : `CHAMBRE ${i}`,
    }));
  }

  rooms.push(renderRoomTable(sec(), ROOM_TEMPLATES.salle_de_bain));
  if (d.has_balcon) rooms.push(renderRoomTable(sec(), ROOM_TEMPLATES.balcon));
  if (d.has_wc_separe) rooms.push(renderRoomTable(sec(), ROOM_TEMPLATES.wc_separe));
  if (d.has_cave) {
    const cave = { ...ROOM_TEMPLATES.cave };
    if (d.cave_numero) cave.title = `CAVE / RÉDUIT N° ${d.cave_numero}`;
    rooms.push(renderRoomTable(sec(), cave));
  }
  if (d.has_buanderie) rooms.push(renderRoomTable(sec(), ROOM_TEMPLATES.buanderie));

  if (d.pieces_supplementaires?.length) {
    for (const piece of d.pieces_supplementaires) {
      rooms.push(renderRoomTable(sec(), {
        title: piece.toUpperCase(),
        elements: ['Murs et plafond', 'Sol', 'Fenêtres (si présentes)', 'Éclairage', 'Interrupteurs et prises'],
      }));
    }
  }

  // -- ÉQUIPEMENTS --
  const eqItems = [
    'Compteurs (eau, électricité)', 'Chaudière / système de chauffage',
    'Boîte aux lettres', 'Sonnette / interphone',
    ...(d.has_garage ? [`Place de parking N° ${d.garage_numero || '___'}`] : []),
  ];
  const eqRows = eqItems.map(i => `<tr><td>${i}</td><td></td><td></td></tr>`).join('\n                ');
  const equipSection = `
        <div class="section-wrapper">
            <h2>${sec()}. ÉQUIPEMENTS GÉNÉRAUX</h2>
            <table>
                <tr><th style="width:35%">Élément</th><th class="state-col">État</th><th class="obs-col">Observations</th></tr>
                ${eqRows}
            </table>
        </div>`;

  // -- COMPTEURS --
  const compteurs = [
    { label: 'Électricité', key: 'electricite' },
    { label: 'Eau froide', key: 'eau_froide' },
    { label: 'Eau chaude', key: 'eau_chaude' },
    { label: 'Gaz (si applicable)', key: 'gaz' },
  ];
  const cptRows = compteurs.map(c => {
    const v = d.compteurs?.[c.key] || {};
    return `<tr><td>${c.label}</td><td>${v.numero || ''}</td><td>${v.index || ''}</td></tr>`;
  }).join('\n                ');
  const counterSection = `
        <div class="section-wrapper">
            <h2>${sec()}. RELEVÉS DES COMPTEURS</h2>
            <table>
                <tr><th style="width:40%">Compteur</th><th style="width:30%">N° Compteur</th><th style="width:30%">Index à l'${isEntree ? 'entrée' : 'sortie'}</th></tr>
                ${cptRows}
            </table>
        </div>`;

  // ============================================================
  // ASSEMBLAGE HTML
  // ============================================================
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${titre} - ${d.locataire_nom}</title>
<style>
@page{size:A4 portrait;margin:1cm 1.5cm}
*{box-sizing:border-box}
body{font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;font-size:8.5pt;line-height:1.3;color:#1a1a1a}
.page{width:210mm;min-height:297mm;padding:1cm 1.5cm;margin:0 auto}
.header{text-align:center;margin-bottom:12px}
h1{font-size:18pt;font-weight:700;margin:0 0 2px}
.sub{font-size:9pt;color:#666;margin:0 0 10px}
h2{font-size:10pt;font-weight:700;margin:14px 0 6px;color:#fff;background:#2a2a2a;padding:5px 10px;border-radius:2px;page-break-after:avoid}
.info-box{border:1px solid #ccc;padding:8px 10px;margin:6px 0;background:#fafafa;border-radius:2px;page-break-inside:avoid}
.box-title{font-weight:700;font-size:8pt;text-transform:uppercase;color:#666;margin-bottom:4px;letter-spacing:.5px}
.info-row{display:flex;margin:2px 0}
.info-label{font-weight:600;width:40%;color:#444}
.info-value{width:60%}
.two-col{display:flex;gap:10px}
.half{width:50%}
.legend{font-size:7.5pt;background:#f0f0f0;padding:4px 8px;margin:8px 0;border-radius:2px;text-align:center;color:#555}
table{width:100%;border-collapse:collapse;margin-bottom:8px;font-size:8pt;page-break-inside:auto}
th{background:#e8e8e8;border:1px solid #999;padding:4px 6px;text-align:left;font-weight:700;font-size:8pt}
td{border:1px solid #bbb;padding:4px 6px;vertical-align:top;min-height:22px}
tr{page-break-inside:avoid}
.state-col{width:12%;text-align:center}
.obs-col{width:40%}
.section-wrapper{page-break-inside:avoid;margin-bottom:8px}
.notes-section{border:1px solid #ccc;padding:8px;margin:6px 0;min-height:60px}
.bl{border-bottom:1px dotted #999;min-height:20px;margin:4px 0}
.bl.tall{min-height:35px}
.cb{display:inline-block;width:13px;height:13px;border:2px solid #333;margin-right:5px;vertical-align:middle}
.cb.ml{margin-left:25px}
.legal{font-size:7.5pt;font-style:italic;margin-top:15px;color:#555}
.sig-section{display:flex;justify-content:space-between;margin-top:10px;page-break-inside:avoid}
.sig-block{width:48%;border:1px solid #999;padding:8px;min-height:80px}
.sig-space{height:40px}
.bold{font-weight:700}
.footer{margin-top:15px;font-size:7pt;text-align:center;color:#888;border-top:1px solid #ddd;padding-top:5px}
@media print{body{background:#fff}.page{margin:0;border:none}h2{page-break-after:avoid}.sig-section{page-break-inside:avoid}}
</style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>${titre}</h1>
            <div class="sub">immocool.ch — ${d.canton}</div>
        </div>

        <div class="info-box">
            <div class="info-row"><div class="info-label">Date :</div><div class="info-value">${d.date}</div></div>
            <div class="info-row"><div class="info-label">Adresse :</div><div class="info-value"><strong>${d.adresse_rue} ${d.adresse_numero}, ${d.adresse_npa} ${d.adresse_ville}</strong></div></div>
            <div class="info-row"><div class="info-label">Appartement N° :</div><div class="info-value"><strong>${d.numero_appartement}</strong></div></div>
            <div class="info-row"><div class="info-label">Étage / Surface :</div><div class="info-value">${d.etage}${d.etage && d.surface ? ' — ' : ''}${d.surface ? d.surface + ' m²' : ''} — ${d.nombre_pieces} pièces</div></div>
        </div>

        <div class="two-col">
            <div class="info-box half">
                <div class="box-title">Bailleur</div>
                <div class="info-row"><div class="info-label">Nom :</div><div class="info-value"><strong>${d.bailleur_nom}</strong></div></div>
                <div class="info-row"><div class="info-label">Adresse :</div><div class="info-value">${d.bailleur_adresse}, ${d.bailleur_npa} ${d.bailleur_ville}</div></div>
                <div class="info-row"><div class="info-label">Tél. :</div><div class="info-value">${d.bailleur_tel}</div></div>
            </div>
            <div class="info-box half">
                <div class="box-title">Locataire</div>
                <div class="info-row"><div class="info-label">Nom :</div><div class="info-value"><strong>${d.locataire_nom}</strong></div></div>
                <div class="info-row"><div class="info-label">${isEntree ? 'Adr. précédente' : 'Nouvelle adr.'} :</div><div class="info-value">${d.locataire_adresse}, ${d.locataire_npa} ${d.locataire_ville}</div></div>
                <div class="info-row"><div class="info-label">Contact :</div><div class="info-value">${d.locataire_tel}${d.locataire_email ? ' — ' + d.locataire_email : ''}</div></div>
            </div>
        </div>

        <div class="legend">
            <strong>Légende :</strong> N = Neuf &nbsp;|&nbsp; TB = Très bon &nbsp;|&nbsp; B = Bon &nbsp;|&nbsp; M = Moyen &nbsp;|&nbsp; Ma = Mauvais
        </div>

        ${keysSection}
        ${rooms.join('\n')}
        ${equipSection}
        ${counterSection}

        <div class="section-wrapper">
            <h2>${sec()}. OBSERVATIONS GÉNÉRALES</h2>
            <div class="notes-section">
                <p><strong>Propreté générale :</strong></p><div class="bl"></div>
                <p><strong>${isEntree ? 'Travaux à réaliser par le bailleur' : 'Dégâts à la charge du locataire'} :</strong></p><div class="bl"></div>
                <p><strong>Autres observations :</strong></p><div class="bl tall"></div>
            </div>
        </div>

        <div class="section-wrapper">
            <h2>${sec()}. ÉTAT GÉNÉRAL DU LOGEMENT</h2>
            <div style="margin:8px 0;padding-left:10px">
                <span class="cb"></span> Excellent
                <span class="cb ml"></span> Très bon
                <span class="cb ml"></span> Bon
                <span class="cb ml"></span> Moyen
                <span class="cb ml"></span> À rénover
            </div>
        </div>

        <div class="legal">
            <p><strong>Important :</strong> Le locataire ${isEntree
              ? "s'engage à restituer le logement dans l'état constaté, sous réserve de l'usure normale"
              : "reconnaît que l'état des lieux a été établi contradictoirement"}.</p>
        </div>

        <div style="margin-top:15px"><p><strong>Fait à ${d.adresse_ville}, le ${d.date}</strong></p></div>

        <div class="sig-section">
            <div class="sig-block">
                <p class="bold">Le Locataire :</p><p>${d.locataire_nom}</p>
                <div class="sig-space"></div><p>Signature : ___________________</p>
            </div>
            <div class="sig-block">
                <p class="bold">Le Bailleur :</p><p>${d.bailleur_nom}</p>
                <div class="sig-space"></div><p>Signature : ___________________</p>
            </div>
        </div>

        <div class="footer">
            <p>Art. 256 CO — ${d.canton} — Généré par immocool.ch</p>
        </div>
    </div>
</body>
</html>`;
}

export default generateEtatDesLieux;
