'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, Calendar, Layers, ArrowLeft, PlayCircle, Search } from 'lucide-react';
import Loading from './loading';
import { loadTvProgress, TvProgress } from '@/lib/watchProgress';

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
  const [episodeSearchQuery, setEpisodeSearchQuery] = useState('');
  const [resumeProgress, setResumeProgress] = useState<TvProgress | null>(null);

  useEffect(() => {
    if (id) {
      const seasonParam = searchParams?.get('season');
      const initialSeason = seasonParam ? parseInt(seasonParam, 10) : 1;
      setSelectedSeason(initialSeason);
      setIsLoading(true);
      fetchTVShowDetails(id, initialSeason);
      setResumeProgress(loadTvProgress(id));

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
    const totalEpisodes = tvShow?.current_season.episodes.length || 0;
    const totalSeasons = tvShow?.seasons.filter(season => season.season_number > 0).length || 0;
    router.push(
      `/watch/tv/${id}?season=${seasonNumber}&episode=${episodeNumber}&total=${totalEpisodes}&totalSeasons=${totalSeasons}&q=${originalSearchQuery}`
    );
  };

  const toggleSeasonDropdown = () => {
    setIsSeasonDropdownOpen(!isSeasonDropdownOpen);
  };

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setIsSeasonDropdownOpen(false);
    setEpisodeSearchQuery('');

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
    <div className='relative min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white'>
      <div className='relative'>
        <button
          onClick={handleBackToSearch}
          className='absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-black/60 active:scale-95 transition-all duration-200'
          aria-label='Back to search'
        >
          <ArrowLeft size={22} />
        </button>
        <div className='relative h-[48vh] sm:h-[64vh]'>
          <Image
            src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
            alt={tvShow.name}
            layout='fill'
            objectFit='cover'
            className='opacity-60'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-950 via-white/40 dark:via-neutral-950/40 to-transparent' />
          <div className='absolute bottom-0 left-0 p-4 sm:p-8 lg:p-12 w-full'>
            <div className='max-w-4xl'>
              <h1 className='font-display text-3xl sm:text-5xl lg:text-6xl font-semibold mb-3 tracking-tight text-balance text-gray-900 dark:text-white'>
                {tvShow.name}
              </h1>
              <p className='text-sm sm:text-base text-gray-600 dark:text-neutral-300 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 text-pretty max-w-[65ch]'>
                {tvShow.overview}
              </p>
              <div className='flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mb-5'>
                <span className='flex items-center gap-1.5'>
                  <Calendar size={14} />
                  {tvShow.first_air_date?.split('-')[0]}
                </span>
                <span className='flex items-center gap-1.5'>
                  <Layers size={14} />
                  {tvShow.seasons.filter(season => season.season_number > 0).length} Seasons
                </span>
              </div>
              <button
                onClick={() =>
                  handleWatchEpisode(
                    resumeProgress?.season ?? selectedSeason,
                    resumeProgress?.episode ?? 1
                  )
                }
                className='inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/30'
              >
                <PlayCircle size={20} />
                {resumeProgress
                  ? `Resume S${resumeProgress.season} E${resumeProgress.episode}`
                  : 'Play'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='p-4 sm:p-8 lg:p-12 max-w-[1800px] mx-auto'>
        <div>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6'>
            <div className='relative w-full lg:w-80 shrink-0'>
              <button
                onClick={toggleSeasonDropdown}
                className='w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white px-5 py-3.5 rounded-xl flex justify-between items-center hover:border-gray-300 dark:hover:border-neutral-700 transition-colors text-base font-medium'
              >
                {tvShow.seasons.find(
                  (season) => season.season_number === selectedSeason
                )?.name || 'Select Season'}
                <ChevronDown
                  size={18}
                  className={`ml-2 text-gray-400 dark:text-neutral-400 transition-transform ${
                    isSeasonDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isSeasonDropdownOpen && (
                <div className='absolute z-20 w-full mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/40 max-h-96 overflow-y-auto py-1'>
                  {tvShow.seasons
                    .filter(season => season.season_number > 0)
                    .map((season) => (
                      <button
                        key={season.season_number}
                        onClick={() => handleSeasonChange(season.season_number)}
                        className={`w-full text-left px-5 py-3 transition-colors text-sm font-medium ${
                          season.season_number === selectedSeason
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                            : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/70'
                        }`}
                      >
                        {season.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className='relative w-full lg:flex-1 lg:max-w-md'>
              <Search
                size={16}
                className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500'
              />
              <input
                type='text'
                value={episodeSearchQuery}
                onChange={(e) => setEpisodeSearchQuery(e.target.value)}
                placeholder='Search episodes...'
                className='w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white text-sm rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400 dark:placeholder:text-neutral-500 transition-shadow'
              />
            </div>
          </div>

          <h2 className='font-display text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white'>Episodes</h2>
          {(() => {
            const filteredEpisodes = tvShow.current_season.episodes.filter((episode) =>
              episode.name.toLowerCase().includes(episodeSearchQuery.trim().toLowerCase())
            );

            if (filteredEpisodes.length === 0) {
              return (
                <p className='text-gray-500 dark:text-neutral-500 text-sm py-8 text-center'>
                  No episodes match &quot;{episodeSearchQuery}&quot;.
                </p>
              );
            }

            return (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6'>
            {filteredEpisodes.map((episode) => (
              <div
                key={episode.id}
                className='group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5 shadow-sm hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:ring-blue-500/20 transition-all duration-300'
              >
                <div className='relative overflow-hidden'>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={episode.name}
                    width={500}
                    height={281}
                    className='w-full h-40 object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                  />
                  <span className='absolute top-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/50 backdrop-blur-sm text-white'>
                    Ep {episode.episode_number}
                  </span>
                </div>
                <div className='p-4'>
                  <h3 className='text-base font-semibold mb-1 text-gray-900 dark:text-white line-clamp-1'>
                    {episode.name}
                  </h3>
                  <p className='text-xs text-gray-500 dark:text-neutral-500 mb-2'>
                    {episode.air_date}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-neutral-400 line-clamp-3 mb-4 text-pretty'>
                    {episode.overview}
                  </p>
                  <button
                    onClick={() =>
                      handleWatchEpisode(selectedSeason, episode.episode_number)
                    }
                    className='flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-500 active:scale-95 transition-all w-full shadow-md shadow-blue-600/20'
                  >
                    <PlayCircle size={16} />
                    Watch Episode
                  </button>
                </div>
              </div>
            ))}
          </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
