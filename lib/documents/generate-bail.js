/**
 * immocool.ch — Générateur de bail avec injection automatique des références légales
 * 
 * Ce module wrape le générateur HTML de bail pour :
 *   1. Récupérer automatiquement le taux de référence et l'IPC actuels
 *   2. Les injecter dans le bail
 *   3. Logger un avertissement si les données sont potentiellement périmées
 *   4. Refuser de générer en mode strict si les données sont trop vieilles
 * 
 * Usage :
 *   import { generateBail } from '@/lib/documents/generate-bail';
 *   const { html, warnings, references } = await generateBail({ ...bailData }, { prisma });
 */

import { generateBailHabitation } from './bail-habitation.js';
import { getCurrentReferences, LEGAL_DEFAULTS } from '../legal-references.js';

/**
 * Génère un contrat de bail HTML avec les références légales actuelles
 * 
 * @param {object} data - Données du bail (parties, objet, loyer, etc.)
 * @param {object} options
 * @param {object} options.prisma - Instance Prisma (optionnel)
 * @param {boolean} options.strict - Refuser si données périmées (défaut: false)
 * @param {boolean} options.autoFetch - Chercher les valeurs en ligne (défaut: false)
 * @param {boolean} options.overrideReferences - Si true, ne pas écraser les valeurs fournies dans data
 * @returns {object} { html, warnings, references, generated_at }
 */
export async function generateBail(data, options = {}) {
  const {
    prisma = null,
    strict = false,
    autoFetch = false,
    overrideReferences = false,
  } = options;

  const warnings = [];
  let references;

  try {
    // Récupérer les références légales actuelles
    references = await getCurrentReferences({ prisma, autoFetch, strict });
    warnings.push(...references.warnings);
  } catch (error) {
    if (strict) throw error;
    
    // En mode non-strict, utiliser les defaults
    warnings.push(`Impossible de récupérer les références: ${error.message}. Utilisation des valeurs par défaut.`);
    references = {
      bail_fields: {
        taux_hypothecaire: String(LEGAL_DEFAULTS.taux_reference.value),
        date_taux: formatDate(LEGAL_DEFAULTS.taux_reference.date_effective),
        ipc_valeur: String(LEGAL_DEFAULTS.ipc.value),
        ipc_date: formatMonth(LEGAL_DEFAULTS.ipc.month),
      },
      taux_reference: { value: LEGAL_DEFAULTS.taux_reference.value },
      ipc: { value: LEGAL_DEFAULTS.ipc.value },
    };
  }

  // Injecter les références dans les données du bail
  // Sauf si l'utilisateur a explicitement fourni ses propres valeurs et overrideReferences=true
  const bailData = { ...data };

  if (!overrideReferences || !data.taux_hypothecaire) {
    bailData.taux_hypothecaire = references.bail_fields.taux_hypothecaire;
    bailData.date_taux = references.bail_fields.date_taux;
  }

  if (!overrideReferences || !data.ipc_valeur) {
    bailData.ipc_valeur = references.bail_fields.ipc_valeur;
    bailData.ipc_date = references.bail_fields.ipc_date;
  }

  // Générer le HTML
  const html = generateBailHabitation(bailData);

  return {
    html,
    warnings,
    references: {
      taux_reference: references.taux_reference,
      ipc: references.ipc,
    },
    generated_at: new Date().toISOString(),
    legal_compliance: {
      oblf_art_19: true,
      taux_included: true,
      ipc_included: true,
      loyer_ancien_included: !!bailData.loyer_ancien_locataire,
    },
  };
}

// ============================================================
// Format helpers (dupliqués ici pour éviter les imports circulaires)
// ============================================================
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatMonth(monthStr) {
  if (!monthStr) return '';
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];
  const [year, month] = monthStr.split('-');
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export default generateBail;
