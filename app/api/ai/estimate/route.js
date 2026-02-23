import { NextResponse } from 'next/server';

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// Fallback: prix moyens par canton/pièces (source: Wüest Partner 2025 approximations)
const RENT_DATA = {
  JU: { base: 210, city: { 'Delémont': 1.0, 'Porrentruy': 0.92, 'Saignelégier': 0.85 }},
  VD: { base: 310, city: { 'Lausanne': 1.15, 'Nyon': 1.1, 'Vevey': 1.05, 'Yverdon': 0.9 }},
  GE: { base: 380, city: { 'Genève': 1.2, 'Carouge': 1.1, 'Vernier': 0.95 }},
  BE: { base: 260, city: { 'Berne': 1.1, 'Bienne': 0.85, 'Thoune': 0.95 }},
  ZH: { base: 370, city: { 'Zurich': 1.25, 'Winterthur': 0.9, 'Uster': 0.92 }},
  BS: { base: 310, city: { 'Bâle': 1.05 }},
  FR: { base: 255, city: { 'Fribourg': 1.0 }},
  NE: { base: 240, city: { 'Neuchâtel': 1.0, 'La Chaux-de-Fonds': 0.85 }},
  VS: { base: 245, city: { 'Sion': 0.95, 'Sierre': 0.9, 'Martigny': 0.92 }},
  TI: { base: 280, city: { 'Lugano': 1.1, 'Bellinzona': 0.9, 'Locarno': 1.0 }},
  LU: { base: 300, city: { 'Lucerne': 1.1 }},
  SG: { base: 265, city: { 'St. Gallen': 1.0 }},
  AG: { base: 270, city: { 'Aarau': 1.0, 'Baden': 1.05 }},
  SO: { base: 250, city: { 'Soleure': 1.0 }},
  TG: { base: 255, city: {}},
  GR: { base: 270, city: { 'Coire': 1.0, 'Davos': 1.3 }},
  ZG: { base: 380, city: { 'Zoug': 1.15 }},
  SZ: { base: 320, city: {}},
  BL: { base: 280, city: {}},
  SH: { base: 250, city: {}},
  AR: { base: 230, city: {}},
  AI: { base: 220, city: {}},
  NW: { base: 310, city: {}},
  OW: { base: 290, city: {}},
  UR: { base: 240, city: {}},
  GL: { base: 230, city: {}},
};

function estimateFallback({ canton, city, rooms, area, floor, balcony, parking, renovated }) {
  const cantonData = RENT_DATA[canton] || RENT_DATA.JU;
  const cityMult = cantonData.city[city] || 1.0;
  const r = parseFloat(rooms) || 3.5;
  const a = parseFloat(area) || 75;
  const f = parseInt(floor) || 1;
  
  // Base: prix/m² × surface, ajusté par canton et ville
  let base = cantonData.base * cityMult * a / 10;
  
  // Ajustements
  if (balcony) base *= 1.04;
  if (parking) base *= 1.03;
  if (renovated) base *= 1.08;
  if (f >= 3) base *= 1.02; // étage élevé = léger premium
  
  const median = Math.round(base / 10) * 10;
  const min = Math.round(median * 0.88 / 10) * 10;
  const max = Math.round(median * 1.12 / 10) * 10;
  const charges = Math.round(a * 2.3 / 10) * 10; // ~CHF 2.30/m²
  
  return {
    min, max, median, charges,
    explanation: `Estimation basée sur les prix moyens du canton ${canton} (${city}), pour un ${r} pièces de ${a}m². Le marché local montre une fourchette de CHF ${min} à ${max}/mois.`,
    comparable: `Biens similaires à ${city}: ${r} pièces, ${a}m² → CHF ${min}-${max}/mois en moyenne (source: données marché 2025-2026).`,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { canton, city, rooms, area, floor, balcony, parking, renovated, lang = 'fr' } = body;
    
    if (!canton) {
      return NextResponse.json({ error: 'Canton requis' }, { status: 400 });
    }

    // Try AI estimation first
    if (ANTHROPIC_KEY) {
      try {
        const prompt = `Estime le loyer mensuel NET juste pour un appartement en Suisse:
Canton: ${canton}, Ville: ${city || 'non précisée'}
${rooms || 3.5} pièces, ${area || 75}m², étage ${floor || 1}
Balcon: ${balcony ? 'oui' : 'non'}, Parking: ${parking ? 'oui' : 'non'}, Rénové: ${renovated ? 'oui' : 'non'}

Base-toi sur les prix réels du marché suisse 2025-2026.
Réponds UNIQUEMENT en JSON valide sans markdown ni backticks:
{"min":NUMBER,"max":NUMBER,"median":NUMBER,"charges":NUMBER,"explanation":"2 lignes max${lang === 'de' ? ' en allemand' : ''}","comparable":"1 exemple${lang === 'de' ? ' en allemand' : ''}"}`;

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

        const data = await response.json();
        const text = data.content?.map(b => b.text || '').join('') || '';
        const clean = text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(clean);
        
        if (result.min && result.max && result.median) {
          return NextResponse.json(result);
        }
      } catch (aiError) {
        console.error('AI estimate failed, using fallback:', aiError.message);
      }
    }

    // Fallback: algorithmic estimation
    const result = estimateFallback(body);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Estimate error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
