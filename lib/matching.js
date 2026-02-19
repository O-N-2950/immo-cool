/**
 * immo.cool — Matching Algorithm
 * 
 * Scores tenant-property compatibility on a 0-100 scale.
 * Factors: budget fit, location, rooms, move-in timing,
 * tenant reliability score, verification status.
 */

const WEIGHTS = {
  budgetFit: 30,       // Can the tenant afford it?
  locationMatch: 25,   // Canton/city preference match
  roomsMatch: 15,      // Room count preference match
  timingMatch: 10,     // Move-in date compatibility
  tenantScore: 15,     // Tenant reliability score
  verification: 5,     // Identity/income/references verified
};

/**
 * Calculate match score between a tenant profile and a property
 * @returns {{ score: number, breakdown: object, recommendation: string }}
 */
export function calculateMatchScore(tenantProfile, property) {
  const breakdown = {};
  let totalScore = 0;
  
  // 1. BUDGET FIT (30 points)
  // Ideal: rent <= 30% of income (Swiss standard)
  if (tenantProfile.monthlyIncome && property.monthlyRent) {
    const rent = parseFloat(property.monthlyRent) + parseFloat(property.charges || 0);
    const income = parseFloat(tenantProfile.monthlyIncome);
    const rentRatio = rent / income;
    
    if (tenantProfile.maxBudget && rent > parseFloat(tenantProfile.maxBudget)) {
      breakdown.budgetFit = { score: 0, detail: "Dépasse le budget max" };
    } else if (rentRatio <= 0.25) {
      breakdown.budgetFit = { score: WEIGHTS.budgetFit, detail: "Excellent — loyer < 25% du revenu" };
    } else if (rentRatio <= 0.33) {
      breakdown.budgetFit = { score: WEIGHTS.budgetFit * 0.85, detail: "Bon — loyer < 33% du revenu" };
    } else if (rentRatio <= 0.40) {
      breakdown.budgetFit = { score: WEIGHTS.budgetFit * 0.5, detail: "Limite — loyer ~40% du revenu" };
    } else {
      breakdown.budgetFit = { score: WEIGHTS.budgetFit * 0.1, detail: "Risque — loyer > 40% du revenu" };
    }
  } else {
    breakdown.budgetFit = { score: WEIGHTS.budgetFit * 0.3, detail: "Revenu non renseigné" };
  }
  
  // 2. LOCATION MATCH (25 points)
  const cantonMatch = tenantProfile.preferredCantons?.includes(property.canton);
  const cityMatch = tenantProfile.preferredCities?.some(
    c => c.toLowerCase() === property.city.toLowerCase()
  );
  
  if (cityMatch) {
    breakdown.locationMatch = { score: WEIGHTS.locationMatch, detail: `Ville préférée: ${property.city}` };
  } else if (cantonMatch) {
    breakdown.locationMatch = { score: WEIGHTS.locationMatch * 0.7, detail: `Canton préféré: ${property.canton}` };
  } else {
    breakdown.locationMatch = { score: 0, detail: "Hors zone de recherche" };
  }
  
  // 3. ROOMS MATCH (15 points)
  const rooms = property.rooms;
  const minRooms = tenantProfile.minRooms || 0;
  const maxRooms = tenantProfile.maxRooms || 99;
  
  if (rooms >= minRooms && rooms <= maxRooms) {
    breakdown.roomsMatch = { score: WEIGHTS.roomsMatch, detail: `${rooms} pièces — correspond` };
  } else if (rooms >= minRooms - 0.5 && rooms <= maxRooms + 0.5) {
    breakdown.roomsMatch = { score: WEIGHTS.roomsMatch * 0.6, detail: `${rooms} pièces — proche des critères` };
  } else {
    breakdown.roomsMatch = { score: 0, detail: `${rooms} pièces — hors critères` };
  }
  
  // 4. TIMING MATCH (10 points)
  if (tenantProfile.moveInDate && property.availableFrom) {
    const desiredDate = new Date(tenantProfile.moveInDate);
    const availableDate = new Date(property.availableFrom);
    const daysDiff = Math.abs((desiredDate - availableDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 14) {
      breakdown.timingMatch = { score: WEIGHTS.timingMatch, detail: "Dates parfaitement alignées" };
    } else if (daysDiff <= 30) {
      breakdown.timingMatch = { score: WEIGHTS.timingMatch * 0.7, detail: "~1 mois d'écart" };
    } else if (daysDiff <= 60) {
      breakdown.timingMatch = { score: WEIGHTS.timingMatch * 0.3, detail: "~2 mois d'écart" };
    } else {
      breakdown.timingMatch = { score: 0, detail: "Dates trop éloignées" };
    }
  } else {
    breakdown.timingMatch = { score: WEIGHTS.timingMatch * 0.5, detail: "Date non spécifiée" };
  }
  
  // 5. TENANT SCORE (15 points)
  const tenantScoreNormalized = (tenantProfile.score || 50) / 100;
  breakdown.tenantScore = {
    score: WEIGHTS.tenantScore * tenantScoreNormalized,
    detail: `Score locataire: ${tenantProfile.score || 50}/100`,
  };
  
  // 6. VERIFICATION (5 points)
  let verificationPoints = 0;
  const verifications = [];
  if (tenantProfile.identityVerified) { verificationPoints += 2; verifications.push("ID"); }
  if (tenantProfile.incomeVerified) { verificationPoints += 2; verifications.push("Revenu"); }
  if (tenantProfile.referencesVerified) { verificationPoints += 1; verifications.push("Références"); }
  
  breakdown.verification = {
    score: verificationPoints,
    detail: verifications.length > 0 ? `Vérifié: ${verifications.join(", ")}` : "Aucune vérification",
  };
  
  // TOTAL
  totalScore = Object.values(breakdown).reduce((sum, b) => sum + b.score, 0);
  totalScore = Math.round(Math.min(100, totalScore));
  
  // Recommendation
  let recommendation;
  if (totalScore >= 80) recommendation = "Excellent candidat — à contacter en priorité";
  else if (totalScore >= 60) recommendation = "Bon profil — correspond aux critères";
  else if (totalScore >= 40) recommendation = "Profil partiel — quelques écarts";
  else recommendation = "Faible correspondance — critères éloignés";
  
  return {
    score: totalScore,
    breakdown,
    recommendation,
    matchedAt: new Date().toISOString(),
  };
}

/**
 * Rank multiple tenants for a property
 * Returns sorted array of { tenantProfile, score, breakdown, recommendation }
 */
export function rankTenants(tenantProfiles, property) {
  return tenantProfiles
    .map(tp => ({
      tenantProfile: tp,
      ...calculateMatchScore(tp, property),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Find best properties for a tenant
 * Returns sorted array of { property, score, breakdown, recommendation }
 */
export function findBestProperties(tenantProfile, properties) {
  return properties
    .map(p => ({
      property: p,
      ...calculateMatchScore(tenantProfile, p),
    }))
    .filter(m => m.score > 20) // minimum threshold
    .sort((a, b) => b.score - a.score);
}

/**
 * Calculate tenant reliability score
 * Based on profile completeness, employment, income ratio
 */
export function calculateTenantScore(tenantProfile) {
  let score = 0;
  
  // Profile completeness (20 points)
  if (tenantProfile.monthlyIncome) score += 5;
  if (tenantProfile.employmentType) score += 5;
  if (tenantProfile.employer) score += 5;
  if (tenantProfile.preferredCantons?.length > 0) score += 3;
  if (tenantProfile.moveInDate) score += 2;
  
  // Employment stability (30 points)
  switch (tenantProfile.employmentType) {
    case "CDI": score += 30; break;
    case "retired": score += 28; break;
    case "independent": score += 22; break;
    case "CDD": score += 18; break;
    case "student": score += 12; break;
    default: score += 5;
  }
  
  // Verifications (30 points)
  if (tenantProfile.identityVerified) score += 10;
  if (tenantProfile.incomeVerified) score += 12;
  if (tenantProfile.referencesVerified) score += 8;
  
  // Income level (20 points)
  if (tenantProfile.monthlyIncome) {
    const income = parseFloat(tenantProfile.monthlyIncome);
    if (income >= 8000) score += 20;
    else if (income >= 6000) score += 16;
    else if (income >= 4500) score += 12;
    else if (income >= 3500) score += 8;
    else score += 4;
  }
  
  return Math.min(100, score);
}
