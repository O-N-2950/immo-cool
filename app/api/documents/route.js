/**
 * immocool.ch — Document Generation API
 * 
 * POST /api/documents
 * 
 * Generates HTML documents (printable to PDF via browser).
 * Supports: bail, etat-des-lieux, quittance-cles, resiliation-check, resiliation-lettre
 */

import { NextResponse } from 'next/server';
import { generateBailHabitation } from '@/lib/documents/bail-habitation';
import { generateEtatDesLieux } from '@/lib/documents/etat-des-lieux';
import { generateQuittanceCles } from '@/lib/documents/quittance-cles';
import { verifierResiliation, generateLettreAccompagnement } from '@/lib/documents/resiliation-helper';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Le champ "type" est requis. Types: bail, etat-des-lieux, quittance-cles, resiliation-check, resiliation-lettre' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'bail': {
        const html = generateBailHabitation(data || {});
        result = { type: 'html', html, filename: `bail-habitation-${data?.locataire_nom || 'draft'}.html` };
        break;
      }

      case 'etat-des-lieux': {
        const html = generateEtatDesLieux(data || {});
        const subtype = data?.type === 'sortie' ? 'sortie' : 'entree';
        result = { type: 'html', html, filename: `etat-des-lieux-${subtype}-${data?.locataire_nom || 'draft'}.html` };
        break;
      }

      case 'quittance-cles': {
        const html = generateQuittanceCles(data || {});
        const subtype = data?.type === 'restitution' ? 'restitution' : 'remise';
        result = { type: 'html', html, filename: `quittance-cles-${subtype}-${data?.locataire_nom || 'draft'}.html` };
        break;
      }

      case 'resiliation-check': {
        if (!data?.date_envoi || !data?.date_resiliation_souhaitee) {
          return NextResponse.json(
            { error: 'date_envoi et date_resiliation_souhaitee sont requis pour la vérification' },
            { status: 400 }
          );
        }
        const verification = verifierResiliation(data);
        result = { type: 'json', ...verification };
        break;
      }

      case 'resiliation-lettre': {
        const html = generateLettreAccompagnement(data || {});
        result = {
          type: 'html', html,
          filename: `lettre-resiliation-${data?.locataire_nom || 'draft'}.html`,
          avertissement: "RAPPEL : Cette lettre n'est qu'un accompagnement. La résiliation par le bailleur DOIT inclure le formulaire officiel du canton (art. 266l CO).",
        };
        break;
      }

      default:
        return NextResponse.json(
          { error: `Type "${type}" non reconnu. Types: bail, etat-des-lieux, quittance-cles, resiliation-check, resiliation-lettre` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      document: result,
      meta: {
        generated_at: new Date().toISOString(),
        platform: 'immocool.ch',
        legal_notice: 'Document original immocool.ch — Conforme au CO suisse — Ne constitue pas un formulaire officiel cantonal',
      },
    });

  } catch (error) {
    console.error('[immocool.ch] Document generation error:', error.message);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du document', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/documents — List available document types
 */
export async function GET() {
  return NextResponse.json({
    platform: 'immocool.ch',
    documents: [
      {
        type: 'bail',
        name: 'Contrat de bail pour locaux d\'habitation',
        description: 'Formulaire original immocool.ch conforme au CO art. 253-274g et OBLF',
        methode: 'POST',
        champs_requis: ['bailleur_nom', 'locataire_nom', 'immeuble_rue', 'loyer_net', 'date_debut'],
      },
      {
        type: 'etat-des-lieux',
        name: 'État des lieux (entrée/sortie)',
        description: 'Formulaire dynamique conforme art. 256 et 267-267a CO',
        methode: 'POST',
        champs_requis: ['type (entree/sortie)', 'bailleur_nom', 'locataire_nom', 'immeuble_rue'],
        options: ['pieces (tableau de pièces personnalisé)', 'cles', 'compteurs'],
      },
      {
        type: 'quittance-cles',
        name: 'Quittance de clés (remise/restitution)',
        description: 'Document de traçabilité des clés et accès',
        methode: 'POST',
        champs_requis: ['type (remise/restitution)', 'bailleur_nom', 'locataire_nom'],
      },
      {
        type: 'resiliation-check',
        name: 'Vérification de résiliation',
        description: 'Vérifie la validité des dates, délais et conditions de résiliation',
        methode: 'POST',
        champs_requis: ['date_envoi', 'date_resiliation_souhaitee', 'canton'],
        note: 'Retourne un JSON avec la validation (pas un document)',
      },
      {
        type: 'resiliation-lettre',
        name: 'Lettre d\'accompagnement de résiliation',
        description: 'Lettre à joindre au formulaire officiel cantonal (art. 266l CO)',
        methode: 'POST',
        champs_requis: ['bailleur_nom', 'locataire_nom', 'date_resiliation', 'canton'],
        avertissement: 'NE REMPLACE PAS le formulaire officiel cantonal obligatoire (art. 266l CO)',
      },
    ],
    legal: {
      note: 'Tous les documents sont des créations originales immocool.ch.',
      conformite: 'CO art. 253-274g, OBLF, usages locatifs cantonaux',
      restriction: 'Pour la résiliation par le bailleur, le formulaire officiel du canton est OBLIGATOIRE (art. 266l CO).',
    },
  });
}
