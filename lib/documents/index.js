/**
 * immocool.ch — Document Generation System
 * 
 * Formulaires originaux immocool.ch, conformes au CO suisse.
 * Aucune reproduction de formulaires protégés (SVIT, cantonaux).
 * 
 * Documents disponibles :
 * 1. Bail d'habitation (art. 253-274g CO + OBLF)
 * 2. État des lieux entrée/sortie (art. 256, 267-267a CO)
 * 3. Quittance de clés (remise/restitution)
 * 4. Aide à la résiliation (renvoie vers formulaire officiel, art. 266l CO)
 */

export { generateBailHabitation } from './bail-habitation.js';
export { generateEtatDesLieux } from './etat-des-lieux.js';
export { generateQuittanceCles } from './quittance-cles.js';
export { verifierResiliation, generateLettreAccompagnement, FORMULAIRES_OFFICIELS } from './resiliation-helper.js';
export { htmlToPdf, htmlWithPrintStyles } from './pdf-engine.js';
