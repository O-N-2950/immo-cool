import { NextResponse } from 'next/server';
import { generateContestationPDF } from '../../../../lib/pdf-engine.js';

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const CURRENT_RATE = 1.25; // Taux hypothécaire de référence actuel (OFL, 2026)
const CURRENT_IPC = 107.1; // IPC base déc. 2020 = 100 (OFS, 2025)

// Calcul de la baisse due au taux hypothécaire (méthode relative simplifiée)
// Chaque baisse de 0.25% → ~2.91% de baisse de loyer (jurisprudence)
function calculateHypoReduction(oldRate, newRate) {
  if (oldRate <= newRate) return 0;
  const steps = (oldRate - newRate) / 0.25;
  return steps * 2.91; // % de réduction
}

// Calcul simplifié du loyer de référence
function calculateFairRent(data) {
  const currentRent = Number(data.currentRent);
  const leaseRate = Number(data.leaseRate);
  
  if (!currentRent || !leaseRate) return null;
  
  // Réduction due au taux hypothécaire
  const hypoReduction = calculateHypoReduction(leaseRate, CURRENT_RATE);
  
  // Ajustement IPC (si on connaît l'IPC au moment du bail)
  let ipcAdjust = 0;
  if (data.leaseIPC) {
    const ipcChange = ((CURRENT_IPC - Number(data.leaseIPC)) / Number(data.leaseIPC)) * 100;
    ipcAdjust = ipcChange * 0.4; // 40% de la hausse IPC est répercutable
  }
  
  // Loyer de référence = loyer actuel * (1 - réduction hypo + ajust IPC)
  const netReduction = hypoReduction - Math.max(0, ipcAdjust);
  const fairRent = Math.round(currentRent * (1 - netReduction / 100));
  
  return {
    fairRent: Math.max(fairRent, currentRent * 0.7), // Plafond: -30% max
    reduction: netReduction,
    hypoReduction,
    ipcAdjust,
    saving: Math.max(0, currentRent - fairRent),
    overpricePercent: netReduction > 0 ? netReduction.toFixed(1) : '0',
  };
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.currentRent || !data.canton) {
      return NextResponse.json({ error: 'Loyer actuel et canton requis' }, { status: 400 });
    }
    
    // ── CALCUL ALGORITHMIQUE ──
    const calc = calculateFairRent(data);
    if (!calc) {
      return NextResponse.json({ error: 'Données insuffisantes pour le calcul' }, { status: 400 });
    }
    
    let aiExplanation = null;
    
    // ── ANALYSE IA (si clé disponible) ──
    if (ANTHROPIC_KEY && calc.saving > 0) {
      try {
        const prompt = `Analyse ce bail suisse et explique en 4-5 lignes max pourquoi le loyer semble trop élevé:
- Canton: ${data.canton}, Ville: ${data.propCity || 'non précisée'}
- ${data.rooms || '?'} pièces, ${data.area || '?'} m²
- Loyer actuel: CHF ${data.currentRent}/mois
- Taux hypo. au moment du bail: ${data.leaseRate}%, actuel: ${CURRENT_RATE}%
- Baisse hypo. calculée: ${calc.hypoReduction.toFixed(1)}%
- Loyer de référence estimé: CHF ${calc.fairRent}
- Économie potentielle: CHF ${calc.saving}/mois

Mentionne les articles de loi pertinents (CO 270a, OBLF 12-13). Sois factuel et précis. Ne mentionne PAS immo.cool.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 400,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        const aiData = await response.json();
        aiExplanation = aiData.content?.map(b => b.text || '').join('\n') || null;
      } catch (e) {
        console.error('AI analysis failed:', e.message);
      }
    }
    
    // ── FALLBACK EXPLICATION ──
    if (!aiExplanation && calc.saving > 0) {
      aiExplanation = `Le taux hypothécaire de référence a baissé de ${data.leaseRate}% à ${CURRENT_RATE}% depuis la conclusion de votre bail. Selon l'OBLF art. 12-13 et la jurisprudence du Tribunal fédéral, chaque baisse de 0.25% du taux de référence ouvre droit à une réduction de loyer d'environ 2.91%. La baisse cumulée de ${calc.hypoReduction.toFixed(1)}% justifie une demande de réduction conformément à l'art. 270a CO (contestation du loyer en cours de bail).`;
    }
    
    // ── CHOIX: JSON ou PDF ──
    const format = data.format || 'json';
    
    if (format === 'pdf') {
      const pdfData = {
        ...data,
        fairRent: calc.fairRent,
        estimatedSaving: calc.saving,
        overpricePercent: calc.overpricePercent,
        aiExplanation,
      };
      
      const pdfBytes = await generateContestationPDF(pdfData);
      
      return new Response(pdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="analyse-loyer-${Date.now()}.pdf"`,
          'Content-Length': pdfBytes.length.toString(),
        },
      });
    }
    
    // JSON response
    return NextResponse.json({
      fairRent: calc.fairRent,
      saving: calc.saving,
      savingAnnual: calc.saving * 12,
      overpricePercent: calc.overpricePercent,
      hypoReduction: calc.hypoReduction.toFixed(1),
      currentRate: CURRENT_RATE,
      leaseRate: data.leaseRate,
      explanation: aiExplanation,
      canContest: calc.saving > 20, // Seuil minimum pour contester
      legalBasis: [
        'CO art. 270a — Contestation du loyer en cours de bail',
        'CO art. 270b — Délai de contestation: 30 jours',
        'OBLF art. 12-13 — Taux hypothécaire de référence',
        'OBLF art. 16 — Hausse des charges',
      ],
    });
    
  } catch (error) {
    console.error('Contestation error:', error);
    return NextResponse.json({ error: 'Erreur de calcul' }, { status: 500 });
  }
}
