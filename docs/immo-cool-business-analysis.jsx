import { useState } from "react";

const plans = {
  A: {
    name: "Modèle Premium",
    subtitle: "Propriétaire 100% + Locataire 20%",
    color: "#C9A84C",
    landlordFee: "100% du 1er loyer",
    tenantFee: "20% du 1er loyer",
    artisan: "10% commission",
    tagline: "Marge élevée, croissance modérée",
  },
  B: {
    name: "Modèle Disruptif",
    subtitle: "Propriétaire 50% + Locataire GRATUIT",
    color: "#00E676",
    landlordFee: "50% du 1er loyer",
    tenantFee: "GRATUIT",
    artisan: "10% commission",
    tagline: "Volume massif, effet réseau, domination marché",
  },
};

const scenarioData = {
  A: {
    year1: { leases: 50, avgRent: 1200, revenuePerLease: 1440, artisanJobs: 80, artisanAvg: 1200, totalRevenue: 81600, costs: 65000 },
    year2: { leases: 120, avgRent: 1200, revenuePerLease: 1440, artisanJobs: 250, artisanAvg: 1200, totalRevenue: 202800, costs: 95000 },
    year3: { leases: 220, avgRent: 1250, revenuePerLease: 1500, artisanJobs: 500, artisanAvg: 1250, totalRevenue: 392500, costs: 140000 },
    year5: { leases: 400, avgRent: 1300, revenuePerLease: 1560, artisanJobs: 1200, artisanAvg: 1300, totalRevenue: 780000, costs: 200000 },
  },
  B: {
    year1: { leases: 80, avgRent: 1200, revenuePerLease: 600, artisanJobs: 130, artisanAvg: 1200, totalRevenue: 63600, costs: 65000 },
    year2: { leases: 350, avgRent: 1200, revenuePerLease: 600, artisanJobs: 700, artisanAvg: 1200, totalRevenue: 294000, costs: 110000 },
    year3: { leases: 800, avgRent: 1250, revenuePerLease: 625, artisanJobs: 1800, artisanAvg: 1250, totalRevenue: 725000, costs: 180000 },
    year5: { leases: 2000, avgRent: 1300, revenuePerLease: 650, artisanJobs: 6000, artisanAvg: 1300, totalRevenue: 2080000, costs: 350000 },
  },
};

const metrics = [
  {
    category: "REVENUS PAR BAIL",
    items: [
      { label: "Loyer moyen (Jura → Romandie)", value: "CHF 1'200/mois", same: true },
      { label: "Revenu par bail signé", A: "CHF 1'440", B: "CHF 600", note: "A = 120% du loyer, B = 50%" },
      { label: "Marge brute par bail", A: "~58%", B: "~42%", note: "Après coûts directs (Stripe 1.5%, infra)" },
      { label: "Point mort (break-even)", A: "~45 baux", B: "~108 baux", note: "Coûts fixes estimés CHF 65K/an" },
    ]
  },
  {
    category: "ACQUISITION & CROISSANCE",
    items: [
      { label: "Barrière locataire", A: "MOYENNE — 20% à payer", B: "ZÉRO — 100% gratuit", highlight: "B" },
      { label: "Barrière propriétaire", A: "HAUTE — 100% du loyer", B: "BASSE — 50% du loyer", highlight: "B" },
      { label: "CAC locataire estimé", A: "CHF 80-150", B: "CHF 5-20 (viral)", highlight: "B" },
      { label: "CAC propriétaire estimé", A: "CHF 200-400", B: "CHF 100-200", highlight: "B" },
      { label: "Bouche-à-oreille locataires", A: "Modéré", B: "Massif — c'est GRATUIT", highlight: "B" },
      { label: "Taux de conversion visiteur→inscription", A: "8-15%", B: "30-50%", highlight: "B" },
    ]
  },
  {
    category: "RISQUE JURIDIQUE (RÉVISÉ — SOURCE: PERPLEXITY + ANALYSE)",
    items: [
      { label: "Légalité des frais locataire", A: "✅ Légal si qualifié \"service\"", B: "Non concerné", note: "Art. 8 RULV non déclaré de force obligatoire (Arrêté CE VD)" },
      { label: "Risque de double facturation", A: "✅ Aucun — pas de contrat de gérance", B: "Non concerné", note: "immo.cool ≠ régie, distinction juridique clé" },
      { label: "Logements subventionnés GE (LGL/LGZD)", A: "❌ Interdit — art. 24 Règles GE", B: "Non concerné", note: "Seul cas d'exclusion ferme identifié" },
      { label: "Contestation ASLOCA", A: "⚠️ Possible mais défendable", B: "Impossible — rien à contester", highlight: "B" },
      { label: "Besoin de validation avocat", A: "Recommandé (structure CGU)", B: "Non critique", highlight: "B" },
    ]
  },
  {
    category: "POSITIONNEMENT MARCHÉ",
    items: [
      { label: "vs Régies (50-100% + gérance 3-5%/an)", A: "Moins cher pour proprio", B: "2× moins cher + zéro récurrent", highlight: "B" },
      { label: "vs Homegate/ImmoScout (CHF 89-399)", A: "Comparable", B: "Gratuit locataire + proprio paie au résultat", highlight: "B" },
      { label: "vs Flatfox (annonces gratuites)", A: "Plus cher", B: "Comparable + services automatisés", highlight: "B" },
      { label: "vs Novihome (CHF 29/mois/appart)", A: "Différent (one-shot vs abo)", B: "One-shot = zéro friction", note: "" },
      { label: "Message marketing", A: "\"Moins cher qu'une régie\"", B: "\"GRATUIT pour les locataires\"", highlight: "B" },
      { label: "Effet réseau (flywheel)", A: "Linéaire", B: "Exponentiel", highlight: "B" },
    ]
  },
  {
    category: "ARTISANS — REVENU RÉCURRENT (CLÉ DU MODÈLE B)",
    items: [
      { label: "Commission par intervention", value: "10% sur montant HT", same: true },
      { label: "Intervention moyenne", value: "CHF 1'200 → CHF 120 pour immo.cool", same: true },
      { label: "Fréquence par locataire actif", value: "2-3 interventions/an", same: true },
      { label: "Base locataires actifs Y3", A: "~500", B: "~2'000", highlight: "B" },
      { label: "Interventions/an Y3", A: "~500", B: "~1'800", highlight: "B" },
      { label: "Revenu artisan Y3", A: "CHF 62'500", B: "CHF 225'000", highlight: "B" },
      { label: "Revenu artisan Y5", A: "CHF 156'000", B: "CHF 780'000", highlight: "B" },
      { label: "% du revenu total Y5", A: "20%", B: "38%", note: "Plan B = revenus de plus en plus récurrents" },
    ]
  }
];

const swotA = {
  strengths: [
    "Revenu élevé par transaction (CHF 1'440/bail)",
    "Rentable rapidement (~45 baux)",
    "Marge confortable dès le départ",
    "Juridiquement défendable (confirmé par analyse Perplexity)",
  ],
  weaknesses: [
    "Double friction (proprio ET locataire paient)",
    "Croissance limitée par le CAC élevé des deux côtés",
    "Dépendance aux signatures de baux (peu récurrent)",
    "Vulnérable si un concurrent lance un modèle gratuit",
  ],
  opportunities: [
    "Expansion services premium (assurance, déménagement)",
    "Pivot possible vers Plan B si volume insuffisant",
    "Cash-flow rapide pour autofinancer le développement",
  ],
  threats: [
    "Concurrent lance modèle gratuit locataire → perte de parts",
    "ASLOCA conteste (même si défendable = coût de défense)",
    "Perception : \"encore une plateforme qui facture tout le monde\"",
    "Plafond de croissance naturel sans effet réseau",
  ]
};

const swotB = {
  strengths: [
    "Adoption virale — GRATUIT pour 100% des locataires",
    "Zéro risque juridique côté locataire",
    "50% = toujours 2× moins cher qu'une régie",
    "Effet réseau massif (flywheel marketplace)",
    "Base énorme pour revenu artisan récurrent",
    "Message marketing imbattable et impossible à surenchérir",
    "Position de marché défendable (moat)",
  ],
  weaknesses: [
    "Break-even plus lent (~108 baux vs 45)",
    "Revenu par bail 58% inférieur au Plan A",
    "Cash-burn initial plus élevé (6-12 mois)",
    "Besoin de volume critique pour rentabilité",
  ],
  opportunities: [
    "Devenir LE réflexe locataire en Suisse romande → nationale",
    "Monétiser la base via services premium optionnels",
    "Données marché locatif = valeur stratégique (analytics promoteurs)",
    "Levée de fonds facilitée (growth story pour VC)",
    "Extension marchés voisins (FR frontalière, Liechtenstein)",
  ],
  threats: [
    "Croissance trop lente dans les 18 premiers mois → trésorerie",
    "Acteur établi (TX Group/Homegate) copie avec budget 100×",
    "Coûts serveurs si volume explose sans monétisation suffisante",
    "Dépendance au marché artisan pour la rentabilité long terme",
  ]
};

function formatCHF(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

export default function BusinessComparison() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredRow, setHoveredRow] = useState(null);

  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "metrics", label: "Métriques" },
    { id: "projections", label: "Projections 5 ans" },
    { id: "swot", label: "SWOT" },
    { id: "verdict", label: "Verdict final" },
  ];

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#0A0A0A",
      color: "#E8E4DC",
      minHeight: "100vh",
      padding: 0,
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0A0A0A 0%, #1A1510 50%, #0A0A0A 100%)",
        borderBottom: "1px solid #2A2520",
        padding: "40px 32px 0",
      }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 3, height: 28, background: "#00E676" }} />
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 4, color: "#00E676", textTransform: "uppercase" }}>
              immo.cool — Business Plan v2 (révisé post-Perplexity)
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 400, margin: "16px 0 4px", lineHeight: 1.2, letterSpacing: -0.5 }}>
            Plan B confirmé : <span style={{ color: "#00E676" }}>casser le marché.</span>
          </h1>
          <p style={{ fontSize: 14, color: "#8A8478", margin: "8px 0 32px", maxWidth: 650, lineHeight: 1.6 }}>
            Analyse révisée après vérification Perplexity. Le Plan A est juridiquement viable — 
            mais le Plan B reste stratégiquement supérieur. On ne le choisit pas par peur du droit. 
            On le choisit pour révolutionner le marché immobilier suisse.
          </p>

          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  background: activeTab === t.id ? "#1A1510" : "transparent",
                  color: activeTab === t.id ? "#00E676" : "#6A6458",
                  border: activeTab === t.id ? "1px solid #2A2520" : "1px solid transparent",
                  borderBottom: activeTab === t.id ? "1px solid #1A1510" : "1px solid #2A2520",
                  padding: "12px 20px",
                  fontSize: 12,
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: 1,
                  cursor: "pointer",
                  marginBottom: -1,
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "32px" }}>

        {/* ===== OVERVIEW ===== */}
        {activeTab === "overview" && (
          <div>
            {/* Perplexity update banner */}
            <div style={{
              background: "#1A1A10", border: "1px solid #C9A84C30",
              padding: "20px 24px", marginBottom: 28,
              display: "flex", gap: 16, alignItems: "flex-start",
            }}>
              <div style={{ fontSize: 20, flexShrink: 0 }}>⚖️</div>
              <div>
                <div style={{ fontSize: 12, fontFamily: "'Courier New', monospace", color: "#C9A84C", letterSpacing: 1, marginBottom: 6 }}>
                  MISE À JOUR JURIDIQUE — ANALYSE PERPLEXITY
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#B0A89C", margin: 0 }}>
                  Les 20% du Plan A sont <strong style={{ color: "#E8E4DC" }}>légaux dans tous les cantons</strong> (sauf logements subventionnés GE).
                  L'art. 8 RULV (VD) n'est pas de force obligatoire. Le principe réel : interdiction de la double facturation —
                  or immo.cool n'a pas de contrat de gérance, donc pas de double facturation possible.
                  <strong style={{ color: "#00E676" }}> Le Plan B est un choix offensif de marché, pas une nécessité juridique.</strong>
                </p>
              </div>
            </div>

            {/* Two plan cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
              {["A", "B"].map(key => (
                <div key={key} style={{
                  border: `1px solid ${key === "B" ? "#00E67640" : "#C9A84C40"}`,
                  background: key === "B" ? "#00E67606" : "#C9A84C06",
                  padding: 28, position: "relative",
                }}>
                  {key === "B" && (
                    <div style={{
                      position: "absolute", top: -1, right: -1,
                      background: "#00E676", color: "#0A0A0A",
                      padding: "4px 14px", fontSize: 10,
                      fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: 2,
                    }}>CHOISI</div>
                  )}
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 3, color: plans[key].color, marginBottom: 12, textTransform: "uppercase" }}>
                    Plan {key}
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 4px" }}>{plans[key].name}</h2>
                  <p style={{ fontSize: 13, color: "#8A8478", margin: "0 0 24px" }}>{plans[key].tagline}</p>

                  {[
                    { label: "PROPRIÉTAIRE PAIE", val: plans[key].landlordFee },
                    { label: "LOCATAIRE PAIE", val: plans[key].tenantFee, green: key === "B" },
                    { label: "ARTISANS", val: plans[key].artisan },
                  ].map((row, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: "#6A6458", fontFamily: "'Courier New', monospace", letterSpacing: 1, marginBottom: 4 }}>{row.label}</div>
                      <div style={{ fontSize: 18, color: row.green ? "#00E676" : "#E8E4DC" }}>
                        {row.val}
                        {row.green && <span style={{ fontSize: 11, marginLeft: 8, background: "#00E67618", padding: "2px 8px", color: "#00E676" }}>DISRUPTIF</span>}
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: 8, padding: "16px 0 0", borderTop: "1px solid #2A2520" }}>
                    <div style={{ fontSize: 11, color: "#6A6458", fontFamily: "'Courier New', monospace", marginBottom: 8 }}>REVENU PAR BAIL (loyer CHF 1'200)</div>
                    <span style={{ fontSize: 28, color: plans[key].color }}> CHF {key === "A" ? "1'440" : "600"}</span>
                    <span style={{ fontSize: 12, color: "#6A6458", marginLeft: 8 }}>{key === "A" ? "(1'200 + 240)" : "(1'200 × 50%)"}</span>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "#6A6458", fontFamily: "'Courier New', monospace", marginBottom: 4 }}>RISQUE JURIDIQUE</div>
                    <div style={{ fontSize: 14, color: key === "A" ? "#C9A84C" : "#00E676" }}>
                      {key === "A" ? "⚠️ Défendable mais contestable" : "✅ Aucun — locataire ne paie rien"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Crossing point */}
            <div style={{ background: "#0D1A0D", border: "1px solid #00E67625", padding: 28, marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 3, color: "#00E676", marginBottom: 16 }}>
                POINT DE CROISEMENT
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { label: "Plan A — 200 baux", val: "CHF 288'000", sub: "200 × 1'440", color: "#C9A84C" },
                  { label: "Plan B — 200 baux", val: "CHF 120'000", sub: "200 × 600", color: "#ff6b6b" },
                  { label: "Plan B — 500 baux", val: "CHF 300'000", sub: "Dépasse Plan A", color: "#00E676" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0A0A0A", border: "1px solid #2A2520", padding: 20 }}>
                    <div style={{ fontSize: 11, color: "#6A6458", fontFamily: "'Courier New', monospace", marginBottom: 10 }}>{item.label}</div>
                    <div style={{ fontSize: 22, color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: 11, color: "#5A5448", marginTop: 4 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#8A8478", marginTop: 16, lineHeight: 1.7 }}>
                Le Plan B génère 3-5× plus de volume grâce à la gratuité locataire. Le croisement se fait à <strong style={{ color: "#00E676" }}>~480 baux/an</strong> (hors artisans). Avec les artisans, encore plus tôt.
              </p>
            </div>

            {/* Why B despite legality */}
            <div style={{ background: "#111", border: "1px solid #2A2520", padding: 28 }}>
              <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 3, color: "#C9A84C", marginBottom: 16 }}>
                POURQUOI LE PLAN B MÊME SI LE PLAN A EST LÉGAL ?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { icon: "🎯", title: "Stratégie > Juridique", text: "\"GRATUIT\" est le mot le plus puissant du marketing. Aucun concurrent ne peut surenchérir sur zéro." },
                  { icon: "🔄", title: "Flywheel marketplace", text: "Plus de locataires → plus de propriétaires → plus de biens → plus de locataires. Effet réseau exponentiel." },
                  { icon: "🔧", title: "Artisan = vraie marge", text: "Le bail est l'acquisition. L'artisan est la monétisation. Volume de locataires = tout." },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#E8E4DC", marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.6, color: "#8A8478" }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== METRICS ===== */}
        {activeTab === "metrics" && (
          <div>
            {metrics.map((section, si) => (
              <div key={si} style={{ marginBottom: 36 }}>
                <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 2, color: "#C9A84C", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #1A1510" }}>
                  {section.category}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 0, padding: "8px 16px", background: "#111" }}>
                  <div style={{ fontSize: 11, color: "#6A6458", fontFamily: "'Courier New', monospace" }}>Métrique</div>
                  <div style={{ fontSize: 11, color: "#C9A84C", fontFamily: "'Courier New', monospace", textAlign: "center" }}>PLAN A</div>
                  <div style={{ fontSize: 11, color: "#00E676", fontFamily: "'Courier New', monospace", textAlign: "center" }}>PLAN B ✓</div>
                </div>
                {section.items.map((item, ii) => (
                  <div key={ii}
                    onMouseEnter={() => setHoveredRow(`${si}-${ii}`)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr",
                      padding: "10px 16px",
                      background: hoveredRow === `${si}-${ii}` ? "#1A1510" : "transparent",
                      borderBottom: "1px solid #1A151030", transition: "background 0.15s",
                    }}>
                    <div style={{ fontSize: 13, color: "#B0A89C" }}>
                      {item.label}
                      {item.note && <div style={{ fontSize: 11, color: "#5A5448", marginTop: 2 }}>{item.note}</div>}
                    </div>
                    {item.same ? (
                      <div style={{ fontSize: 13, textAlign: "center", gridColumn: "2 / 4", color: "#8A8478" }}>{item.value}</div>
                    ) : (
                      <>
                        <div style={{ fontSize: 13, textAlign: "center", color: item.highlight === "A" ? "#C9A84C" : item.highlight === "B" ? "#6A6458" : "#B0A89C" }}>{item.A}</div>
                        <div style={{ fontSize: 13, textAlign: "center", fontWeight: item.highlight === "B" ? 600 : 400, color: item.highlight === "B" ? "#00E676" : item.highlight === "A" ? "#6A6458" : "#B0A89C" }}>{item.B}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ===== PROJECTIONS ===== */}
        {activeTab === "projections" && (
          <div>
            <p style={{ fontSize: 14, color: "#8A8478", marginBottom: 8, lineHeight: 1.6 }}>
              Démarrage Jura (Y1), extension Romandie (Y2-3), Suisse romande + alémaniques (Y5).
            </p>
            <p style={{ fontSize: 13, color: "#6A6458", marginBottom: 28 }}>
              Plan B : 2-4× plus de volume grâce à gratuité locataire + prix propriétaire 2× inférieur.
            </p>

            {["year1", "year2", "year3", "year5"].map((year, yi) => {
              const labels = { year1: "Année 1 — Jura", year2: "Année 2 — Romandie", year3: "Année 3 — Consolidation", year5: "Année 5 — Scale" };
              const a = scenarioData.A[year];
              const b = scenarioData.B[year];
              const aProfit = a.totalRevenue - a.costs;
              const bProfit = b.totalRevenue - b.costs;
              const bWins = bProfit > aProfit;

              return (
                <div key={year} style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 400, margin: 0 }}>{labels[year]}</h3>
                    <span style={{
                      fontSize: 10, fontFamily: "'Courier New', monospace",
                      background: bWins ? "#00E67620" : "#C9A84C20",
                      color: bWins ? "#00E676" : "#C9A84C",
                      padding: "3px 10px", letterSpacing: 1,
                    }}>{bWins ? "PLAN B GAGNE" : "PLAN A DEVANT"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[{ key: "A", data: a, profit: aProfit }, { key: "B", data: b, profit: bProfit }].map(({ key, data, profit }) => (
                      <div key={key} style={{
                        border: `1px solid ${profit > 0 ? (key === "B" ? "#00E67625" : "#C9A84C25") : "#ff6b6b25"}`,
                        padding: 20, background: "#0D0D0D",
                      }}>
                        <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 2, color: plans[key].color, marginBottom: 12 }}>
                          PLAN {key} {key === "B" ? "✓" : ""}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                          <div><div style={{ fontSize: 11, color: "#6A6458" }}>Baux signés</div><div style={{ fontSize: 18 }}>{data.leases}</div></div>
                          <div><div style={{ fontSize: 11, color: "#6A6458" }}>Interventions artisans</div><div style={{ fontSize: 18 }}>{formatCHF(data.artisanJobs)}</div></div>
                          <div><div style={{ fontSize: 11, color: "#6A6458" }}>Revenu total</div><div style={{ fontSize: 18, color: plans[key].color }}>CHF {formatCHF(data.totalRevenue)}</div></div>
                          <div><div style={{ fontSize: 11, color: "#6A6458" }}>Coûts</div><div style={{ fontSize: 18, color: "#8A8478" }}>CHF {formatCHF(data.costs)}</div></div>
                        </div>
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #2A2520" }}>
                          <div style={{ fontSize: 11, color: "#6A6458" }}>Résultat net</div>
                          <div style={{ fontSize: 24, color: profit > 0 ? "#00E676" : "#ff6b6b" }}>
                            {profit > 0 ? "+" : ""}CHF {formatCHF(profit)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Revenue composition Y5 */}
            <div style={{ marginTop: 8, border: "1px solid #2A2520", padding: 24, background: "#0D0D0D" }}>
              <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 3, color: "#00E676", marginBottom: 20 }}>
                COMPOSITION DU REVENU — ANNÉE 5
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {["A", "B"].map(key => {
                  const d = scenarioData[key].year5;
                  const bailRevenue = d.leases * d.revenuePerLease;
                  const artisanRevenue = d.artisanJobs * d.artisanAvg * 0.1;
                  const total = bailRevenue + artisanRevenue;
                  const bailPct = Math.round(bailRevenue / total * 100);
                  return (
                    <div key={key}>
                      <div style={{ fontSize: 13, color: plans[key].color, marginBottom: 12 }}>Plan {key} {key === "B" ? "✓" : ""}</div>
                      <div style={{ display: "flex", height: 20, marginBottom: 8 }}>
                        <div style={{ width: `${bailPct}%`, background: plans[key].color }} />
                        <div style={{ width: `${100 - bailPct}%`, background: `${plans[key].color}40` }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8A8478" }}>
                        <span>Baux: {bailPct}%</span>
                        <span>Artisans: {100 - bailPct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 12, color: "#6A6458", marginTop: 16, lineHeight: 1.6 }}>
                Plan B : ~40% de revenus récurrents en Y5. Business plus résilient et plus valorisable.
              </p>
            </div>
          </div>
        )}

        {/* ===== SWOT ===== */}
        {activeTab === "swot" && (
          <div>
            {["A", "B"].map(key => {
              const swot = key === "A" ? swotA : swotB;
              return (
                <div key={key} style={{ marginBottom: 40 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 400, color: plans[key].color, margin: 0 }}>{plans[key].name}</h3>
                    <span style={{ fontSize: 12, color: "#6A6458" }}>— {plans[key].subtitle}</span>
                    {key === "B" && <span style={{ fontSize: 10, background: "#00E67620", color: "#00E676", padding: "2px 8px", fontFamily: "'Courier New', monospace" }}>CHOISI</span>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[
                      { title: "FORCES", items: swot.strengths, color: "#00E676" },
                      { title: "FAIBLESSES", items: swot.weaknesses, color: "#ff6b6b" },
                      { title: "OPPORTUNITÉS", items: swot.opportunities, color: "#C9A84C" },
                      { title: "MENACES", items: swot.threats, color: "#ff9800" },
                    ].map((quad, qi) => (
                      <div key={qi} style={{ background: "#0D0D0D", border: "1px solid #1A1510", padding: 20 }}>
                        <div style={{ fontSize: 10, fontFamily: "'Courier New', monospace", letterSpacing: 2, color: quad.color, marginBottom: 12 }}>{quad.title}</div>
                        {quad.items.map((item, ii) => (
                          <div key={ii} style={{
                            fontSize: 13, color: "#B0A89C", lineHeight: 1.6, padding: "6px 0",
                            borderBottom: ii < quad.items.length - 1 ? "1px solid #1A1510" : "none",
                          }}>{item}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== VERDICT ===== */}
        {activeTab === "verdict" && (
          <div>
            <div style={{
              background: "linear-gradient(135deg, #0D1A0D 0%, #0A0A0A 100%)",
              border: "1px solid #00E67630", padding: 36, marginBottom: 32,
            }}>
              <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 3, color: "#00E676", marginBottom: 16 }}>
                VERDICT FINAL — V2 POST-PERPLEXITY
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 400, margin: "0 0 16px", color: "#00E676", lineHeight: 1.3 }}>
                Plan B — Choix offensif, pas défensif.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "#C8E4CC", margin: 0 }}>
                Le Plan A est juridiquement viable. Les 20% sont défendables. <strong>Ce n'est pas la peur du droit qui dicte notre choix.</strong> C'est 
                la conviction qu'une marketplace gratuite pour les locataires crée un avantage concurrentiel 
                qu'aucun budget marketing ne peut acheter et qu'aucun concurrent ne peut surenchérir.
              </p>
            </div>

            {[
              { num: "01", title: "\"GRATUIT\" crée un moat impossible à copier par les régies", text: "Les régies facturent le locataire (CHF 150-500) ET le propriétaire (50-100% + gérance). immo.cool gratuit côté locataire + 50% propriétaire = imbattable des deux côtés. Aucune régie ne peut s'aligner sans détruire son modèle." },
              { num: "02", title: "Le volume alimente le flywheel artisan — le vrai moteur", text: "2'000 locataires actifs en Y5 = ~6'000 interventions = CHF 780'000 de revenu récurrent. Le bail est l'acquisition client. L'artisan est la monétisation. Le Plan B maximise l'acquisition." },
              { num: "03", title: "50% est le sweet spot pour les propriétaires privés", text: "100% (Plan A) fait hésiter un proprio jurassien avec un loyer de CHF 900. 50% (CHF 450) est acceptable — c'est le prix d'une annonce Homegate qui ne garantit rien, sauf que immo.cool livre un locataire vérifié." },
              { num: "04", title: "L'énergie juridique économisée va dans le produit", text: "Même si le Plan A est légal, chaque contestation ASLOCA coûte du temps et de l'attention. Le Plan B élimine ce front. En startup, l'attention est la ressource la plus rare." },
              { num: "05", title: "La growth story attire les investisseurs", text: "\"50 baux/an à haute marge\" n'intéresse aucun VC. \"2'000 baux/an, 38% de revenu récurrent, effet réseau, expansion nationale\" — ça c'est une série A. Tu as dit 'révolutionner' — le Plan B construit une valorisation, pas juste un salaire." },
            ].map((point, i) => (
              <div key={i} style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: "1px solid #1A1510" }}>
                <div style={{ fontSize: 28, fontFamily: "'Courier New', monospace", color: "#00E67630", flexShrink: 0, width: 50 }}>{point.num}</div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 8px", color: "#E8E4DC" }}>{point.title}</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "#8A8478", margin: 0 }}>{point.text}</p>
                </div>
              </div>
            ))}

            {/* B+ upsells */}
            <div style={{ marginTop: 36, background: "#1A1510", border: "1px solid #C9A84C30", padding: 28 }}>
              <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 3, color: "#C9A84C", marginBottom: 12 }}>
                PLAN B+ — REVENUS ADDITIONNELS SANS TOUCHER LA GRATUITÉ
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                {[
                  { icon: "🛡️", service: "GoCaution intégré", rev: "CHF 15-25/an" },
                  { icon: "🔧", service: "Marketplace artisans 10%", rev: "CHF 120-360/an/locataire" },
                  { icon: "📉", service: "Alertes baisse de loyer", rev: "CHF 5/mois premium" },
                  { icon: "📸", service: "État des lieux pro", rev: "CHF 150 one-shot" },
                  { icon: "🚚", service: "Comparateur déménagement", rev: "Commission lead" },
                  { icon: "📊", service: "Analytics propriétaire", rev: "CHF 10/mois/bien" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0D0D0D", padding: 14, border: "1px solid #2A2520", display: "flex", gap: 10 }}>
                    <div style={{ fontSize: 18 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, color: "#E8E4DC" }}>{item.service}</div>
                      <div style={{ fontSize: 12, color: "#C9A84C" }}>{item.rev}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div style={{ marginTop: 36, border: "1px solid #2A2520", padding: 28, background: "#0D0D0D" }}>
              <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 3, color: "#00E676", marginBottom: 20 }}>
                ROADMAP — PLAN B
              </div>
              {[
                { phase: "SEM. 1-2", action: "Architecture technique + base de règles cantonales (Jura)" },
                { phase: "SEM. 3-4", action: "MVP : matching + génération bail + Stripe Connect (50%)" },
                { phase: "SEM. 5-6", action: "État des lieux digital + intégration GoCaution" },
                { phase: "SEM. 7-8", action: "Beta test 5-10 propriétaires Jura + landing page" },
                { phase: "MOIS 3", action: "Lancement public Jura + marketplace artisans V1" },
                { phase: "MOIS 6", action: "Extension Vaud + Neuchâtel + Fribourg" },
                { phase: "MOIS 12", action: "Couverture Romandie + premiers cantons alémaniques" },
              ].map((step, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, padding: "12px 0",
                  borderBottom: i < 6 ? "1px solid #1A1510" : "none",
                }}>
                  <div style={{ fontSize: 11, fontFamily: "'Courier New', monospace", color: "#00E676", width: 80, flexShrink: 0 }}>{step.phase}</div>
                  <div style={{ fontSize: 13, color: "#B0A89C" }}>{step.action}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, textAlign: "center", padding: "24px 0" }}>
              <p style={{ fontSize: 22, color: "#00E676", fontStyle: "italic", margin: "0 0 4px", lineHeight: 1.4 }}>
                « Sois gratuit là où tes concurrents facturent.<br />
                Facture là où tes concurrents n'existent pas. »
              </p>
              <p style={{ fontSize: 12, color: "#6A6458", marginTop: 12, fontFamily: "'Courier New', monospace" }}>
                immo.cool — Plan B confirmé — Let's disrupt 🇨🇭
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
