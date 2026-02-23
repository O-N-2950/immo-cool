import { NextResponse } from 'next/server';
import { generateResiliationPDF } from '../../../../lib/pdf-engine.js';

export async function POST(request) {
  try {
    const data = await request.json();
    const pdfBytes = await generateResiliationPDF(data);
    
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resiliation-${Date.now()}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error('Resiliation PDF error:', error);
    return NextResponse.json({ error: 'Erreur de génération' }, { status: 500 });
  }
}
