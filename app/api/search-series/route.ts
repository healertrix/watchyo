import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&append_to_response=videos`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Add video information to each series result
    const resultsWithVideo = await Promise.all(
      data.results.map(async (series: any) => {
        try {
          const videoResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${series.id}/videos?api_key=${TMDB_API_KEY}`,
            { next: { revalidate: 60 } } // Cache for 60 seconds
          );

          if (!videoResponse.ok) {
            throw new Error(
              `TMDB API responded with status: ${videoResponse.status}`
            );
          }

          const videoData = await videoResponse.json();
          const trailer = videoData.results.find(
            (video: any) => video.type === 'Trailer'
          );
          return { ...series, video: trailer ? trailer.key : null };
        } catch (error) {
          return { ...series, video: null };
        }
      })
    );

    // Fetch additional details for each TV series
    const seriesWithDetails = await Promise.all(
      data.results.map(async (series: any) => {
        const creative_team = await fetchSeriesDetails(series.id);
        return {
          ...series,
          creative_team,
        };
      })
    );

    return NextResponse.json({ results: seriesWithDetails });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search for TV series. Please try again later.' },
      { status: 500 }
    );
  }
}

async function fetchSeriesDetails(seriesId: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${process.env.TMDB_API_KEY}`
  );
  const data = await response.json();

  const getUniqueMembers = (jobs: string[], count: number) =>
    Array.from(new Set(
      data.crew
        .filter((member: any) => jobs.includes(member.job))
        .map((member: any) => member.name)
    )).slice(0, count);

  const directors = getUniqueMembers(['Director'], 2)
    .map(name => ({ role: 'Director', name }));

  const producers = getUniqueMembers(['Producer'], 2)
    .map(name => ({ role: 'Producer', name }));

  const writers = getUniqueMembers(['Writer', 'Screenplay', 'Story'], 1)
    .map(name => ({ role: 'Writer', name }));

  // Combine all roles and filter out any empty arrays
  const creative_team = [...directors, ...producers, ...writers];

  return creative_team;
}


