import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { fetchWatchFooty } from '@/lib/watchfooty';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await fetchWatchFooty(`/api/v1/match/${id}`, 15);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching match details:', error);
    return NextResponse.json({ error: 'Failed to fetch match details' }, { status: 500 });
  }
}
