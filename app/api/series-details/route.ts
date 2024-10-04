import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=credits,videos`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.success === false) {
      throw new Error(data.status_message);
    }

    console.log('Raw TV series data:', data); // Log raw data
    console.log('First air date:', data.first_air_date); // Explicitly log first_air_date

    const processedData = {
      ...data,
      media_type: 'tv',
      created_by: data.created_by || [],
      cast: data.credits?.cast?.slice(0, 5).map((actor: any) => actor.name) || [],
      director: data.credits?.crew?.find((person: any) => person.job === 'Director')?.name || '',
      video: data.videos?.results[0]?.key || null,
      first_air_date: data.first_air_date || null,
    };

    console.log('Processed TV series data:', processedData); // Log processed data
    console.log('Processed first air date:', processedData.first_air_date); // Explicitly log processed first_air_date

    return NextResponse.json(processedData);
  } catch (error: any) {
    console.error('Error fetching series details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}