import { getSession } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';

const EVOLINK_API_KEY = process.env.EVOLINK_API_KEY;
const EVOLINK_API_BASE = process.env.EVOLINK_API_BASE_URL || 'https://api.evolink.ai';

/**
 * GET /api/generate/status?taskId=xxx
 *
 * Poll the Evolink task status API and return progress + video URL.
 */
export async function GET(request: NextRequest) {
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

    const taskId = request.nextUrl.searchParams.get('taskId');
    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${EVOLINK_API_BASE}/v1/tasks/${taskId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${EVOLINK_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Task Status Error]', response.status, errorData);
      return NextResponse.json(
        { error: errorData?.error?.message || 'Failed to query task status' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract video URL from results if completed
    let videoUrl: string | undefined;
    if (data.status === 'completed' && data.results) {
      // Evolink returns results array with video URLs
      videoUrl = data.results?.[0]?.url || data.results?.[0]?.video_url;
    }

    return NextResponse.json({
      id: data.id,
      status: data.status,
      progress: data.progress ?? 0,
      videoUrl,
      estimatedTime: data.task_info?.estimated_time,
    });
  } catch (error) {
    console.error('[Task Status API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
