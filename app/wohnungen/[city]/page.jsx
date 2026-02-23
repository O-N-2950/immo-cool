import ImmoCool from '../../components/ImmoCool';

const CITIES = {
  delemont: { name: "Delsberg", canton: "JU", rent: "1'050-1'500" },
  biel: { name: "Biel/Bienne", canton: "BE", rent: "1'200-1'800" },
  lausanne: { name: "Lausanne", canton: "VD", rent: "1'500-2'500" },
  genf: { name: "Genf", canton: "GE", rent: "1'800-3'200" },
  bern: { name: "Bern", canton: "BE", rent: "1'300-2'100" },
  zurich: { name: "Zürich", canton: "ZH", rent: "1'800-3'500" },
  basel: { name: "Basel", canton: "BS", rent: "1'400-2'400" },
  freiburg: { name: "Freiburg", canton: "FR", rent: "1'100-1'700" },
  luzern: { name: "Luzern", canton: "LU", rent: "1'400-2'200" },
  stgallen: { name: "St. Gallen", canton: "SG", rent: "1'200-1'800" },
  winterthur: { name: "Winterthur", canton: "ZH", rent: "1'400-2'200" },
  lugano: { name: "Lugano", canton: "TI", rent: "1'300-2'200" },
};

export async function generateStaticParams() {
  return Object.keys(CITIES).map(city => ({ city }));
}

export async function generateMetadata({ params }) {
  const { city } = await params;
  const c = CITIES[city];
  if (!c) return { title: "Wohnungen zu vermieten in der Schweiz — immo.cool" };
  return {
    title: `Wohnungen zu vermieten in ${c.name} (${c.canton}) — immo.cool`,
    description: `Finden Sie Ihre Wohnung in ${c.name} ab CHF ${c.rent}/Monat. Gratis für Mieter. KI-Matching, konformer Mietvertrag, digitales Übergabeprotokoll.`,
    keywords: `Wohnung ${c.name}, Miete ${c.name}, mieten ${c.name}, ${c.canton}, Immobilien Schweiz`,
    openGraph: {
      title: `Wohnungen in ${c.name} ab CHF ${c.rent}/Monat — immo.cool`,
      description: `100% gratis für Mieter. KI-Matching. 26 Kantone.`,
      url: `https://www.immocool.ch/wohnungen/${city}`,
      locale: 'de_CH',
    },
    alternates: {
      canonical: `https://www.immocool.ch/wohnungen/${city}`,
      languages: { 'fr-CH': `https://www.immocool.ch/appartements/${city}` },
    },
  };
}

export default async function CityPage({ params }) {
  const { city } = await params;
  return <ImmoCool initialPage="tenant-search" initialCity={city} initialLang="de" />;
}
