const FR_CITIES = ["delemont","porrentruy","saignelegier","bienne","lausanne","geneve","berne","zurich","bale","fribourg","neuchatel","sion","lugano"];
const DE_CITIES = ["delemont","biel","lausanne","genf","bern","zurich","basel","freiburg","luzern","stgallen","winterthur","lugano"];
const TOOLS = ["bail-gratuit","resiliation","calculateur-loyer","assistant-ia","etat-des-lieux","contestation"];

export default function sitemap() {
  const base = "https://www.immocool.ch";
  const now = new Date().toISOString();
  
  const pages = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
  ];
  
  TOOLS.forEach(tool => {
    pages.push({ url: `${base}/outils/${tool}`, lastModified: now, changeFrequency: "monthly", priority: 0.95 });
  });
  
  FR_CITIES.forEach(city => {
    pages.push({ url: `${base}/appartements/${city}`, lastModified: now, changeFrequency: "daily", priority: 0.9 });
  });
  
  DE_CITIES.forEach(city => {
    pages.push({ url: `${base}/wohnungen/${city}`, lastModified: now, changeFrequency: "daily", priority: 0.9 });
  });
  
  return pages;
}
