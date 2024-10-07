import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const season = searchParams.get('season') || '1';

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  try {
    const [showDetails, seasonDetails] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`),
      fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${TMDB_API_KEY}`)
    ]);

    const showData = await showDetails.json();
    const seasonData = await seasonDetails.json();

    const processedData = {
      ...showData,
      media_type: 'tv',
      created_by: showData.created_by || [],
      cast: showData.credits?.cast?.slice(0, 5).map((actor: any) => actor.name) || [],
      director: showData.credits?.crew?.find((person: any) => person.job === 'Director')?.name || '',
      video: showData.videos?.results[0]?.key || null,
      first_air_date: showData.first_air_date || null,
      current_season: seasonData,
    };

    return NextResponse.json(processedData);
  } catch (error: any) {
    console.error('Error fetching TV show details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}