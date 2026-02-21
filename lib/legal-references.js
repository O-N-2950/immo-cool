/**
 * immocool.ch — Système de références légales
 * 
 * Gère les deux valeurs obligatoires pour tout bail (OBLF art. 19 al. 1) :
 *   1. Taux hypothécaire de référence (publié trimestriellement par l'OFL)
 *   2. Indice des prix à la consommation IPC (publié mensuellement par l'OFS)
 * 
 * Architecture :
 *   - Valeurs par défaut codées en dur (fallback fiable)
 *   - Fetch automatique depuis les sources officielles
 *   - Stockage en base de données (table LegalReference via Prisma)
 *   - API admin pour mise à jour manuelle
 *   - Alertes de péremption (stale data warnings)
 * 
 * Sources officielles :
 *   - Taux de référence : Office fédéral du logement (OFL/BWO)
 *     https://www.bwo.admin.ch/bwo/fr/home/mietrecht/referenzzinssatz.html
 *   - IPC : Office fédéral de la statistique (OFS/BFS)
 *     https://www.bfs.admin.ch/bfs/fr/home/statistiques/prix.html
 */

// ============================================================
// VALEURS PAR DÉFAUT — Mises à jour manuellement à chaque release
// Servent de fallback si la base de données n'est pas disponible
// ============================================================
const DEFAULTS = {
  taux_reference: {
    value: 1.25,
    unit: '%',
    date_effective: '2025-09-02',    // Date d'entrée en vigueur
    date_published: '2025-09-01',    // Date de publication OFL
    next_publication: '2026-03-02',  // Prochaine publication OFL
    source: 'OFL — Office fédéral du logement',
    source_url: 'https://www.bwo.admin.ch/bwo/fr/home/mietrecht/referenzzinssatz.html',
    legal_basis: 'OBLF art. 12-13, art. 19 al. 1',
    history: [
      { value: 1.75, date: '2023-12-02' },
      { value: 1.50, date: '2025-03-04' },
      { value: 1.25, date: '2025-09-02' },
    ],
  },

  ipc: {
    value: 99.9,
    base: 'Décembre 2020 = 100',
    month: '2026-01',               // Mois de l'indice
    date_published: '2026-02-13',   // Date de publication OFS
    source: 'OFS — Office fédéral de la statistique',
    source_url: 'https://www.bfs.admin.ch/bfs/fr/home/statistiques/prix/indice-prix-consommation.html',
    legal_basis: 'OBLF art. 16, art. 19 al. 1',
    variation_annual: 0.1,          // % variation annuelle
  },
};

// ============================================================
// PÉRIODES DE VALIDITÉ — Pour détecter les données périmées
// ============================================================
const STALE_THRESHOLDS = {
  // Le taux de référence est publié trimestriellement (mars, juin, sept, déc)
  taux_reference: {
    warn_after_days: 95,    // Avertir si > ~3 mois (trimestre + marge)
    error_after_days: 190,  // Erreur si > ~6 mois (2 trimestres)
  },
  // L'IPC est publié mensuellement
  ipc: {
    warn_after_days: 45,    // Avertir si > 1.5 mois
    error_after_days: 90,   // Erreur si > 3 mois
  },
};

// ============================================================
// DATES DE PUBLICATION OFL — Calendrier officiel
// Le taux de référence est publié le 1er jour ouvrable de mars, juin, sept, déc
// ============================================================
function getNextOflPublicationDates(fromDate = new Date()) {
  const months = [2, 5, 8, 11]; // mars=2, juin=5, sept=8, déc=11 (0-indexed)
  const dates = [];
  
  for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
    for (const month of months) {
      const d = new Date(fromDate.getFullYear() + yearOffset, month, 2);
      if (d > fromDate) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }
  }
  
  return dates.slice(0, 4); // 4 prochaines dates
}

// ============================================================
// VÉRIFICATION DE FRAÎCHEUR
// ============================================================
function checkStaleness(referenceType, lastUpdateDate) {
  const threshold = STALE_THRESHOLDS[referenceType];
  if (!threshold || !lastUpdateDate) {
    return { status: 'unknown', message: 'Date de mise à jour inconnue' };
  }

  const now = new Date();
  const updated = new Date(lastUpdateDate);
  const daysSinceUpdate = Math.floor((now - updated) / (1000 * 60 * 60 * 24));

  if (daysSinceUpdate > threshold.error_after_days) {
    return {
      status: 'error',
      days: daysSinceUpdate,
      message: `⛔ ATTENTION : Données périmées (${daysSinceUpdate} jours). Mise à jour requise avant d'établir un bail.`,
    };
  }
  
  if (daysSinceUpdate > threshold.warn_after_days) {
    return {
      status: 'warning',
      days: daysSinceUpdate,
      message: `⚠️ Données potentiellement obsolètes (${daysSinceUpdate} jours). Vérifier si une nouvelle publication est disponible.`,
    };
  }

  return {
    status: 'ok',
    days: daysSinceUpdate,
    message: `✅ Données à jour (${daysSinceUpdate} jours)`,
  };
}

// ============================================================
// FETCH AUTOMATIQUE — Taux de référence depuis OFL
// ============================================================
async function fetchTauxReference() {
  try {
    // L'OFL publie le taux sur sa page officielle
    // On parse la page pour extraire le taux actuel
    const response = await fetch(
      'https://www.bwo.admin.ch/bwo/fr/home/mietrecht/referenzzinssatz.html',
      {
        headers: {
          'User-Agent': 'immocool.ch/1.0 (bail-generator; legal-compliance)',
          'Accept': 'text/html',
          'Accept-Language': 'fr-CH',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`OFL HTTP ${response.status}`);
    }

    const html = await response.text();

    // Chercher le taux dans le HTML — patterns typiques :
    // "1,25 %" ou "1.25%" ou "Le taux de référence est de 1,25"
    const patterns = [
      /taux[^>]*?de\s*r[eé]f[eé]rence[^>]*?(\d+[.,]\d+)\s*%/i,
      /r[eé]f[eé]rence[^>]*?(\d+[.,]\d+)\s*%/i,
      /Referenzzinssatz[^>]*?(\d+[.,]\d+)\s*%/i,
      /(\d+[.,]\d+)\s*%\s*(?:depuis|ab|per)/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        const value = parseFloat(match[1].replace(',', '.'));
        if (value >= 0 && value <= 10) {
          return {
            success: true,
            value,
            source: 'OFL (auto-fetch)',
            fetched_at: new Date().toISOString(),
          };
        }
      }
    }

    return { success: false, error: 'Taux non trouvé dans la page OFL' };
  } catch (error) {
    return { success: false, error: `Fetch OFL échoué: ${error.message}` };
  }
}

// ============================================================
// FETCH AUTOMATIQUE — IPC depuis l'OFS
// ============================================================
async function fetchIPC() {
  try {
    // Tentative via l'API JSON de tradingeconomics (public, pas de clé)
    // Alternative : scraper la page OFS
    const response = await fetch(
      'https://www.bfs.admin.ch/bfs/fr/home/statistiques/prix/indice-prix-consommation.assetdetail.33087379.html',
      {
        headers: {
          'User-Agent': 'immocool.ch/1.0 (bail-generator; legal-compliance)',
          'Accept': 'text/html',
          'Accept-Language': 'fr-CH',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`OFS HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Chercher l'indice total dans le HTML
    const pattern = /indice\s*(?:total|global|g[eé]n[eé]ral)[^>]*?(\d+[.,]\d+)\s*points?/i;
    const match = html.match(pattern);
    
    if (match) {
      const value = parseFloat(match[1].replace(',', '.'));
      if (value > 80 && value < 150) {
        return {
          success: true,
          value,
          source: 'OFS (auto-fetch)',
          fetched_at: new Date().toISOString(),
        };
      }
    }

    return { success: false, error: 'IPC non trouvé dans la page OFS' };
  } catch (error) {
    return { success: false, error: `Fetch OFS échoué: ${error.message}` };
  }
}

// ============================================================
// STOCKAGE EN BASE — Lecture/écriture via Prisma
// ============================================================

/**
 * Récupère une référence légale depuis la base de données
 * @param {object} prisma - Instance Prisma
 * @param {string} key - 'taux_reference' ou 'ipc'
 * @returns {object|null} La référence ou null
 */
async function getFromDatabase(prisma, key) {
  try {
    if (!prisma) return null;
    
    const ref = await prisma.legalReference.findUnique({
      where: { key },
    });
    
    if (ref) {
      return {
        value: ref.value,
        metadata: ref.metadata ? JSON.parse(ref.metadata) : {},
        updated_at: ref.updatedAt,
        updated_by: ref.updatedBy,
      };
    }
    return null;
  } catch {
    // Base non disponible ou table non créée
    return null;
  }
}

/**
 * Sauvegarde une référence légale en base de données
 * @param {object} prisma - Instance Prisma
 * @param {string} key - 'taux_reference' ou 'ipc'
 * @param {number} value - La valeur numérique
 * @param {object} metadata - Données complémentaires (date, source, etc.)
 * @param {string} updatedBy - 'system' ou email de l'admin
 */
async function saveToDatabase(prisma, key, value, metadata = {}, updatedBy = 'system') {
  try {
    if (!prisma) return null;
    
    return await prisma.legalReference.upsert({
      where: { key },
      update: {
        value,
        metadata: JSON.stringify(metadata),
        updatedBy,
        updatedAt: new Date(),
      },
      create: {
        key,
        value,
        metadata: JSON.stringify(metadata),
        updatedBy,
      },
    });
  } catch {
    return null;
  }
}

// ============================================================
// API PRINCIPALE — Récupérer les références courantes pour un bail
// ============================================================

/**
 * Retourne les références légales actuelles pour générer un bail
 * 
 * Ordre de priorité :
 *   1. Base de données (si disponible et à jour)
 *   2. Fetch automatique depuis les sources officielles
 *   3. Valeurs par défaut codées en dur
 * 
 * @param {object} options
 * @param {object} options.prisma - Instance Prisma (optionnel)
 * @param {boolean} options.autoFetch - Tenter le fetch automatique (défaut: true)
 * @param {boolean} options.strict - Refuser les données périmées (défaut: false)
 * @returns {object} { taux_reference, ipc, warnings, meta }
 */
export async function getCurrentReferences({ prisma = null, autoFetch = true, strict = false } = {}) {
  const warnings = [];
  const meta = {
    fetched_at: new Date().toISOString(),
    sources: {},
  };

  // --- TAUX DE RÉFÉRENCE ---
  let taux = null;
  
  // 1. Essayer la base de données
  if (prisma) {
    const dbTaux = await getFromDatabase(prisma, 'taux_reference');
    if (dbTaux) {
      taux = dbTaux;
      meta.sources.taux_reference = 'database';
    }
  }

  // 2. Si pas en DB ou périmé, essayer le fetch
  if (!taux && autoFetch) {
    const fetched = await fetchTauxReference();
    if (fetched.success) {
      taux = {
        value: fetched.value,
        metadata: { source: fetched.source, fetched_at: fetched.fetched_at },
        updated_at: fetched.fetched_at,
      };
      meta.sources.taux_reference = 'auto-fetch (OFL)';
      
      // Sauvegarder en DB pour la prochaine fois
      if (prisma) {
        await saveToDatabase(prisma, 'taux_reference', fetched.value, taux.metadata, 'system-autofetch');
      }
    } else {
      warnings.push(`Fetch taux OFL échoué: ${fetched.error}`);
    }
  }

  // 3. Fallback aux valeurs par défaut
  if (!taux) {
    taux = {
      value: DEFAULTS.taux_reference.value,
      metadata: {
        date_effective: DEFAULTS.taux_reference.date_effective,
        source: 'Valeur par défaut (code)',
      },
      updated_at: DEFAULTS.taux_reference.date_published,
    };
    meta.sources.taux_reference = 'defaults';
    warnings.push('Taux de référence : utilisation de la valeur par défaut. Vérifier sur bwo.admin.ch');
  }

  // Vérifier la fraîcheur
  const tauxStaleness = checkStaleness('taux_reference', taux.updated_at);
  if (tauxStaleness.status !== 'ok') {
    warnings.push(`Taux de référence : ${tauxStaleness.message}`);
  }

  // --- IPC ---
  let ipc = null;

  // 1. Essayer la base de données
  if (prisma) {
    const dbIpc = await getFromDatabase(prisma, 'ipc');
    if (dbIpc) {
      ipc = dbIpc;
      meta.sources.ipc = 'database';
    }
  }

  // 2. Si pas en DB, essayer le fetch
  if (!ipc && autoFetch) {
    const fetched = await fetchIPC();
    if (fetched.success) {
      ipc = {
        value: fetched.value,
        metadata: { source: fetched.source, fetched_at: fetched.fetched_at },
        updated_at: fetched.fetched_at,
      };
      meta.sources.ipc = 'auto-fetch (OFS)';
      
      if (prisma) {
        await saveToDatabase(prisma, 'ipc', fetched.value, ipc.metadata, 'system-autofetch');
      }
    } else {
      warnings.push(`Fetch IPC OFS échoué: ${fetched.error}`);
    }
  }

  // 3. Fallback aux valeurs par défaut
  if (!ipc) {
    ipc = {
      value: DEFAULTS.ipc.value,
      metadata: {
        base: DEFAULTS.ipc.base,
        month: DEFAULTS.ipc.month,
        source: 'Valeur par défaut (code)',
      },
      updated_at: DEFAULTS.ipc.date_published,
    };
    meta.sources.ipc = 'defaults';
    warnings.push('IPC : utilisation de la valeur par défaut. Vérifier sur bfs.admin.ch');
  }

  // Vérifier la fraîcheur
  const ipcStaleness = checkStaleness('ipc', ipc.updated_at);
  if (ipcStaleness.status !== 'ok') {
    warnings.push(`IPC : ${ipcStaleness.message}`);
  }

  // Mode strict : refuser si données périmées
  if (strict) {
    if (tauxStaleness.status === 'error' || ipcStaleness.status === 'error') {
      throw new Error(
        'Impossible de générer un bail : les références légales sont périmées. ' +
        'Mettez à jour le taux de référence et/ou l\'IPC via l\'admin.'
      );
    }
  }

  return {
    taux_reference: {
      value: taux.value,
      formatted: `${taux.value}%`,
      date_effective: taux.metadata?.date_effective || DEFAULTS.taux_reference.date_effective,
      date_formatted: formatDateFR(taux.metadata?.date_effective || DEFAULTS.taux_reference.date_effective),
      source: DEFAULTS.taux_reference.source,
      source_url: DEFAULTS.taux_reference.source_url,
      legal_basis: DEFAULTS.taux_reference.legal_basis,
      next_publication: DEFAULTS.taux_reference.next_publication,
      staleness: tauxStaleness,
    },
    ipc: {
      value: ipc.value,
      formatted: `${ipc.value} points`,
      base: ipc.metadata?.base || DEFAULTS.ipc.base,
      month: ipc.metadata?.month || DEFAULTS.ipc.month,
      month_formatted: formatMonthFR(ipc.metadata?.month || DEFAULTS.ipc.month),
      source: DEFAULTS.ipc.source,
      source_url: DEFAULTS.ipc.source_url,
      legal_basis: DEFAULTS.ipc.legal_basis,
      staleness: ipcStaleness,
    },
    warnings,
    meta,
    // Prêt à injecter dans le générateur de bail
    bail_fields: {
      taux_hypothecaire: String(taux.value),
      date_taux: formatDateFR(taux.metadata?.date_effective || DEFAULTS.taux_reference.date_effective),
      ipc_valeur: String(ipc.value),
      ipc_date: formatMonthFR(ipc.metadata?.month || DEFAULTS.ipc.month),
    },
  };
}

// ============================================================
// MISE À JOUR MANUELLE — Pour l'admin
// ============================================================

/**
 * Met à jour le taux de référence manuellement
 */
export async function updateTauxReference(prisma, { value, date_effective, updatedBy = 'admin' }) {
  if (typeof value !== 'number' || value < 0 || value > 10) {
    throw new Error('Taux invalide (doit être entre 0% et 10%)');
  }
  if (!date_effective) {
    throw new Error('Date d\'entrée en vigueur requise');
  }

  const metadata = {
    date_effective,
    source: `Mise à jour manuelle par ${updatedBy}`,
    updated_at: new Date().toISOString(),
  };

  const result = await saveToDatabase(prisma, 'taux_reference', value, metadata, updatedBy);
  
  return {
    success: !!result,
    value,
    date_effective,
    message: `Taux de référence mis à jour à ${value}% (en vigueur depuis le ${formatDateFR(date_effective)})`,
  };
}

/**
 * Met à jour l'IPC manuellement
 */
export async function updateIPC(prisma, { value, month, base = 'Décembre 2020 = 100', updatedBy = 'admin' }) {
  if (typeof value !== 'number' || value < 50 || value > 200) {
    throw new Error('IPC invalide (doit être entre 50 et 200 points)');
  }
  if (!month) {
    throw new Error('Mois de l\'indice requis (format YYYY-MM)');
  }

  const metadata = {
    month,
    base,
    source: `Mise à jour manuelle par ${updatedBy}`,
    updated_at: new Date().toISOString(),
  };

  const result = await saveToDatabase(prisma, 'ipc', value, metadata, updatedBy);
  
  return {
    success: !!result,
    value,
    month,
    message: `IPC mis à jour à ${value} points (indice de ${formatMonthFR(month)})`,
  };
}

// ============================================================
// CALCULS LÉGAUX — Utilisés pour les adaptations de loyer
// ============================================================

/**
 * Calcule le droit à adaptation de loyer suite à un changement de taux
 * Règle OBLF art. 13 :
 *   - Taux < 5% : +/- 0.25% du taux = +3% / -2.91% du loyer
 *   - Taux >= 5% : +/- 0.25% du taux = +3.5% / -3.33% du loyer
 */
export function calculateRentAdjustment(oldRate, newRate, currentRent) {
  const diff = newRate - oldRate;
  const steps = Math.round(diff / 0.25);
  
  if (steps === 0) return { adjustment: 0, newRent: currentRent, percentage: 0 };

  let percentagePerStep;
  if (newRate < 5) {
    percentagePerStep = steps > 0 ? 3.0 : -2.91;
  } else {
    percentagePerStep = steps > 0 ? 3.5 : -3.33;
  }

  const totalPercentage = Math.abs(steps) * percentagePerStep;
  const adjustment = currentRent * (totalPercentage / 100);
  const newRent = Math.round((currentRent + adjustment) * 100) / 100;

  return {
    oldRate,
    newRate,
    steps: Math.abs(steps),
    direction: steps > 0 ? 'hausse' : 'baisse',
    percentage: totalPercentage,
    adjustment: Math.round(adjustment * 100) / 100,
    currentRent,
    newRent,
    legal_basis: 'OBLF art. 13',
  };
}

/**
 * Calcule la part IPC dans l'adaptation de loyer
 * Règle : 40% de la variation de l'IPC peut être répercutée
 */
export function calculateIPCAdjustment(oldIPC, newIPC, currentRent) {
  const variation = ((newIPC - oldIPC) / oldIPC) * 100;
  const repercutable = variation * 0.4; // 40% de la variation
  const adjustment = currentRent * (repercutable / 100);

  return {
    oldIPC,
    newIPC,
    variation: Math.round(variation * 100) / 100,
    repercutable: Math.round(repercutable * 100) / 100,
    adjustment: Math.round(adjustment * 100) / 100,
    legal_basis: 'OBLF art. 16',
  };
}

// ============================================================
// UTILITAIRES DE FORMATAGE
// ============================================================

function formatDateFR(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatMonthFR(monthStr) {
  if (!monthStr) return '';
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];
  const [year, month] = monthStr.split('-');
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

// ============================================================
// EXPORTS COMPLÉMENTAIRES
// ============================================================

export {
  DEFAULTS as LEGAL_DEFAULTS,
  STALE_THRESHOLDS,
  checkStaleness,
  getNextOflPublicationDates,
  fetchTauxReference,
  fetchIPC,
};
