import { COLORS } from '../components/ImmoCool';

export const metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales d'utilisation de la plateforme immo.cool — immobilier suisse automatisé.",
};

const C = { bg: '#0a0a0f', bgCard: '#131318', text: '#e8e6e1', textMuted: '#8a8880', accent: '#c9a94e', border: '#1e1e28' };

export default function CGVPage() {
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
          Conditions <span style={{ fontStyle: 'italic', color: C.accent }}>générales</span>
        </h1>
        <p style={{ color: C.textMuted, marginBottom: 40 }}>Dernière mise à jour : 14 mars 2026</p>

        <Section title="1. Exploitant de la plateforme">
          La plateforme immo.cool est exploitée par Olivier Neukomm, domicilié en Suisse. Contact : contact@immocool.ch.
        </Section>

        <Section title="2. Objet">
          immo.cool est une plateforme de mise en relation entre propriétaires, locataires et artisans du bâtiment en Suisse. Elle propose des outils numériques pour la gestion locative : génération de baux, états des lieux, contestation de loyer, estimation de loyer, et un système de matching intelligent.
        </Section>

        <Section title="3. Tarification">
          <b>Locataires :</b> l'utilisation de la plateforme est entièrement gratuite.<br/>
          <b>Propriétaires :</b> une commission de 50% du premier loyer mensuel est due lors de la signature effective d'un bail par l'intermédiaire de la plateforme. Le paiement s'effectue via Stripe.<br/>
          <b>Artisans :</b> une commission de 10% est prélevée sur chaque intervention réalisée via la plateforme.<br/>
          <b>Outils gratuits :</b> les outils en ligne (calculateur de loyer, assistant juridique, résiliation) sont gratuits et accessibles sans inscription.
        </Section>

        <Section title="4. Inscription et compte">
          L'inscription est ouverte aux personnes physiques et morales domiciliées en Suisse. L'utilisateur s'engage à fournir des informations exactes et à jour. Le mot de passe doit comporter au minimum 8 caractères. L'utilisateur est responsable de la confidentialité de ses identifiants.
        </Section>

        <Section title="5. Conformité juridique">
          Les documents générés par immo.cool (baux, résiliations, états des lieux) sont basés sur le Code des obligations suisse (CO art. 253-274g), l'OBLF et les réglementations cantonales. Ils ne constituent pas un conseil juridique. En cas de litige, il est recommandé de consulter un avocat ou l'autorité de conciliation compétente.
        </Section>

        <Section title="6. Données et intelligence artificielle">
          immo.cool utilise l'intelligence artificielle (Claude, Anthropic) pour l'estimation de loyers, l'assistance juridique et le matching locataire-propriétaire. Les résultats sont fournis à titre indicatif. L'IA ne remplace pas un avis juridique professionnel.
        </Section>

        <Section title="7. Responsabilité">
          immo.cool agit en tant qu'intermédiaire technique. La plateforme ne se substitue pas à une régie immobilière agréée. immo.cool décline toute responsabilité en cas de litige entre propriétaire et locataire, d'erreur dans les documents générés, ou de dysfonctionnement technique. L'utilisation de la plateforme se fait aux risques de l'utilisateur.
        </Section>

        <Section title="8. Propriété intellectuelle">
          Le contenu de la plateforme (code, design, textes, algorithmes) est protégé par le droit d'auteur suisse. Toute reproduction non autorisée est interdite.
        </Section>

        <Section title="9. Résiliation">
          L'utilisateur peut supprimer son compte à tout moment en contactant contact@immocool.ch. Les données seront effacées conformément à la politique de confidentialité.
        </Section>

        <Section title="10. Droit applicable et for">
          Les présentes CGV sont soumises au droit suisse. Le for exclusif est le tribunal compétent du canton du Jura, sous réserve de dispositions impératives contraires.
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 24 }}>
          <a href="/confidentialite" style={{ color: C.accent, fontSize: 13, textDecoration: 'none' }}>Politique de confidentialité →</a>
          <a href="/" style={{ color: C.textMuted, fontSize: 13, textDecoration: 'none' }}>Retour à l'accueil</a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  const C = { bgCard: '#131318', text: '#e8e6e1', textMuted: '#8a8880', accent: '#c9a94e' };
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: C.accent, marginBottom: 10 }}>{title}</h2>
      <div style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}
