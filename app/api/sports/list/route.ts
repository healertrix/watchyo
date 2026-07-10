import { NextResponse } from 'next/server';
import { fetchWatchFooty } from '@/lib/watchfooty';

export async function GET() {
  try {
    const data = await fetchWatchFooty('/api/v1/sports', 3600);
    const list = Array.isArray(data) ? data : data.sports ?? data.results ?? [];
    return NextResponse.json({ sports: list });
  } catch (error) {
    console.error('Error fetching sports list:', error);
    return NextResponse.json({ error: 'Failed to fetch sports list' }, { status: 500 });
  }
}
