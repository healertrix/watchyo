import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.success === false) {
      throw new Error(data.status_message);
    }

    const processedData = {
      ...data,
      media_type: 'movie',
      created_by: data.credits?.crew
        ?.filter((person: any) => person.job === 'Director' || person.job === 'Writer')
        .map((person: any) => ({ name: person.name, job: person.job })) || [],
      cast: data.credits?.cast?.slice(0, 5).map((actor: any) => actor.name) || [],
      director: data.credits?.crew?.find((person: any) => person.job === 'Director')?.name || '',
      video: data.videos?.results[0]?.key || null,
    };

    return NextResponse.json(processedData);
  } catch (error: any) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}