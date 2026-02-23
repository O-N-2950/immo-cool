import { NextResponse } from 'next/server';
import { generateBailPDF } from '../../../../lib/pdf-engine.js';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.canton) {
      return NextResponse.json({ error: 'Canton requis' }, { status: 400 });
    }
    
    const pdfBytes = await generateBailPDF(data);
    
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="bail-${data.canton}-${Date.now()}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error('Bail PDF generation error:', error);
    return NextResponse.json({ error: 'Erreur de génération' }, { status: 500 });
  }
}
