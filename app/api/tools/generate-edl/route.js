import { NextResponse } from 'next/server';
import { generateEdlPDF } from '../../../../lib/pdf-engine.js';

export async function POST(request) {
  try {
    const data = await request.json();
    const pdfBytes = await generateEdlPDF(data);
    
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="etat-des-lieux-${data.type || 'entree'}-${Date.now()}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error('EDL PDF error:', error);
    return NextResponse.json({ error: 'Erreur de génération' }, { status: 500 });
  }
}
