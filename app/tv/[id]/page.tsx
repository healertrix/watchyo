'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Loading from './loading';

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  air_date: string;
}

interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episodes: Episode[];
}

interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  created_by: { name: string }[];
  seasons: { season_number: number; name: string }[];
  current_season: Season;
}

export default function TVShowPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const router = useRouter();
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalSearchQuery, setOriginalSearchQuery] = useState('');

  useEffect(() => {
    if (id) {
      const seasonParam = searchParams?.get('season');
      const initialSeason = seasonParam ? parseInt(seasonParam, 10) : 1;
      setSelectedSeason(initialSeason);
      setIsLoading(true);
      fetchTVShowDetails(id, initialSeason);
      
      // Store the original search query
      const query = searchParams?.get('q') || '';
      setOriginalSearchQuery(query);
    }
  }, [id, searchParams]);

  const fetchTVShowDetails = async (showId: string, season: number) => {
    try {
      const response = await fetch(
        `/api/tv-show-details?id=${showId}&season=${season}`
      );
      const data = await response.json();
      setTVShow(data);
    } catch (error) {
      console.error('Error fetching TV show details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchEpisode = (seasonNumber: number, episodeNumber: number) => {
    router.push(
      `/watch/tv/${id}?season=${seasonNumber}&episode=${episodeNumber}&q=${originalSearchQuery}`
    );
  };

  const toggleSeasonDropdown = () => {
    setIsSeasonDropdownOpen(!isSeasonDropdownOpen);
  };

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setIsSeasonDropdownOpen(false);
    
    // Update the URL with the new season, but keep the original search query
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set('season', seasonNumber.toString());
    router.replace(`/tv/${id}?${newSearchParams.toString()}`);
    
    fetchTVShowDetails(id, seasonNumber);
  };

  const handleBackToSearch = () => {
    // Use the original search query when navigating back
    router.push(`/select?q=${encodeURIComponent(originalSearchQuery)}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!tvShow) {
    return <div>Failed to load TV show details.</div>;
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='relative'>
        <button
          onClick={handleBackToSearch}
          className='absolute top-4 left-4 z-10 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-200'
          aria-label='Back to search'
        >
          <ArrowLeft size={24} />
        </button>
        <div className='relative h-[30vh] sm:h-[50vh]'>
          <Image
            src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
            alt={tvShow.name}
            layout='fill'
            objectFit='cover'
            className='opacity-50'
          />
          <div className='absolute bottom-0 left-0 p-4 sm:p-8 bg-gradient-to-t from-gray-900 w-full'>
            <h1 className='text-2xl sm:text-4xl font-bold mb-2'>{tvShow.name}</h1>
            <p className='text-sm sm:text-lg mb-2 sm:mb-4 line-clamp-3'>
              {tvShow.overview}
            </p>
            <div className='flex items-center text-xs sm:text-sm text-gray-300'>
              <Calendar className='w-4 h-4 mr-1' />
              <span className='mr-4'>{tvShow.first_air_date?.split('-')[0]}</span>
              <Clock className='w-4 h-4 mr-1' />
              <span>{tvShow.seasons.length} Seasons</span>
            </div>
          </div>
        </div>
      </div>

      <div className='p-4 sm:p-8'>
        <div className='mb-8'>
          <h2 className='text-xl sm:text-2xl font-bold mb-4'>Seasons</h2>
          <div className='relative w-full sm:w-1/2 lg:w-1/3'>
            <button
              onClick={toggleSeasonDropdown}
              className='w-full bg-gray-800 text-white px-6 py-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition-colors text-lg'
            >
              {tvShow.seasons.find(
                (season) => season.season_number === selectedSeason
              )?.name || 'Select Season'}
              <ChevronDown
                className={`ml-2 transition-transform ${
                  isSeasonDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isSeasonDropdownOpen && (
              <div className='absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto'>
                {tvShow.seasons.map((season) => (
                  <button
                    key={season.season_number}
                    onClick={() => handleSeasonChange(season.season_number)}
                    className='w-full text-left px-6 py-4 hover:bg-gray-700 transition-colors text-lg'
                  >
                    {season.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className='text-xl sm:text-2xl font-bold mb-4'>Episodes</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
            {tvShow.current_season.episodes.map((episode) => (
              <div
                key={episode.id}
                className='bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105'
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                  alt={episode.name}
                  width={500}
                  height={281}
                  className='w-full h-40 object-cover'
                />
                <div className='p-4'>
                  <h3 className='text-lg sm:text-xl font-semibold mb-2'>
                    {episode.episode_number}. {episode.name}
                  </h3>
                  <p className='text-xs sm:text-sm text-gray-400 mb-2'>
                    {episode.air_date}
                  </p>
                  <p className='text-xs sm:text-sm line-clamp-3 mb-4'>
                    {episode.overview}
                  </p>
                  <button
                    onClick={() =>
                      handleWatchEpisode(selectedSeason, episode.episode_number)
                    }
                    className='bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors w-full'
                  >
                    Watch Episode
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}