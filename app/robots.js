export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard/'] },
    ],
    sitemap: 'https://www.immocool.ch/sitemap.xml',
  };
}
