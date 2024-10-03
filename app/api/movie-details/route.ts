import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
    );
    const data = await response.json();

    const director = data.credits.crew.find((person: any) => person.job === 'Director')?.name || 'Unknown';
    const cast = data.credits.cast.slice(0, 5).map((actor: any) => actor.name);
    const trailer = data.videos.results.find((video: any) => video.type === 'Trailer')?.key || null;

    const movieDetails = {
      id: data.id,
      title: data.title,
      poster_path: data.poster_path,
      genre_ids: data.genres.map((genre: any) => genre.id),
      overview: data.overview,
      video: trailer,
      release_date: data.release_date,
      vote_average: data.vote_average,
      runtime: data.runtime,
      director: director,
      cast: cast,
      production_companies: data.production_companies.map((company: any) => company.name),
    };

    return NextResponse.json(movieDetails);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: 500 });
  }
}