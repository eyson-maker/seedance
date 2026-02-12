import { getSession } from '@/lib/server';
import { NextResponse } from 'next/server';

const EVOLINK_API_KEY = process.env.EVOLINK_API_KEY;
const EVOLINK_API_BASE = process.env.EVOLINK_API_BASE_URL || 'https://api.evolink.ai';

/**
 * POST /api/upload
 *
 * Upload an image file via Evolink's file upload API.
 * Returns an accessible URL for use in the `image_urls` parameter.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!EVOLINK_API_KEY) {
      return NextResponse.json(
        { error: 'Evolink API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: JPG, PNG, WebP' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to base64 for Evolink Base64 Upload API
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Upload via Evolink Base64 Upload endpoint
    const url = `${EVOLINK_API_BASE}/v1/files/upload/base64`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${EVOLINK_API_KEY}`,
        },
        body: JSON.stringify({
          file: dataUrl,
          file_name: file.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          url: data.url || data.file_url || data.download_url,
          fileName: data.file_name || file.name,
        });
      }
      
      console.warn(`[Upload] Evolink upload failed (${response.status}), falling back to Data URI`);
    } catch (err) {
      console.warn('[Upload] Evolink connection failed, falling back to Data URI', err);
    }

    // FALLBACK: Return Data URI directly if upload fails
    return NextResponse.json({
      url: dataUrl,
      fileName: file.name,
    });
  } catch (error) {
    console.error('[Upload API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
