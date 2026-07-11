'use client';

import { useState, useEffect, KeyboardEvent, useCallback } from 'react';
import MovieCard, { Movie } from './MovieCard';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, PlayCircle, Star, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterPills, { SportsFilterPills } from './FilterPills';
import SportsSection from './SportsSection';
import { FilterState, DEFAULT_FILTER_STATE, loadFilterState, saveFilterState } from '@/lib/filterState';

interface MediaItem extends Movie {
  name?: string;
  first_air_date?: string;
}

interface MediaDetails extends MediaItem {
  runtime?: number;
  number_of_seasons?: number;
  creative_team?: { role: string; name: string }[];
  cast: string[];
  production_companies: { name: string }[];
  genres?: { id: number; name: string }[];
}

interface Genre {
  id: number;
  name: string;
}

// TMDB's genre id for "Animation" — used to bucket anime separately from Movies/TV.
const ANIMATION_GENRE_ID = 16;

export default function MovieSelector() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [genres, setGenres] = useState<{ [id: number]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaDetails | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [hydrated, setHydrated] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const restored = loadFilterState();

    // The home page's Movies / TV Shows / Live Sports cards link here with a `mode`
    // param so the right filter is already active when the page lands.
    const mode = searchParams?.get('mode');
    const withMode: FilterState =
      mode === 'movies'
        ? { ...restored, showMovies: true, showTvSeries: false, showAnime: false, showSports: false }
        : mode === 'tv'
        ? { ...restored, showMovies: false, showTvSeries: true, showAnime: false, showSports: false }
        : mode === 'anime'
        ? { ...restored, showMovies: false, showTvSeries: false, showAnime: true, showSports: false }
        : mode === 'sports'
        ? { ...restored, showSports: true }
        : restored;

    setFilterState(withMode);

    const query = searchParams?.get('q');
    const selectedMediaId = searchParams?.get('selectedMediaId');
    const selectedMediaType = searchParams?.get('selectedMediaType');

    const effectiveQuery = query || withMode.searchQuery;
    if (effectiveQuery) {
      setSearchQuery(effectiveQuery);
      if (withMode.showMovies || withMode.showTvSeries || withMode.showAnime) {
        searchMedia(effectiveQuery);
      }
    }

    if (selectedMediaId && selectedMediaType && !selectedMedia) {
      fetchMediaDetails(selectedMediaId, selectedMediaType);
    }

    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const query = searchParams?.get('q');
    if (
      query &&
      query !== searchQuery &&
      (filterState.showMovies || filterState.showTvSeries || filterState.showAnime)
    ) {
      setSearchQuery(query);
      searchMedia(query);
    }
  }, [searchParams]);

  const updateFilterState = useCallback((next: FilterState) => {
    setFilterState(next);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveFilterState({ ...filterState, searchQuery });
  }, [filterState, searchQuery, hydrated]);

  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMedia]);

  useEffect(() => {
    if (!selectedMedia) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMedia(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia]);

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/genres');
      const data = await response.json();
      if (data.genres) {
        const genreMap = data.genres.reduce(
          (acc: { [id: number]: string }, genre: Genre) => {
            acc[genre.id] = genre.name;
            return acc;
          },
          {}
        );
        setGenres(genreMap);
      } else {
        setError('Failed to fetch genres');
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
      setError('Failed to fetch genres');
    }
  };

  const searchMedia = useCallback(async (query: string = searchQuery) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const [moviesResponse, seriesResponse] = await Promise.all([
        fetch(`/api/search-movies?query=${encodeURIComponent(query.trim())}`),
        fetch(`/api/search-series?query=${encodeURIComponent(query.trim())}`),
      ]);

      if (!moviesResponse.ok || !seriesResponse.ok) {
        throw new Error('Failed to fetch search results');
      }

      const moviesData = await moviesResponse.json();
      const seriesData = await seriesResponse.json();

      if (moviesData.error || seriesData.error) {
        throw new Error(moviesData.error || seriesData.error);
      }

      const movies = moviesData.results.map((movie: any) => ({
        ...movie,
        media_type: 'movie',
        release_date: movie.release_date,
      }));
      const series = seriesData.results.map((series: any) => ({
        ...series,
        media_type: 'tv',
        first_air_date: series.first_air_date,
        title: series.name,
      }));

      const combinedResults = [...movies, ...series].sort(
        (a, b) => b.vote_average - a.vote_average
      );

      setSearchResults(combinedResults);
      updateURLParams(query);
    } catch (error) {
      console.error('Error searching media:', error);
      setError(
        'Failed to search movies and TV series. Please try again later.'
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const updateURLParams = useCallback((
    query: string,
    mediaId?: string,
    mediaType?: string
  ) => {
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set('q', query);
    if (mediaId && mediaType) {
      newParams.set('selectedMediaId', mediaId);
      newParams.set('selectedMediaType', mediaType);
    } else {
      newParams.delete('selectedMediaId');
      newParams.delete('selectedMediaType');
    }
    const nextQueryString = newParams.toString();
    // Skip the navigation entirely when nothing would actually change — pushing to
    // an identical URL still fires a new `searchParams` object, which re-triggers
    // the effect below and can loop (search -> push -> re-search -> push -> ...).
    if (nextQueryString === searchParams?.toString()) return;
    router.push(`/select?${nextQueryString}`, { scroll: false });
  }, [router, searchParams]);

  const handlePlayTrailer = (videoKey: string) => {
    setTrailerKey(videoKey);
  };

  const closeTrailer = () => {
    setTrailerKey(null);
  };

  const handleSelectMedia = async (media: MediaItem) => {
    setSelectedMedia({
      ...media,
      runtime: 0,
      creative_team: media.creative_team || [],
      cast: [],
      production_companies: [],
    });
    setIsModalLoading(true);
    try {
      await fetchMediaDetails(media.id.toString(), media.media_type);
    } catch (error) {
      console.error('Error fetching media details:', error);
      setError('Failed to fetch media details');
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      searchMedia();
    }
  };

  const handleYoutubeError = useCallback(() => {
    setYoutubeError(true);
  }, []);

  const handleWatchOnline = useCallback(
    (mediaType: string, id: string) => {
      if (mediaType === 'tv') {
        router.push(`/tv/${id}?q=${encodeURIComponent(searchQuery)}`);
      } else {
        router.push(
          `/watch/${mediaType}/${id}?q=${encodeURIComponent(
            searchQuery
          )}&selectedMediaId=${id}&selectedMediaType=${mediaType}`
        );
      }
    },
    [router, searchQuery]
  );

  const fetchMediaDetails = useCallback(async (id: string, mediaType: string) => {
    try {
      const endpoint =
        mediaType === 'movie' ? 'movie-details' : 'series-details';
      const response = await fetch(`/api/${endpoint}?id=${id}`);
      const data = await response.json();
      setSelectedMedia({
        ...data,
        release_date: data.release_date || data.first_air_date,
        media_type: mediaType,
      });
      updateURLParams(searchQuery, id, mediaType);
    } catch (error) {
      console.error('Error fetching media details:', error);
      setError('Failed to fetch media details');
    }
  }, [searchQuery, updateURLParams]);

  return (
    <div className='min-h-screen text-gray-900 dark:text-gray-100'>
      <div className='container mx-auto px-4 sm:px-6 py-6 sm:py-8'>
        <FilterPills value={filterState} onChange={updateFilterState} />

        <div className='max-w-5xl mx-auto mb-6 sm:mb-10 relative'>
          <div className='relative'>
            <Search
              size={18}
              className='pointer-events-none absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500'
            />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Search movies, TV, anime, teams...'
              className='w-full py-3.5 sm:py-5 pl-11 sm:pl-14 pr-14 sm:pr-16 text-sm sm:text-base bg-white dark:bg-gray-800/80 text-gray-800 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-950 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 focus:shadow-lg focus:shadow-blue-600/10'
            />
            <button
              onClick={() => searchMedia(searchQuery)}
              disabled={!searchQuery.trim()}
              className='absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-40 disabled:hover:bg-blue-600 disabled:cursor-not-allowed shadow-md shadow-blue-600/20'
              aria-label='Search'
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        <SportsFilterPills value={filterState} onChange={updateFilterState} />

        {filterState.showSports && (
          <SportsSection selectedSports={filterState.selectedSports} searchQuery={searchQuery} />
        )}

        {(() => {
          // TMDB tags anime under the "Animation" genre (id 16); treat that as its own
          // bucket rather than lumping it in with Movies/TV Shows.
          const visibleResults = searchResults.filter((media) => {
            const isAnime = media.genre_ids?.includes(ANIMATION_GENRE_ID) ?? false;
            if (isAnime) return filterState.showAnime;
            return (
              (media.media_type === 'movie' && filterState.showMovies) ||
              (media.media_type === 'tv' && filterState.showTvSeries)
            );
          });

          if (
            filterState.showSports ||
            (!filterState.showMovies && !filterState.showTvSeries && !filterState.showAnime)
          )
            return null;

          return isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600'></div>
            </div>
          ) : error ? (
            <div className='text-center text-red-500'>{error}</div>
          ) : visibleResults.length > 0 ? (
            <motion.div
              className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {visibleResults.map((media) => (
                <MovieCard
                  key={`${media.media_type}-${media.id}`}
                  movie={media}
                  genres={genres}
                  mediaType={media.media_type}
                  onSelect={handleSelectMedia}
                  onWatchOnline={handleWatchOnline}
                />
              ))}
            </motion.div>
          ) : hasSearched ? (
            <div className='text-center py-4'>
              <Image
                src='/reel.jpg'
                alt='Movie reel'
                width={220}
                height={220}
                className='mx-auto mb-5 rounded-2xl'
                loading='eager'
              />
              <h2 className='font-display text-xl font-semibold mb-1.5 text-gray-900 dark:text-white'>
                No results found
              </h2>
              <p className='text-gray-500 dark:text-gray-400'>
                Try searching for a different movie or TV show.
              </p>
            </div>
          ) : (
            <div className='text-center py-4'>
              <Image
                src='/goodog.png'
                alt='Goodoog'
                width={220}
                height={220}
                className='mx-auto mb-5'
                loading='eager'
              />
              <h2 className='font-display text-xl font-semibold mb-1.5 text-gray-900 dark:text-white'>
                Start your journey
              </h2>
              <p className='text-gray-500 dark:text-gray-400'>
                Search for your favorite movies and TV shows above.
              </p>
            </div>
          );
        })()}
      </div>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <motion.div
              className='bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden max-w-4xl w-full relative my-8 ring-1 ring-blue-500/10 shadow-2xl shadow-black/50'
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0, y: 24 }}
              transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={closeModal}
                className='absolute top-3 right-3 sm:top-4 sm:right-4 text-white bg-black/40 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center z-20 hover:bg-black/60 active:scale-95 transition-all'
                aria-label='Close'
              >
                <X size={18} />
              </button>
              {isModalLoading ? (
                <div className='flex justify-center items-center h-64'>
                  <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
                </div>
              ) : (
                <>
                  <div className='relative aspect-video bg-black'>
                    {selectedMedia.video && !youtubeError ? (
                      <iframe
                        key={selectedMedia.video}
                        title={selectedMedia.title || selectedMedia.name}
                        src={`https://www.youtube.com/embed/${selectedMedia.video}?autoplay=1`}
                        allow='autoplay; encrypted-media'
                        allowFullScreen
                        className='w-full h-full'
                        onError={handleYoutubeError}
                      ></iframe>
                    ) : (
                      <Image
                        key={selectedMedia.poster_path}
                        width={500}
                        height={500}
                        src={
                          selectedMedia.poster_path
                            ? `https://image.tmdb.org/t/p/w1280${selectedMedia.poster_path}`
                            : '/movie.png'
                        }
                        alt={selectedMedia.title || selectedMedia.name || ''}
                        className='w-full h-full object-cover'
                      />
                    )}
                    {youtubeError && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                        <p className='text-white text-center'>
                          Unable to load video. It may be blocked by your
                          browser or an extension.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className='p-4 sm:p-8'>
                    <div className='flex items-start justify-between gap-3 sm:gap-4 mb-3'>
                      <h2 className='font-display text-xl sm:text-3xl font-semibold text-white tracking-tight text-balance'>
                        {selectedMedia.title || selectedMedia.name}
                      </h2>
                      <div className='shrink-0 flex items-center gap-2'>
                        <button
                          onClick={() =>
                            handleWatchOnline(
                              selectedMedia.media_type,
                              selectedMedia.id.toString()
                            )
                          }
                          className='flex items-center text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold active:scale-95 transition-all shadow-lg bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                        >
                          <PlayCircle className='w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5' />
                          Watch Now
                        </button>
                      </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-2 mb-4'>
                      <div className='flex items-center gap-1 bg-yellow-500/95 text-black px-2.5 py-1 rounded-full text-xs font-semibold'>
                        <Star size={12} fill='currentColor' strokeWidth={0} />
                        {selectedMedia.vote_average
                          ? selectedMedia.vote_average.toFixed(1)
                          : 'N/A'}
                      </div>
                      <span className='text-sm text-slate-400'>
                        {(() => {
                          const date =
                            selectedMedia.release_date ||
                            selectedMedia.first_air_date;
                          return date
                            ? new Date(date).getFullYear()
                            : 'Year not available';
                        })()}
                      </span>
                      <span className='text-slate-600'>•</span>
                      <span className='text-sm text-slate-400'>
                        {selectedMedia.media_type === 'movie'
                          ? selectedMedia.runtime
                            ? `${selectedMedia.runtime} min`
                            : 'Runtime not available'
                          : selectedMedia.number_of_seasons
                          ? `${selectedMedia.number_of_seasons} season${
                              selectedMedia.number_of_seasons > 1 ? 's' : ''
                            }`
                          : 'Seasons not available'}
                      </span>
                    </div>

                    <div className='flex flex-wrap gap-1.5 mb-5'>
                      {(selectedMedia.genres
                        ? selectedMedia.genres.map((genre: { name: string }) => genre.name)
                        : selectedMedia.genre_ids
                        ? selectedMedia.genre_ids.map((id: number) => genres[id]).filter(Boolean)
                        : []
                      ).map((genreName: string) => (
                        <span
                          key={genreName}
                          className='px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        >
                          {genreName}
                        </span>
                      ))}
                    </div>

                    <p className='text-slate-400 leading-relaxed mb-6 text-pretty max-w-[70ch]'>
                      {selectedMedia.overview || 'No overview available'}
                    </p>

                    <div className='space-y-3 text-sm'>
                      <div>
                        <span className='block text-[11px] uppercase tracking-wider text-slate-500 mb-0.5'>
                          Creative Team
                        </span>
                        <span className='text-slate-300'>
                          {selectedMedia.creative_team &&
                          selectedMedia.creative_team.length > 0
                            ? selectedMedia.creative_team
                                .map((teamMember) => teamMember.name)
                                .join(', ')
                            : 'Not available'}
                        </span>
                      </div>
                      <div>
                        <span className='block text-[11px] uppercase tracking-wider text-slate-500 mb-0.5'>
                          Cast
                        </span>
                        <span className='text-slate-300'>
                          {selectedMedia.cast && selectedMedia.cast.length > 0
                            ? selectedMedia.cast.join(', ')
                            : 'Not available'}
                        </span>
                      </div>
                      <div>
                        <span className='block text-[11px] uppercase tracking-wider text-slate-500 mb-0.5'>
                          Production Companies
                        </span>
                        <span className='text-slate-300'>
                          {selectedMedia.production_companies &&
                          selectedMedia.production_companies.length > 0
                            ? selectedMedia.production_companies
                                .map((company) => company.name)
                                .join(', ')
                            : 'Not available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}