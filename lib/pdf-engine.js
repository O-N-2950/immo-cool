import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ═══════════════════════════════════════════════════════
// COULEURS & CONSTANTES
// ═══════════════════════════════════════════════════════
const BLACK = rgb(0.07, 0.06, 0.04);
const DARK = rgb(0.2, 0.2, 0.2);
const GRAY = rgb(0.45, 0.45, 0.45);
const LIGHT = rgb(0.75, 0.75, 0.75);
const GOLD = rgb(0.83, 0.66, 0.33); // #D4A853
const WHITE = rgb(1, 1, 1);
const MARGIN = 60;
const LINE_HEIGHT = 16;

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
function formatDate(dateStr) {
  if (!dateStr) return '_______________';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatCHF(amount) {
  if (!amount && amount !== 0) return '___________';
  return `CHF ${Number(amount).toLocaleString('fr-CH')}`;
}

// Wraps text and returns lines array
function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Draw text block with auto-wrap, returns new Y position
function drawTextBlock(page, text, x, y, font, fontSize, maxWidth, color = DARK) {
  const lines = wrapText(text, font, fontSize, maxWidth);
  for (const line of lines) {
    if (y < MARGIN + 40) {
      // Would need new page - skip for now, handled by caller
      break;
    }
    page.drawText(line, { x, y, size: fontSize, font, color });
    y -= LINE_HEIGHT;
  }
  return y;
}

// Draw the immo.cool footer on every page
function drawFooter(page, font, pageNum, totalPages) {
  const { width } = page.getSize();
  // Line
  page.drawLine({
    start: { x: MARGIN, y: 45 },
    end: { x: width - MARGIN, y: 45 },
    thickness: 0.5,
    color: LIGHT,
  });
  // Brand
  page.drawText('immo.cool', {
    x: MARGIN, y: 30, size: 9, font, color: GOLD,
  });
  page.drawText('— www.immocool.ch — La première régie 100% IA de Suisse', {
    x: MARGIN + 52, y: 30, size: 7, font, color: LIGHT,
  });
  // Page number
  page.drawText(`${pageNum}/${totalPages}`, {
    x: width - MARGIN - 20, y: 30, size: 8, font, color: LIGHT,
  });
}

// Draw section title with gold accent
function drawSection(page, title, y, fontBold, width) {
  page.drawRectangle({
    x: MARGIN - 4,
    y: y - 3,
    width: 3,
    height: 16,
    color: GOLD,
  });
  page.drawText(title, {
    x: MARGIN + 8, y, size: 12, font: fontBold, color: BLACK,
  });
  return y - 24;
}

// Draw a labeled field: "Label: value"
function drawField(page, label, value, x, y, font, fontBold, maxWidth) {
  page.drawText(`${label}: `, { x, y, size: 10, font: fontBold, color: DARK });
  const labelW = fontBold.widthOfTextAtSize(`${label}: `, 10);
  const valStr = value || '___________________________';
  page.drawText(valStr, { x: x + labelW, y, size: 10, font, color: value ? BLACK : LIGHT });
  return y - LINE_HEIGHT;
}

// ═══════════════════════════════════════════════════════
// BAIL À LOYER
// ═══════════════════════════════════════════════════════
export async function generateBailPDF(data) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  
  const { width, height } = { width: 595, height: 842 }; // A4
  let page = doc.addPage([width, height]);
  let y = height - MARGIN;
  
  const cantonName = data.canton || 'JU';
  const needsForm = ['GE','VD','NE','FR','ZG','ZH','NW'].includes(cantonName);

  // ── HEADER ──
  page.drawText('CONTRAT DE BAIL À LOYER', {
    x: MARGIN, y, size: 18, font: fontBold, color: BLACK,
  });
  y -= 22;
  page.drawText(`Canton ${cantonName} — ${data.type === 'commercial' ? 'Locaux commerciaux' : 'Locaux d\'habitation'}`, {
    x: MARGIN, y, size: 10, font: fontItalic, color: GRAY,
  });
  y -= 8;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: width - MARGIN, y }, thickness: 1, color: GOLD });
  y -= 8;
  page.drawText(`Conforme CO art. 253-274g, OBLF — Taux hypothécaire: 1.25% — IPC: 107.1 pts`, {
    x: MARGIN, y, size: 7, font, color: GRAY,
  });
  y -= 28;

  // ── BAILLEUR ──
  y = drawSection(page, 'BAILLEUR (propriétaire)', y, fontBold, width);
  y = drawField(page, 'Nom', data.ownerName, MARGIN, y, font, fontBold);
  y = drawField(page, 'Adresse', `${data.ownerAddr || ''}, ${data.ownerNPA || ''} ${data.ownerCity || ''}`.trim().replace(/^,\s*/, ''), MARGIN, y, font, fontBold);
  y -= 10;

  // ── LOCATAIRE ──
  y = drawSection(page, 'LOCATAIRE', y, fontBold, width);
  y = drawField(page, 'Nom', data.tenantName, MARGIN, y, font, fontBold);
  y = drawField(page, 'Adresse actuelle', `${data.tenantAddr || ''}, ${data.tenantNPA || ''} ${data.tenantCity || ''}`.trim().replace(/^,\s*/, ''), MARGIN, y, font, fontBold);
  y = drawField(page, 'Nationalité / Permis', `${data.tenantNat || ''} / ${data.tenantPermit || ''}`, MARGIN, y, font, fontBold);
  y -= 10;

  // ── OBJET LOUÉ ──
  y = drawSection(page, 'OBJET LOUÉ', y, fontBold, width);
  y = drawField(page, 'Adresse', `${data.propAddr || ''}, ${data.propNPA || ''} ${data.propCity || ''}`.trim().replace(/^,\s*/, ''), MARGIN, y, font, fontBold);
  y = drawField(page, 'Description', `${data.rooms || '?'} pièces, ${data.area || '?'} m², ${data.floor || '?'}ème étage`, MARGIN, y, font, fontBold);
  
  const equip = [data.balcony && 'balcon', data.parking && 'parking', data.cellar && 'cave', data.laundry && 'buanderie'].filter(Boolean).join(', ') || 'aucun';
  y = drawField(page, 'Équipements', equip, MARGIN, y, font, fontBold);
  y -= 10;

  // ── CONDITIONS FINANCIÈRES ──
  y = drawSection(page, 'CONDITIONS FINANCIÈRES', y, fontBold, width);
  y = drawField(page, 'Loyer mensuel net', data.rent ? formatCHF(data.rent) : null, MARGIN, y, font, fontBold);
  y = drawField(page, 'Charges mensuelles', data.charges ? `${formatCHF(data.charges)} (${data.chargesType === 'forfait' ? 'forfait' : 'acompte'})` : null, MARGIN, y, font, fontBold);
  y = drawField(page, 'Total mensuel', data.rent ? formatCHF(Number(data.rent) + Number(data.charges || 0)) : null, MARGIN, y, font, fontBold);
  y = drawField(page, 'Garantie de loyer', `${data.deposit || 3} mois de loyer net (art. 257e CO, max. 3 mois)`, MARGIN, y, font, fontBold);
  y -= 6;
  
  // Références légales
  page.drawRectangle({
    x: MARGIN, y: y - 46, width: width - 2 * MARGIN, height: 50,
    color: rgb(0.97, 0.96, 0.93), borderColor: GOLD, borderWidth: 0.5,
  });
  page.drawText('Références légales au moment de la conclusion du bail:', {
    x: MARGIN + 10, y: y - 10, size: 8, font: fontBold, color: DARK,
  });
  page.drawText(`Taux hypothécaire de référence: 1.25% (source: OFL) | IPC base déc. 2025: 107.1 pts (source: OFS)`, {
    x: MARGIN + 10, y: y - 24, size: 8, font, color: GRAY,
  });
  page.drawText(`OBLF art. 12 (taux hypo.), art. 13 (IPC), art. 16 (charges), art. 19 (formulaire loyer initial)`, {
    x: MARGIN + 10, y: y - 36, size: 7, font: fontItalic, color: GRAY,
  });
  y -= 66;

  // ── DURÉE ──
  y = drawSection(page, 'DURÉE ET RÉSILIATION', y, fontBold, width);
  y = drawField(page, 'Début du bail', formatDate(data.startDate), MARGIN, y, font, fontBold);
  y = drawField(page, 'Durée', data.duration === 'fixe' ? 'Durée déterminée' : 'Durée indéterminée', MARGIN, y, font, fontBold);
  y = drawField(page, 'Délai de résiliation', `${data.termination || 3} mois`, MARGIN, y, font, fontBold);
  y -= 10;
  
  // ── FORMULAIRE LOYER INITIAL ──
  if (needsForm) {
    y = drawSection(page, `FORMULAIRE DE LOYER INITIAL (${cantonName} — obligatoire)`, y, fontBold, width);
    y = drawField(page, 'Loyer du précédent locataire', data.prevRent ? formatCHF(data.prevRent) : 'NON RENSEIGNÉ', MARGIN, y, font, fontBold);
    if (data.prevRent && data.rent && Number(data.rent) > Number(data.prevRent)) {
      const diff = Number(data.rent) - Number(data.prevRent);
      const pct = ((diff / Number(data.prevRent)) * 100).toFixed(1);
      y = drawField(page, 'Différence', `+${formatCHF(diff)} (+${pct}%)`, MARGIN, y, font, fontBold);
      y = drawField(page, 'Motif', data.prevRentReason || 'Non précisé', MARGIN, y, font, fontBold);
    }
    y -= 10;
  }

  // ── SIGNATURES ──
  y = drawSection(page, 'SIGNATURES', y, fontBold, width);
  page.drawText(`Fait à ${data.propCity || '_______________'}, le ${formatDate(new Date().toISOString())}`, {
    x: MARGIN, y, size: 10, font, color: DARK,
  });
  y -= 30;
  
  // Two signature boxes
  const boxW = (width - 2 * MARGIN - 20) / 2;
  for (let i = 0; i < 2; i++) {
    const bx = MARGIN + i * (boxW + 20);
    page.drawRectangle({
      x: bx, y: y - 60, width: boxW, height: 65,
      borderColor: LIGHT, borderWidth: 0.5,
    });
    page.drawText(i === 0 ? 'Le bailleur' : 'Le locataire', {
      x: bx + 10, y: y - 10, size: 9, font: fontBold, color: DARK,
    });
    page.drawText(i === 0 ? (data.ownerName || '') : (data.tenantName || ''), {
      x: bx + 10, y: y - 24, size: 8, font, color: GRAY,
    });
    page.drawLine({
      start: { x: bx + 10, y: y - 50 },
      end: { x: bx + boxW - 10, y: y - 50 },
      thickness: 0.5, color: LIGHT,
    });
  }
  
  // Footer
  drawFooter(page, font, 1, 1);

  return doc.save();
}

// ═══════════════════════════════════════════════════════
// RÉSILIATION DE BAIL
// ═══════════════════════════════════════════════════════
export async function generateResiliationPDF(data) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  
  const page = doc.addPage([595, 842]);
  let y = 842 - MARGIN;
  
  // Sender
  page.drawText(data.senderName || '_______________', { x: MARGIN, y, size: 11, font: fontBold, color: BLACK });
  y -= LINE_HEIGHT;
  page.drawText(`${data.senderAddr || ''}, ${data.senderNPA || ''} ${data.senderCity || ''}`, { x: MARGIN, y, size: 10, font, color: DARK });
  y -= 36;
  
  // Recipient
  page.drawText(data.recipientName || '_______________', { x: MARGIN, y, size: 11, font: fontBold, color: BLACK });
  y -= LINE_HEIGHT;
  page.drawText(`${data.recipientAddr || ''}, ${data.recipientNPA || ''} ${data.recipientCity || ''}`, { x: MARGIN, y, size: 10, font, color: DARK });
  y -= 36;
  
  // Date & place
  page.drawText(`${data.senderCity || '_______________'}, le ${formatDate(new Date().toISOString())}`, {
    x: MARGIN, y, size: 10, font, color: DARK,
  });
  y -= 10;
  page.drawText('Envoi recommandé', { x: MARGIN, y, size: 9, font: fontBold, color: rgb(0.8, 0.2, 0.2) });
  y -= 36;
  
  // Title
  page.drawText('Résiliation du contrat de bail', { x: MARGIN, y, size: 16, font: fontBold, color: BLACK });
  y -= 28;
  
  // Object
  y = drawField(page, 'Objet loué', `${data.propAddr || ''}, ${data.propNPA || ''} ${data.propCity || ''}`, MARGIN, y, font, fontBold);
  y = drawField(page, 'Référence bail', data.leaseRef || '', MARGIN, y, font, fontBold);
  y -= 16;
  
  // Body
  const role = data.role === 'owner' ? 'bailleur' : 'locataire';
  const otherRole = data.role === 'owner' ? 'locataire' : 'bailleur';
  
  const body = `Madame, Monsieur,

Par la présente, ${data.role === 'owner' ? 'nous vous notifions' : 'je vous notifie'} la résiliation du contrat de bail portant sur l'objet loué désigné ci-dessus.

Conformément à l'art. 266c CO et aux dispositions contractuelles, la résiliation prend effet au ${formatDate(data.terminationDate)}, moyennant le respect du délai de préavis de ${data.noticePeriod || 3} mois.

${data.role === 'owner' ? 'Nous vous prions de bien vouloir libérer les locaux à cette date et de prendre contact pour fixer la date de l\'état des lieux de sortie.' : 'Je vous prie de bien vouloir prendre contact pour fixer la date de l\'état des lieux de sortie.'}

${data.role === 'owner' ? 'Conformément à l\'art. 266l CO, la résiliation est nulle si elle n\'est pas faite sur formule officielle agréée par le canton. Le présent courrier est accompagné du formulaire officiel.' : ''}

${data.role === 'owner' ? 'Nous vous prions d\'agréer, Madame, Monsieur, nos salutations distinguées.' : 'Je vous prie d\'agréer, Madame, Monsieur, mes salutations distinguées.'}`;

  const paragraphs = body.split('\n').filter(p => p.trim());
  for (const para of paragraphs) {
    y = drawTextBlock(page, para.trim(), MARGIN, y, font, 10, 595 - 2 * MARGIN, DARK);
    y -= 8;
  }
  
  y -= 20;
  
  // Signature
  page.drawText(data.senderName || '_______________', { x: MARGIN, y, size: 10, font: fontBold, color: BLACK });
  y -= LINE_HEIGHT;
  page.drawLine({ start: { x: MARGIN, y: y + 4 }, end: { x: MARGIN + 180, y: y + 4 }, thickness: 0.5, color: LIGHT });
  page.drawText('Signature', { x: MARGIN, y: y - 8, size: 8, font: fontItalic, color: GRAY });
  
  // Legal notice
  y -= 50;
  page.drawRectangle({
    x: MARGIN, y: y - 32, width: 595 - 2 * MARGIN, height: 36,
    color: rgb(0.97, 0.96, 0.93), borderColor: GOLD, borderWidth: 0.5,
  });
  page.drawText('Important: Ce courrier doit être envoyé par pli recommandé. La date de réception par le', {
    x: MARGIN + 8, y: y - 10, size: 7, font, color: GRAY,
  });
  page.drawText(`destinataire fait foi (pas la date d'envoi). Art. 266a-266o CO.`, {
    x: MARGIN + 8, y: y - 22, size: 7, font, color: GRAY,
  });
  
  drawFooter(page, font, 1, 1);
  return doc.save();
}

// ═══════════════════════════════════════════════════════
// CONTESTATION DE LOYER
// ═══════════════════════════════════════════════════════
export async function generateContestationPDF(data) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  
  // ── PAGE 1: ANALYSE ──
  let page = doc.addPage([595, 842]);
  let y = 842 - MARGIN;
  
  page.drawText('ANALYSE DE LOYER', { x: MARGIN, y, size: 20, font: fontBold, color: BLACK });
  y -= 20;
  page.drawText('Rapport généré par l\'IA d\'immo.cool — www.immocool.ch', { x: MARGIN, y, size: 9, font: fontItalic, color: GRAY });
  y -= 8;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: 535, y }, thickness: 1.5, color: GOLD });
  y -= 30;
  
  // Summary box
  const saving = data.estimatedSaving || 0;
  const isOverpriced = saving > 0;
  const boxColor = isOverpriced ? rgb(0.98, 0.93, 0.93) : rgb(0.93, 0.98, 0.93);
  const textColor = isOverpriced ? rgb(0.7, 0.2, 0.2) : rgb(0.1, 0.55, 0.25);
  
  page.drawRectangle({
    x: MARGIN, y: y - 55, width: 595 - 2 * MARGIN, height: 60,
    color: boxColor, borderColor: textColor, borderWidth: 1,
  });
  page.drawText(
    isOverpriced ? `LOYER POTENTIELLEMENT TROP ÉLEVÉ` : 'LOYER CONFORME AU MARCHÉ',
    { x: MARGIN + 15, y: y - 16, size: 13, font: fontBold, color: textColor }
  );
  page.drawText(
    isOverpriced 
      ? `Économie potentielle estimée: ${formatCHF(saving)}/mois (${formatCHF(saving * 12)}/an)`
      : 'Aucune action de contestation recommandée.',
    { x: MARGIN + 15, y: y - 34, size: 10, font, color: textColor }
  );
  if (isOverpriced && data.overpricePercent) {
    page.drawText(`Surcoût estimé: ${data.overpricePercent}% au-dessus du loyer de référence`, {
      x: MARGIN + 15, y: y - 48, size: 9, font: fontItalic, color: textColor,
    });
  }
  y -= 80;
  
  // Détails du bail
  y = drawSection(page, 'VOTRE BAIL', y, fontBold, 595);
  y = drawField(page, 'Objet', `${data.rooms || '?'} pièces, ${data.area || '?'} m² — ${data.propCity || '?'} (${data.canton || '?'})`, MARGIN, y, font, fontBold);
  y = drawField(page, 'Loyer actuel', data.currentRent ? `${formatCHF(data.currentRent)} net + ${formatCHF(data.charges || 0)} charges` : null, MARGIN, y, font, fontBold);
  y = drawField(page, 'Date du bail', formatDate(data.leaseDate), MARGIN, y, font, fontBold);
  y = drawField(page, 'Taux hypo. au moment du bail', data.leaseRate ? `${data.leaseRate}%` : null, MARGIN, y, font, fontBold);
  y -= 10;
  
  // Calcul
  y = drawSection(page, 'CALCUL DE RÉFÉRENCE', y, fontBold, 595);
  y = drawField(page, 'Taux hypo. actuel (OFL)', '1.25%', MARGIN, y, font, fontBold);
  y = drawField(page, 'IPC actuel (OFS)', '107.1 pts (base déc. 2020 = 100)', MARGIN, y, font, fontBold);
  if (data.leaseRate && Number(data.leaseRate) > 1.25) {
    const reduction = ((Number(data.leaseRate) - 1.25) / Number(data.leaseRate) * 100 * 0.4).toFixed(1);
    y = drawField(page, 'Baisse due au taux hypo.', `~${reduction}% (méthode relative, OBLF art. 12-13)`, MARGIN, y, font, fontBold);
  }
  y = drawField(page, 'Loyer de référence estimé', data.fairRent ? formatCHF(data.fairRent) : null, MARGIN, y, font, fontBold);
  y -= 10;
  
  // Explication IA
  if (data.aiExplanation) {
    y = drawSection(page, 'ANALYSE IA', y, fontBold, 595);
    y = drawTextBlock(page, data.aiExplanation, MARGIN, y, font, 9, 595 - 2 * MARGIN, DARK);
    y -= 10;
  }
  
  // Disclaimer
  y -= 10;
  page.drawRectangle({
    x: MARGIN, y: y - 46, width: 595 - 2 * MARGIN, height: 50,
    color: rgb(0.97, 0.97, 0.97), borderColor: LIGHT, borderWidth: 0.5,
  });
  page.drawText('Avertissement: Cette analyse est fournie à titre informatif. immo.cool n\'est pas un cabinet d\'avocats.', {
    x: MARGIN + 8, y: y - 12, size: 7, font: fontBold, color: GRAY,
  });
  page.drawText('Pour une contestation formelle, nous recommandons de consulter l\'ASLOCA ou un avocat spécialisé en droit du bail.', {
    x: MARGIN + 8, y: y - 24, size: 7, font, color: GRAY,
  });
  page.drawText('Bases légales: CO art. 269-270e (loyers abusifs), OBLF art. 11-20 (rendement net admissible).', {
    x: MARGIN + 8, y: y - 36, size: 7, font: fontItalic, color: GRAY,
  });
  
  drawFooter(page, font, 1, isOverpriced ? 2 : 1);
  
  // ── PAGE 2: LETTRE DE CONTESTATION (si loyer trop élevé) ──
  if (isOverpriced) {
    page = doc.addPage([595, 842]);
    y = 842 - MARGIN;
    
    // Sender
    page.drawText(data.tenantName || '_______________', { x: MARGIN, y, size: 11, font: fontBold, color: BLACK });
    y -= LINE_HEIGHT;
    page.drawText(`${data.tenantAddr || '_______________'}`, { x: MARGIN, y, size: 10, font, color: DARK });
    y -= 36;
    
    // Recipient
    page.drawText(data.ownerName || 'Bailleur', { x: MARGIN, y, size: 11, font: fontBold, color: BLACK });
    y -= LINE_HEIGHT;
    page.drawText(data.ownerAddr || '_______________', { x: MARGIN, y, size: 10, font, color: DARK });
    y -= 36;
    
    // Date
    page.drawText(`${data.tenantCity || '_______________'}, le ${formatDate(new Date().toISOString())}`, {
      x: MARGIN, y, size: 10, font, color: DARK,
    });
    y -= 10;
    page.drawText('Envoi recommandé', { x: MARGIN, y, size: 9, font: fontBold, color: rgb(0.8, 0.2, 0.2) });
    y -= 36;
    
    // Title
    page.drawText('Demande de baisse de loyer', { x: MARGIN, y, size: 16, font: fontBold, color: BLACK });
    y -= 12;
    page.drawText(`Art. 270a CO — Contestation du loyer en cours de bail`, { x: MARGIN, y, size: 9, font: fontItalic, color: GRAY });
    y -= 28;
    
    const letter = `Madame, Monsieur,

Par la présente, je me permets de solliciter une baisse du loyer de l'objet loué sis ${data.propAddr || '___'}, ${data.propNPA || '___'} ${data.propCity || '___'}.

Le loyer actuel de ${formatCHF(data.currentRent)} net par mois ne correspond plus aux conditions de marché et aux critères légaux en vigueur, pour les raisons suivantes:

1. Le taux hypothécaire de référence a baissé depuis la conclusion du bail. Il était de ${data.leaseRate || '___'}% à l'époque et se situe actuellement à 1.25% (source: Office fédéral du logement).

2. Selon le calcul de référence basé sur l'OBLF art. 12-13, le loyer devrait se situer aux alentours de ${formatCHF(data.fairRent)} net par mois.

En conséquence, conformément aux art. 270a et 270b CO, je vous demande de bien vouloir réduire le loyer mensuel net à ${formatCHF(data.fairRent)} dès le prochain terme contractuel.

À défaut d'accord amiable dans un délai de 30 jours, je me réserve le droit de saisir l'autorité de conciliation compétente (art. 274a CO).

Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.`;

    const paragraphs = letter.split('\n').filter(p => p.trim());
    for (const para of paragraphs) {
      y = drawTextBlock(page, para.trim(), MARGIN, y, font, 10, 595 - 2 * MARGIN, DARK);
      y -= 8;
    }
    
    y -= 16;
    page.drawText(data.tenantName || '_______________', { x: MARGIN, y, size: 10, font: fontBold, color: BLACK });
    y -= LINE_HEIGHT;
    page.drawLine({ start: { x: MARGIN, y: y + 4 }, end: { x: MARGIN + 180, y: y + 4 }, thickness: 0.5, color: LIGHT });
    
    drawFooter(page, font, 2, 2);
  }

  return doc.save();
}

// ═══════════════════════════════════════════════════════
// ÉTAT DES LIEUX (structure)
// ═══════════════════════════════════════════════════════
export async function generateEdlPDF(data) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  
  let page = doc.addPage([595, 842]);
  let y = 842 - MARGIN;
  
  const type = data.type === 'exit' ? 'SORTIE' : 'ENTRÉE';
  
  page.drawText(`ÉTAT DES LIEUX — ${type}`, { x: MARGIN, y, size: 18, font: fontBold, color: BLACK });
  y -= 20;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: 535, y }, thickness: 1, color: GOLD });
  y -= 24;
  
  y = drawField(page, 'Date', formatDate(data.date || new Date().toISOString()), MARGIN, y, font, fontBold);
  y = drawField(page, 'Objet', `${data.propAddr || ''}, ${data.propNPA || ''} ${data.propCity || ''}`, MARGIN, y, font, fontBold);
  y = drawField(page, 'Description', `${data.rooms || '?'} pièces, ${data.area || '?'} m²`, MARGIN, y, font, fontBold);
  y = drawField(page, 'Propriétaire', data.ownerName || '', MARGIN, y, font, fontBold);
  y = drawField(page, 'Locataire', data.tenantName || '', MARGIN, y, font, fontBold);
  y -= 16;
  
  // Room inspection grid
  const rooms = data.rooms ? Math.floor(Number(data.rooms)) : 3;
  const sections = [
    'Entrée / couloir',
    ...Array.from({ length: rooms - 1 }, (_, i) => i === 0 ? 'Séjour' : `Chambre ${i}`),
    'Cuisine',
    'Salle de bains',
    'WC',
    ...(data.balcony ? ['Balcon / terrasse'] : []),
    ...(data.cellar ? ['Cave'] : []),
  ];
  
  const items = ['Sols', 'Murs', 'Plafond', 'Fenêtres', 'Portes', 'Prises/interrupteurs', 'Éclairage', 'Remarques'];
  const states = ['Neuf', 'Bon', 'Usé', 'Endommagé'];
  
  for (const section of sections) {
    if (y < 200) {
      drawFooter(page, font, doc.getPageCount(), '?');
      page = doc.addPage([595, 842]);
      y = 842 - MARGIN;
    }
    
    y = drawSection(page, section.toUpperCase(), y, fontBold, 595);
    
    // Table header
    const colW = [180, 60, 60, 60, 60, 55];
    const headers = ['Élément', ...states, 'Note'];
    let x = MARGIN;
    for (let i = 0; i < headers.length; i++) {
      page.drawText(headers[i], { x, y, size: 7, font: fontBold, color: GRAY });
      x += colW[i];
    }
    y -= 4;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: 535, y }, thickness: 0.5, color: LIGHT });
    y -= 12;
    
    for (const item of items) {
      x = MARGIN;
      page.drawText(item, { x, y, size: 8, font, color: DARK });
      x += colW[0];
      for (let i = 0; i < 4; i++) {
        page.drawRectangle({
          x: x + 15, y: y - 2, width: 10, height: 10,
          borderColor: LIGHT, borderWidth: 0.5,
        });
        x += colW[i + 1];
      }
      // Note line
      page.drawLine({ start: { x, y: y - 1 }, end: { x: x + 48, y: y - 1 }, thickness: 0.3, color: LIGHT });
      y -= 14;
    }
    y -= 8;
  }
  
  // Signatures
  if (y < 140) {
    drawFooter(page, font, doc.getPageCount(), '?');
    page = doc.addPage([595, 842]);
    y = 842 - MARGIN;
  }
  
  y = drawSection(page, 'SIGNATURES', y, fontBold, 595);
  const boxW = (595 - 2 * MARGIN - 20) / 2;
  for (let i = 0; i < 2; i++) {
    const bx = MARGIN + i * (boxW + 20);
    page.drawRectangle({
      x: bx, y: y - 60, width: boxW, height: 65,
      borderColor: LIGHT, borderWidth: 0.5,
    });
    page.drawText(i === 0 ? 'Le bailleur' : 'Le locataire', {
      x: bx + 10, y: y - 12, size: 9, font: fontBold, color: DARK,
    });
    page.drawLine({
      start: { x: bx + 10, y: y - 50 },
      end: { x: bx + boxW - 10, y: y - 50 },
      thickness: 0.5, color: LIGHT,
    });
  }
  
  // Update all footers
  const total = doc.getPageCount();
  for (let i = 0; i < total; i++) {
    drawFooter(doc.getPage(i), font, i + 1, total);
  }
  
  return doc.save();
}
