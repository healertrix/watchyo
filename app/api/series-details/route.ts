import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
    );
    const data = await response.json();

    const seriesDetails = {
      ...data,
      cast: data.credits.cast.slice(0, 5).map((actor: any) => actor.name),
      created_by: data.created_by,
      video: data.videos.results.find((video: any) => video.type === 'Trailer')?.key || null,
    };

    return NextResponse.json(seriesDetails);
  } catch (error) {
    console.error('Error fetching TV series details:', error);
    return NextResponse.json({ error: 'Failed to fetch TV series details' }, { status: 500 });
  }
}