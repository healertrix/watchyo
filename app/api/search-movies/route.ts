import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const searchResults = await fetchMovies(query);

    // Fetch additional details for each movie
    const moviesWithDetails = await Promise.all(
      searchResults.results.map(async (movie: any) => {
        const details = await fetchMovieDetails(movie.id);
        return {
          ...movie,
          creative_team: [
            ...details.directors.map((director: string) => ({ role: 'Director', name: director })),
            ...details.writers.map((writer: string) => ({ role: 'Writer', name: writer })),
          ],
        };
      })
    );

    // console.log('Movies with details:', moviesWithDetails);
    return NextResponse.json({ results: moviesWithDetails });
  } catch (error) {
    console.error('Error searching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies. Please try again later.' }, { status: 500 });
  }
}

async function fetchMovieDetails(movieId: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}`
  );
  const data = await response.json();

  const directors = data.crew.filter((member: any) => member.job === 'Director').map((director: any) => director.name);
  const writers = data.crew.filter((member: any) => member.department === 'Writing').map((writer: any) => writer.name);

  return { directors, writers };
}

async function fetchMovies(query: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&append_to_response=videos`,
    { next: { revalidate: 60 } } // Cache for 60 seconds
  );
  
  if (!response.ok) {
    throw new Error(`TMDB API responded with status: ${response.status}`);
  }

  const data = await response.json();
  
  // Add video information to each movie result
  const resultsWithVideo = await Promise.all(data.results.map(async (movie: any) => {
    try {
      const videoResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`,
        { next: { revalidate: 60 } } // Cache for 60 seconds
      );
      
      if (!videoResponse.ok) {
        throw new Error(`TMDB API responded with status: ${videoResponse.status}`);
      }

      const videoData = await videoResponse.json();
      const trailer = videoData.results.find((video: any) => video.type === 'Trailer');
      return { ...movie, video: trailer ? trailer.key : null };
    } catch (error) {
      console.error(`Error fetching video for movie ${movie.id}:`, error);
      return { ...movie, video: null };
    }
  }));

  return { results: resultsWithVideo };
}