import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { fetchWatchFooty } from '@/lib/watchfooty';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get('sport') || 'all';
  const live = searchParams.get('live') === 'true';
  const popular = searchParams.get('popular') === 'true';
  const date = searchParams.get('date');

  const sportSegment = sport === 'all' ? 'all' : encodeURIComponent(sport);
  let path = `/api/v1/matches/${sportSegment}`;
  if (popular) path += '/popular';
  if (live) path += '/live';
  if (date) path += `?date=${encodeURIComponent(date)}`;

  try {
    const data = await fetchWatchFooty(path, live ? 15 : 60);
    const matches = Array.isArray(data) ? data : data.matches ?? data.results ?? [];
    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
