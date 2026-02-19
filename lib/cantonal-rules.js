/**
 * immo.cool — Moteur de règles cantonales
 * 
 * Base de données complète des réglementations par canton suisse.
 * Source: Réglementation_Bail_Suisse_par_Canton.md (projet)
 * 
 * Couvre:
 * - Dates de résiliation officielles
 * - Formulaire de loyer initial obligatoire
 * - Garantie de loyer (particularités cantonales)
 * - Autorités de conciliation
 * - Taux hypothécaire de référence
 * - Délais de résiliation
 */

// ============================================
// CANTONAL DATABASE
// ============================================

export const CANTONS = {
  AG: {
    code: "AG", name: "Argovie", nameDe: "Aargau",
    terminationDates: ["03-01", "06-30", "09-30"],
    terminationNotice: 3, // months
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Mietamt / Schlichtungsbehörde des Bezirks",
    language: "de",
    penurieLogement: false,
  },
  AI: {
    code: "AI", name: "Appenzell Rh.-Int.", nameDe: "Appenzell Innerrhoden",
    terminationDates: "monthly_except_december",
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Vermittleramt",
    language: "de",
    penurieLogement: false,
  },
  AR: {
    code: "AR", name: "Appenzell Rh.-Ext.", nameDe: "Appenzell Ausserrhoden",
    terminationDates: "monthly_except_december",
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  BL: {
    code: "BL", name: "Bâle-Campagne", nameDe: "Basel-Landschaft",
    terminationDates: "monthly_except_december",
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Mietamt / Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  BS: {
    code: "BS", name: "Bâle-Ville", nameDe: "Basel-Stadt",
    terminationDates: "monthly_except_december",
    terminationNotice: 3,
    initialRentFormRequired: true,
    initialRentFormScope: "Tout le canton",
    depositMax: 3,
    conciliationAuthority: "Staatliche Schlichtungsstelle für Mietstreitigkeiten",
    language: "de",
    penurieLogement: true,
  },
  BE: {
    code: "BE", name: "Berne", nameDe: "Bern",
    terminationDates: ["04-30", "10-31"],
    terminationNotice: 3,
    initialRentFormRequired: true,
    initialRentFormScope: "Tout le canton (depuis le 1er décembre 2025)",
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde des Kreises / Commission de conciliation",
    language: "de/fr",
    penurieLogement: true,
  },
  FR: {
    code: "FR", name: "Fribourg", nameDe: "Freiburg",
    terminationDates: ["03-31", "06-30", "09-30", "12-31"],
    terminationNotice: 3,
    initialRentFormRequired: true,
    initialRentFormScope: "Tout le canton",
    depositMax: 3,
    conciliationAuthority: "Commissions de conciliation (Sarine, Singine-Lac, Districts du Sud) + Tribunal des baux",
    language: "fr/de",
    penurieLogement: true,
  },
  GE: {
    code: "GE", name: "Genève", nameDe: "Genf",
    terminationDates: null, // pas de dates locales
    terminationNotice: 3,
    initialRentFormRequired: true,
    initialRentFormScope: "Tout le canton",
    depositMax: 3,
    conciliationAuthority: "Tribunal des baux et loyers",
    language: "fr",
    penurieLogement: true,
    specialRules: [
      "Logements subventionnés: art. 24 interdiction frais au locataire",
      "Plafonnement loyers après rénovation: max CHF 3'528/pièce/an",
    ],
  },
  GL: {
    code: "GL", name: "Glaris", nameDe: "Glarus",
    terminationDates: "monthly",
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  GR: {
    code: "GR", name: "Grisons", nameDe: "Graubünden",
    terminationDates: ["03-31", "09-30"],
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde des Kreises",
    language: "de/rm/it",
    penurieLogement: false,
  },
  JU: {
    code: "JU", name: "Jura", nameDe: "Jura",
    terminationDates: ["03-31", "06-30", "09-30", "12-31"],
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Autorité de conciliation en matière de bail",
    language: "fr",
    penurieLogement: false,
    specialRules: [
      "Canton cible initial immo.cool",
      "Pas de formulaire loyer initial obligatoire",
      "Marché moins tendu que Romandie — propriétaires privés nombreux",
    ],
  },
  LU: {
    code: "LU", name: "Lucerne", nameDe: "Luzern",
    terminationDates: null, // pas de dates locales
    terminationNotice: 3,
    initialRentFormRequired: true,
    initialRentFormScope: "Tout le canton",
    depositMax: 3,
    conciliationAuthority: "Mietamt / Schlichtungsbehörde",
    language: "de",
    penurieLogement: true,
  },
  NE: {
    code: "NE", name: "Neuchâtel", nameDe: "Neuenburg",
    terminationDates: ["03-31", "06-30", "09-30"],
    terminationNotice: 3,
    initialRentFormRequired: true,
    initialRentFormScope: "Certains districts",
    depositMax: 3,
    conciliationAuthority: "Autorités régionales de conciliation",
    language: "fr",
    penurieLogement: true,
  },
  NW: {
    code: "NW", name: "Nidwald", nameDe: "Nidwalden",
    terminationDates: ["03-31", "06-30", "09-30"],
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  OW: {
    code: "OW", name: "Obwald", nameDe: "Obwalden",
    terminationDates: ["03-31", "06-30", "09-30"],
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  SG: {
    code: "SG", name: "Saint-Gall", nameDe: "St. Gallen",
    terminationDates: "monthly_except_december",
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde des Kreises",
    language: "de",
    penurieLogement: false,
  },
  SH: {
    code: "SH", name: "Schaffhouse", nameDe: "Schaffhausen",
    terminationDates: "monthly_except_december",
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  SO: {
    code: "SO", name: "Soleure", nameDe: "Solothurn",
    terminationDates: ["03-31", "09-30"],
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Mietamt / Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  SZ: {
    code: "SZ", name: "Schwyz", nameDe: "Schwyz",
    terminationDates: "monthly_except_december",
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  TG: {
    code: "TG", name: "Thurgovie", nameDe: "Thurgau",
    terminationDates: ["03-31", "06-30", "09-30"],
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Mietamt / Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  TI: {
    code: "TI", name: "Tessin", nameDe: "Tessin",
    terminationDates: ["03-29", "09-29"],
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Ufficio di conciliazione in materia di locazione",
    language: "it",
    penurieLogement: false,
  },
  UR: {
    code: "UR", name: "Uri", nameDe: "Uri",
    terminationDates: "monthly_except_december",
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde",
    language: "de",
    penurieLogement: false,
  },
  VD: {
    code: "VD", name: "Vaud", nameDe: "Waadt",
    terminationDates: ["01-01", "04-01", "07-01", "10-01"],
    terminationNotice: 3,
    initialRentFormRequired: true,
    initialRentFormScope: "9 districts sur 10 (seul Aigle épargné en 2026)",
    depositMax: 3,
    conciliationAuthority: "Commissions préfectorales de conciliation (par district)",
    language: "fr",
    penurieLogement: true,
    specialRules: [
      "RULV (Règles et Usages Locatifs du Canton de Vaud) applicables",
      "Art. 8 RULV: NON étendu — frais locataire autorisés",
      "Cautionnement simple uniquement (pas solidaire) — Loi LABLF",
      "État des lieux obligatoire (art. 37 RULV)",
    ],
  },
  VS: {
    code: "VS", name: "Valais", nameDe: "Wallis",
    terminationDates: null, // pas de dates locales
    terminationNotice: 3,
    initialRentFormRequired: false,
    depositMax: 3,
    conciliationAuthority: "Autorité de conciliation du district",
    language: "fr/de",
    penurieLogement: false,
  },
  ZG: {
    code: "ZG", name: "Zoug", nameDe: "Zug",
    terminationDates: ["03-31", "06-30", "09-30"],
    terminationNotice: 3,
    initialRentFormRequired: true,
    initialRentFormScope: "Tout le canton",
    depositMax: 3,
    conciliationAuthority: "Schlichtungsbehörde",
    language: "de",
    penurieLogement: true,
  },
  ZH: {
    code: "ZH", name: "Zurich", nameDe: "Zürich",
    terminationDates: ["03-31", "09-30"],
    terminationNotice: 3,
    initialRentFormRequired: true,
    initialRentFormScope: "Tout le canton",
    depositMax: 3,
    conciliationAuthority: "Mietamt / Schlichtungsbehörde des Bezirks",
    language: "de",
    penurieLogement: true,
  },
};

// ============================================
// CURRENT REFERENCE RATE (updated quarterly)
// ============================================

export const REFERENCE_RATE = {
  current: 1.25,
  effectiveDate: "2025-09-01",
  previous: 1.50,
  previousDate: "2024-12-01",
  rentReductionPerQuarterPercent: 2.91,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get canton rules by code
 */
export function getCantonRules(cantonCode) {
  const rules = CANTONS[cantonCode.toUpperCase()];
  if (!rules) throw new Error(`Canton inconnu: ${cantonCode}`);
  return rules;
}

/**
 * Calculate next valid termination dates for a canton
 * Returns the next 3 valid termination dates from today
 */
export function getNextTerminationDates(cantonCode, fromDate = new Date()) {
  const rules = getCantonRules(cantonCode);
  const dates = [];
  const noticePeriod = rules.terminationNotice;
  
  if (rules.terminationDates === null) {
    // No cantonal dates — any end of month (with 3-month notice)
    const d = new Date(fromDate);
    d.setMonth(d.getMonth() + noticePeriod + 1);
    d.setDate(0); // last day of previous month
    for (let i = 0; i < 6; i++) {
      dates.push(new Date(d));
      d.setMonth(d.getMonth() + 2);
      d.setDate(0);
    }
    return dates.slice(0, 3);
  }
  
  if (rules.terminationDates === "monthly" || rules.terminationDates === "monthly_except_december") {
    const d = new Date(fromDate);
    d.setMonth(d.getMonth() + noticePeriod + 1);
    d.setDate(0);
    for (let i = 0; i < 6; i++) {
      if (rules.terminationDates === "monthly_except_december" && d.getMonth() === 11) {
        d.setMonth(d.getMonth() + 2);
        d.setDate(0);
        continue;
      }
      dates.push(new Date(d));
      d.setMonth(d.getMonth() + 2);
      d.setDate(0);
    }
    return dates.slice(0, 3);
  }
  
  // Specific dates
  const currentYear = fromDate.getFullYear();
  for (let year = currentYear; year <= currentYear + 2; year++) {
    for (const dateStr of rules.terminationDates) {
      const [month, day] = dateStr.split("-").map(Number);
      const termDate = new Date(year, month - 1, day);
      
      // Must be at least noticePeriod months in the future
      const minNoticeDate = new Date(fromDate);
      minNoticeDate.setMonth(minNoticeDate.getMonth() + noticePeriod);
      
      if (termDate > minNoticeDate) {
        dates.push(termDate);
      }
    }
  }
  
  return dates.sort((a, b) => a - b).slice(0, 3);
}

/**
 * Check if initial rent form is required for a canton
 */
export function requiresInitialRentForm(cantonCode) {
  const rules = getCantonRules(cantonCode);
  return rules.initialRentFormRequired;
}

/**
 * Calculate maximum deposit amount
 */
export function calculateMaxDeposit(cantonCode, monthlyRent, charges = 0) {
  const rules = getCantonRules(cantonCode);
  return (parseFloat(monthlyRent) + parseFloat(charges)) * rules.depositMax;
}

/**
 * Calculate potential rent reduction based on reference rate change
 */
export function calculateRentReduction(currentRent, rateAtLeaseStart) {
  if (rateAtLeaseStart <= REFERENCE_RATE.current) return 0;
  
  const rateDrops = (rateAtLeaseStart - REFERENCE_RATE.current) / 0.25;
  const reductionPercent = rateDrops * REFERENCE_RATE.rentReductionPerQuarterPercent;
  const reduction = (parseFloat(currentRent) * reductionPercent) / 100;
  
  return {
    reductionAmount: Math.round(reduction * 100) / 100,
    reductionPercent: Math.round(reductionPercent * 100) / 100,
    currentRate: REFERENCE_RATE.current,
    rateAtLeaseStart,
    rateDropSteps: rateDrops,
  };
}

/**
 * Get lease compliance checklist for a canton
 */
export function getComplianceChecklist(cantonCode) {
  const rules = getCantonRules(cantonCode);
  const checklist = [
    { id: "bail_ecrit", label: "Contrat de bail écrit", required: true, status: "todo" },
    { id: "signature", label: "Signature des deux parties", required: true, status: "todo" },
    { id: "depot_garantie", label: `Garantie ≤ ${rules.depositMax} mois sur compte bloqué`, required: true, status: "todo" },
    { id: "etat_lieux", label: "État des lieux d'entrée", required: true, status: "todo" },
    { id: "remise_cles", label: "Remise des clés documentée", required: true, status: "todo" },
  ];
  
  if (rules.initialRentFormRequired) {
    checklist.splice(1, 0, {
      id: "formulaire_loyer_initial",
      label: `Formulaire officiel de loyer initial (${rules.initialRentFormScope})`,
      required: true,
      critical: true,
      status: "todo",
      warning: "Sans ce formulaire, le loyer peut être contesté sans délai",
    });
  }
  
  if (rules.specialRules) {
    rules.specialRules.forEach((rule, i) => {
      checklist.push({
        id: `special_${i}`,
        label: rule,
        required: false,
        info: true,
        status: "info",
      });
    });
  }
  
  return checklist;
}

/**
 * Generate initial rent form data (OBLF art. 19 al. 3)
 */
export function generateInitialRentFormData({
  cantonCode,
  newRent,
  newCharges,
  previousRent,
  previousCharges,
  previousRentDate,
  referenceRateAtPreviousRent,
  cpiAtPreviousRent,
  leaseStartDate,
  landlordName,
  tenantName,
  propertyAddress,
}) {
  const rules = getCantonRules(cantonCode);
  
  if (!rules.initialRentFormRequired) {
    return { required: false, canton: rules.name };
  }
  
  return {
    required: true,
    canton: rules.name,
    cantonCode: rules.code,
    formData: {
      // Mandatory since OBLF modification 01.10.2025
      propertyAddress,
      landlordName,
      tenantName,
      newRent: parseFloat(newRent),
      newCharges: parseFloat(newCharges || 0),
      newRentTotal: parseFloat(newRent) + parseFloat(newCharges || 0),
      previousRent: previousRent ? parseFloat(previousRent) : null,
      previousCharges: previousCharges ? parseFloat(previousCharges) : null,
      previousRentDate: previousRentDate || null,
      referenceRateAtPreviousRent: referenceRateAtPreviousRent || null,
      currentReferenceRate: REFERENCE_RATE.current,
      cpiAtPreviousRent: cpiAtPreviousRent || null,
      leaseStartDate,
      generatedAt: new Date().toISOString(),
      platform: "immo.cool",
    },
    warnings: [
      "Le formulaire doit être remis AU PLUS TARD le jour de la remise des clés",
      "Toute erreur ou omission peut rendre le loyer initial NUL",
      "Le locataire dispose de 30 jours pour contester le loyer initial",
    ],
  };
}

/**
 * Get all Romandie cantons (target market)
 */
export function getRomandieCantons() {
  return ["GE", "VD", "NE", "FR", "JU", "VS"].map(code => CANTONS[code]);
}

/**
 * Validate a lease against cantonal rules
 */
export function validateLease({ cantonCode, monthlyRent, charges, depositMonths, startDate }) {
  const rules = getCantonRules(cantonCode);
  const errors = [];
  const warnings = [];
  
  // Deposit check
  if (depositMonths > rules.depositMax) {
    errors.push(`Garantie trop élevée: ${depositMonths} mois demandés, maximum ${rules.depositMax} mois pour les habitations (art. 257e CO)`);
  }
  
  // Initial rent form
  if (rules.initialRentFormRequired) {
    warnings.push(`Canton ${rules.name}: formulaire officiel de loyer initial OBLIGATOIRE (${rules.initialRentFormScope})`);
  }
  
  // Geneva subsidized housing
  if (cantonCode === "GE") {
    warnings.push("Genève: vérifier si le logement est subventionné (art. 24 — frais locataire interdits)");
  }
  
  // Vaud RULV
  if (cantonCode === "VD") {
    warnings.push("Vaud: RULV applicables — état des lieux obligatoire (art. 37 RULV)");
    warnings.push("Vaud: cautionnement simple uniquement (pas solidaire) — Loi LABLF");
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    canton: rules.name,
    cantonCode: rules.code,
  };
}
