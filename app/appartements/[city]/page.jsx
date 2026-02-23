import ImmoCool from '../../components/ImmoCool';

const CITIES = {
  delemont: { name: "Delémont", canton: "JU", pop: "12'700", rent: "1'050-1'500", desc: "Capitale du canton du Jura" },
  porrentruy: { name: "Porrentruy", canton: "JU", pop: "6'900", rent: "900-1'300", desc: "Deuxième ville du Jura" },
  "saignelegier": { name: "Saignelégier", canton: "JU", pop: "2'300", rent: "850-1'100", desc: "Franches-Montagnes" },
  bienne: { name: "Bienne/Biel", canton: "BE", pop: "55'000", rent: "1'200-1'800", desc: "Ville bilingue au bord du lac" },
  lausanne: { name: "Lausanne", canton: "VD", pop: "140'000", rent: "1'500-2'500", desc: "Capitale olympique" },
  geneve: { name: "Genève", canton: "GE", pop: "200'000", rent: "1'800-3'200", desc: "Ville internationale" },
  berne: { name: "Berne", canton: "BE", pop: "135'000", rent: "1'300-2'100", desc: "Capitale fédérale" },
  zurich: { name: "Zurich", canton: "ZH", pop: "420'000", rent: "1'800-3'500", desc: "Centre économique" },
  bale: { name: "Bâle", canton: "BS", pop: "175'000", rent: "1'400-2'400", desc: "Carrefour des trois frontières" },
  fribourg: { name: "Fribourg", canton: "FR", pop: "40'000", rent: "1'100-1'700", desc: "Ville universitaire bilingue" },
  neuchatel: { name: "Neuchâtel", canton: "NE", pop: "34'000", rent: "1'100-1'600", desc: "Bord du lac de Neuchâtel" },
  sion: { name: "Sion", canton: "VS", pop: "35'000", rent: "1'100-1'600", desc: "Capitale du Valais" },
  lugano: { name: "Lugano", canton: "TI", pop: "63'000", rent: "1'300-2'200", desc: "Suisse italienne" },
};

export async function generateStaticParams() {
  return Object.keys(CITIES).map(city => ({ city }));
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const c = CITIES[city];
  if (!c) return { title: "Appartements à louer en Suisse — immo.cool" };
  return {
    title: `Appartements à louer à ${c.name} (${c.canton}) — immo.cool`,
    description: `Trouvez votre appartement à ${c.name} dès CHF ${c.rent}/mois. ${c.desc}. Gratuit pour les locataires. Matching IA, bail conforme, état des lieux digital.`,
    keywords: `appartement ${c.name}, location ${c.name}, louer ${c.name}, ${c.canton}, immobilier suisse`,
    openGraph: {
      title: `Appartements à ${c.name} dès CHF ${c.rent}/mois — immo.cool`,
      description: `${c.pop} habitants. ${c.desc}. 100% gratuit pour les locataires.`,
      url: `https://www.immocool.ch/appartements/${city}`,
      siteName: 'immo.cool',
      type: 'website',
      locale: 'fr_CH',
    },
    alternates: {
      canonical: `https://www.immocool.ch/appartements/${city}`,
      languages: { 'de-CH': `https://www.immocool.ch/wohnungen/${city}` },
    },
  };
}

export default async function CityPage({ params }) {
  const { city } = await params;
  const c = CITIES[city];
  
  return (
    <>
      {/* SEO structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SearchResultsPage",
        "name": `Appartements à louer à ${c?.name || city}`,
        "description": c?.desc || `Location d'appartements à ${city}`,
        "url": `https://www.immocool.ch/appartements/${city}`,
        "provider": {
          "@type": "Organization",
          "name": "immo.cool",
          "url": "https://www.immocool.ch"
        }
      })}} />
      <ImmoCool initialPage="tenant-search" initialCity={city} />
    </>
  );
}
