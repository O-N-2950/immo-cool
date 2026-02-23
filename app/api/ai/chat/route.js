import { NextResponse } from 'next/server';

// Server-side — API key never exposed to client
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `Tu es l'assistant juridique IA d'immo.cool, la première régie immobilière 100% automatisée de Suisse.

EXPERTISE:
- Droit du bail suisse (CO art. 253-274g, OBLF)
- Réglementations des 26 cantons
- Taux hypothécaire de référence (actuellement 1.25%, publié par l'OFL)
- Indice des prix à la consommation (IPC, publié par l'OFS)
- Formulaires de loyer initial (obligatoires dans GE, VD, NE, FR, ZG, ZH, NW)
- Délais de résiliation par canton
- Garantie de loyer (max 3 mois, art. 257e CO)
- GoCaution et alternatives
- État des lieux (OBLF art. 258)
- Sous-location (CO art. 262)

RÈGLES:
- Réponds de manière concise et professionnelle
- Cite les articles de loi quand pertinent
- Précise toujours le canton concerné quand applicable
- Si tu n'es pas sûr, dis-le — ne fabrique pas de fausses informations juridiques
- Termine par une suggestion d'action concrète quand possible
- Rappelle que tu n'es pas un avocat et qu'en cas de litige, consulter un spécialiste est recommandé`;

export async function POST(request) {
  try {
    const { message, lang = 'fr' } = await request.json();
    
    if (!message || typeof message !== 'string' || message.length > 2000) {
      return NextResponse.json({ error: 'Message invalide' }, { status: 400 });
    }

    if (!ANTHROPIC_KEY) {
      // Fallback si pas de clé — réponses prédéfinies
      return NextResponse.json({ 
        reply: getFallbackResponse(message, lang) 
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: SYSTEM_PROMPT + (lang === 'de' ? '\n\nRéponds en ALLEMAND.' : '\n\nRéponds en FRANÇAIS.'),
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    const reply = data.content?.map(b => b.text || '').join('\n') || 'Erreur de traitement.';
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json({ 
      reply: 'Service temporairement indisponible. Veuillez réessayer.' 
    }, { status: 500 });
  }
}

function getFallbackResponse(message, lang) {
  const q = message.toLowerCase();
  
  if (q.includes('résili') || q.includes('kündig')) {
    return lang === 'de' 
      ? 'Die Kündigungsfristen variieren je nach Kanton. In der Regel beträgt die Frist 3 Monate auf das Ende eines Quartals (31.03, 30.06, 30.09, 31.12). In Genf und Waadt gelten spezielle Regeln. Welcher Kanton betrifft Sie?'
      : 'Les délais de résiliation varient selon les cantons. En règle générale, le préavis est de 3 mois pour la fin d\'un trimestre (31.03, 30.06, 30.09, 31.12). Genève et Vaud ont des règles spécifiques. Quel canton vous concerne ?';
  }
  if (q.includes('garantie') || q.includes('kaution') || q.includes('dépôt')) {
    return lang === 'de'
      ? 'Die Mietkaution darf maximal 3 Monatsmieten betragen (Art. 257e OR). Sie muss auf einem Sperrkonto bei einer Bank hinterlegt werden. Alternativen wie GoCaution ermöglichen eine Kautionsversicherung statt einer Bankeinlage.'
      : 'La garantie de loyer est de maximum 3 mois de loyer net (art. 257e CO). Elle doit être déposée sur un compte bloqué auprès d\'une banque. Des alternatives comme GoCaution permettent une assurance de garantie au lieu d\'un dépôt bancaire.';
  }
  if (q.includes('taux') || q.includes('hypothé') || q.includes('referenz')) {
    return lang === 'de'
      ? 'Der aktuelle Referenzzinssatz beträgt 1.25% (Stand 2026). Dieser wird vom Bundesamt für Wohnungswesen (BWO) vierteljährlich veröffentlicht und dient als Grundlage für Mietzinsanpassungen.'
      : 'Le taux hypothécaire de référence actuel est de 1.25% (2026). Il est publié trimestriellement par l\'Office fédéral du logement (OFL) et sert de base pour les adaptations de loyer (OBLF art. 12-13).';
  }
  
  return lang === 'de'
    ? 'Ich kann Ihnen bei Fragen zum Schweizer Mietrecht helfen: Kündigungsfristen, Mietkaution, Referenzzinssatz, Mietvertrag, Übergabeprotokoll und mehr. Was möchten Sie wissen?'
    : 'Je peux vous aider sur le droit du bail suisse : résiliation, garantie, taux hypothécaire, bail, état des lieux et plus. Que souhaitez-vous savoir ?';
}
