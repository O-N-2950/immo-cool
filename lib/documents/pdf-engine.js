/**
 * immocool.ch — PDF Generation Engine
 * 
 * Converts HTML document templates to PDF using Puppeteer.
 * Supports: bail, état des lieux, quittance de clés, lettre résiliation.
 */

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch {
  // Puppeteer not available — fallback to HTML-only mode
  puppeteer = null;
}

/**
 * Generate a PDF buffer from HTML string
 * @param {string} html - Complete HTML document
 * @param {object} options - PDF options
 * @returns {Buffer|null} PDF buffer or null if puppeteer unavailable
 */
export async function htmlToPdf(html, options = {}) {
  if (!puppeteer) {
    console.warn('[immocool.ch] Puppeteer not available — returning HTML only');
    return null;
  }

  const {
    format = 'A4',
    landscape = false,
    margin = { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    printBackground = true,
  } = options;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    const pdfBuffer = await page.pdf({
      format,
      landscape,
      margin,
      printBackground,
      preferCSSPageSize: true,
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('[immocool.ch] PDF generation error:', error.message);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Alternative: lightweight HTML-to-PDF using just the HTML
 * For environments without Puppeteer (Railway free tier), 
 * we return the HTML which the browser can print to PDF.
 */
export function htmlWithPrintStyles(html) {
  // Add print-optimized wrapper
  return html.replace('</head>', `
    <style>
      @media print {
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .page { page-break-after: always; margin: 0 !important; padding: 10mm 13mm !important; }
        .page:last-child { page-break-after: auto; }
      }
    </style>
  </head>`);
}
