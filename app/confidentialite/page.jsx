export const metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données de la plateforme immo.cool — conforme LPD suisse.",
};

const C = { bg: '#0a0a0f', bgCard: '#131318', text: '#e8e6e1', textMuted: '#8a8880', accent: '#c9a94e', border: '#1e1e28' };

export default function ConfidentialitePage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 32px' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.text }}>immo</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.accent }}>.cool</span>
        </a>
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', lineHeight: 1.8, fontSize: 14 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 400, marginBottom: 8 }}>
          Politique de <span style={{ fontStyle: 'italic', color: C.accent }}>confidentialité</span>
        </h1>
        <p style={{ color: C.textMuted, marginBottom: 40 }}>Conforme à la Loi fédérale sur la protection des données (LPD, nLPD 2023) — Dernière mise à jour : 14 mars 2026</p>

        <S t="1. Responsable du traitement">
          Olivier Neukomm — contact@immocool.ch — Suisse.
        </S>

        <S t="2. Données collectées">
          <b>Données d'inscription :</b> nom, prénom, email, mot de passe (haché bcrypt), numéro de téléphone (optionnel), rôle (propriétaire/locataire/artisan).<br/>
          <b>Données locatives :</b> adresse du bien, loyer, nombre de pièces, surface, canton, documents générés (baux, états des lieux).<br/>
          <b>Données financières :</b> traitées exclusivement par Stripe (PCI DSS). immo.cool ne stocke aucun numéro de carte bancaire.<br/>
          <b>Données de navigation :</b> adresse IP (pour le rate limiting et la sécurité), pages visitées, horodatage.
        </S>

        <S t="3. Finalités du traitement">
          Les données sont traitées pour : la mise en relation propriétaire-locataire, la génération de documents juridiques, le calcul de scores de matching, l'estimation de loyers par intelligence artificielle, le traitement des paiements, et la prévention des abus.
        </S>

        <S t="4. Intelligence artificielle">
          immo.cool utilise l'API Claude (Anthropic) pour l'assistant juridique, l'estimation de loyers et l'analyse de contestation. Les messages envoyés à l'IA sont transmis aux serveurs d'Anthropic pour traitement. Aucune donnée personnelle identifiable n'est stockée par Anthropic au-delà du traitement de la requête. Les résultats de l'IA sont fournis à titre indicatif et ne constituent pas un conseil juridique.
        </S>

        <S t="5. Base juridique">
          Le traitement des données repose sur : le consentement de l'utilisateur (art. 6 al. 6 LPD) lors de l'inscription, l'exécution du contrat (mise en relation, génération de documents), et l'intérêt légitime (sécurité, prévention des fraudes).
        </S>

        <S t="6. Durée de conservation">
          Les données de compte sont conservées tant que le compte est actif. Les documents générés (baux, états des lieux) sont conservés pendant 10 ans conformément au droit suisse (CO art. 962). Les logs de sécurité sont conservés 90 jours. Après suppression du compte, les données personnelles sont effacées dans un délai de 30 jours, sauf obligation légale de conservation.
        </S>

        <S t="7. Sous-traitants">
          <b>Railway</b> (hébergement, serveurs EU/US) — <b>Stripe</b> (paiements, PCI DSS) — <b>Anthropic</b> (intelligence artificielle) — <b>GitHub</b> (code source). Aucun transfert de données vers un pays tiers sans garanties appropriées (art. 16 LPD).
        </S>

        <S t="8. Droits des personnes concernées">
          Conformément à la LPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Vous pouvez exercer ces droits en écrivant à contact@immocool.ch. Délai de réponse : 30 jours. En cas de désaccord, vous pouvez saisir le Préposé fédéral à la protection des données et à la transparence (PFPDT).
        </S>

        <S t="9. Sécurité">
          Les mots de passe sont hachés (bcrypt, 12 rounds). Les communications sont chiffrées (TLS/HTTPS). L'accès aux API est protégé par JWT et rate limiting. Les en-têtes de sécurité HTTP sont appliqués (HSTS, CSP, X-Frame-Options). Les données sont hébergées sur des serveurs sécurisés avec sauvegardes automatiques.
        </S>

        <S t="10. Cookies">
          immo.cool utilise un cookie technique de session (<code style={{background:'#1e1e28',padding:'2px 6px',borderRadius:4,fontSize:12}}>immo_session</code>) nécessaire à l'authentification. Ce cookie est HTTP-only et sécurisé. Aucun cookie de tracking, publicitaire ou tiers n'est utilisé.
        </S>

        <S t="11. Modifications">
          Cette politique peut être modifiée à tout moment. Les utilisateurs inscrits seront informés par email en cas de modification substantielle. La date de dernière mise à jour est indiquée en haut de cette page.
        </S>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 24 }}>
          <a href="/cgv" style={{ color: C.accent, fontSize: 13, textDecoration: 'none' }}>Conditions générales →</a>
          <a href="/" style={{ color: C.textMuted, fontSize: 13, textDecoration: 'none' }}>Retour à l'accueil</a>
        </div>
      </div>
    </div>
  );
}

function S({ t, children }) {
  const C = { accent: '#c9a94e', textMuted: '#8a8880' };
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: C.accent, marginBottom: 10 }}>{t}</h2>
      <div style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}
