'use client';

import { useState, useEffect, KeyboardEvent, useCallback } from 'react';
import MovieCard, { Movie } from './MovieCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface MediaItem extends Movie {
  name?: string;
  first_air_date?: string;
}

interface MediaDetails extends MediaItem {
  runtime?: number;
  number_of_seasons?: number;
  director?: string;
  created_by?: { name: string }[];
  cast: string[];
  production_companies: { name: string }[];
  genres?: { id: number; name: string }[];
}

interface Genre {
  id: number;
  name: string;
}

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

  useEffect(() => {
    fetchGenres();
  }, []);

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

  const searchMedia = async () => {
    if (!searchQuery.trim()) {
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
        fetch(`/api/search-movies?query=${encodeURIComponent(searchQuery.trim())}`),
        fetch(`/api/search-series?query=${encodeURIComponent(searchQuery.trim())}`),
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
      }));
      const series = seriesData.results.map((series: any) => ({
        ...series,
        media_type: 'tv',
      }));

      const combinedResults = [...movies, ...series].sort(
        (a, b) => b.vote_average - a.vote_average
      );

      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Error searching media:', error);
      setError(
        'Failed to search movies and TV series. Please try again later.'
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      director: '',
      cast: [],
      production_companies: [],
    });
    setIsModalLoading(true);
    try {
      const endpoint =
        media.media_type === 'movie' ? 'movie-details' : 'series-details';
      const response = await fetch(`/api/${endpoint}?id=${media.id}`);
      const data = await response.json();
      setSelectedMedia(data);
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

  return (
    <div className='min-h-screen text-white dark:text-gray-200'>
      <div className='px-4 py-8'>
        <div className='max-w-3xl mx-auto mb-8 relative'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Search for movies and TV series...'
              className='w-full p-4 pr-12 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-700 shadow-md'
            />
            <button
              onClick={searchMedia}
              disabled={!searchQuery.trim()}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='Search'
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
          </div>
        ) : error ? (
          <div className='text-center text-red-500'>{error}</div>
        ) : searchResults && searchResults.length > 0 ? (
          <motion.div
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {searchResults.map((media) => (
              <MovieCard
                key={`${media.media_type}-${media.id}`}
                movie={media}
                genres={genres}
                mediaType={media.media_type}
                onSelect={handleSelectMedia}
              />
            ))}
          </motion.div>
        ) : hasSearched ? (
          <div className='text-center'>
            <Image
              src="/reel.jpg"
              alt="Movie reel"
              width={300}
              height={300}
              className="mx-auto mb-4"
              loading="eager"
            />
            <p className='text-gray-500'>No results found. Try searching for a movie or TV show.</p>
          </div>
        ) : (
          <div className='text-center'>
            <Image
              src="/goodog.png"
              alt="Goodoog"
              width={300}
              height={300}
              className="mx-auto mb-4"
              loading="eager"
            />
            
            <p className='text-gray-500'>Start your journey by searching for your favorite movies and TV shows.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-50 p-4 overflow-y-auto'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='bg-gray-900 rounded-lg overflow-hidden max-w-4xl w-full relative my-8'
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
            >
              <button
                onClick={closeModal}
                className='absolute top-4 right-4 text-white text-2xl bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center z-20 hover:bg-blue-700 transition-colors'
                aria-label='Close'
              >
                &times;
              </button>
              {isModalLoading ? (
                <div className='flex justify-center items-center h-64'>
                  <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
                </div>
              ) : (
                <>
                  <div className='aspect-video'>
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
                  <div className='p-6'>
                    <h2 className='text-2xl font-bold mb-2'>
                      {selectedMedia.title || selectedMedia.name}
                    </h2>
                    <p className='text-gray-300 mb-4'>
                      {selectedMedia.release_date ||
                      selectedMedia.first_air_date
                        ? new Date(
                            selectedMedia.release_date ||
                              selectedMedia.first_air_date ||
                              ''
                          ).toLocaleDateString()
                        : 'Release date not available'}{' '}
                      •
                      {selectedMedia.media_type === 'movie'
                        ? selectedMedia.runtime
                          ? `${selectedMedia.runtime} min`
                          : 'Runtime not available'
                        : selectedMedia.number_of_seasons
                        ? `${selectedMedia.number_of_seasons} season${
                            selectedMedia.number_of_seasons > 1 ? 's' : ''
                          }`
                        : 'Seasons not available'}{' '}
                      •
                      {selectedMedia.genres
                        ? selectedMedia.genres
                            .map((genre: { name: string }) => genre.name)
                            .join(', ')
                        : selectedMedia.genre_ids
                        ? selectedMedia.genre_ids
                            .map((id: number) => genres[id])
                            .filter(Boolean)
                            .join(', ')
                        : 'Genres not available'}
                    </p>
                    <p className='text-gray-400 mb-4'>
                      {selectedMedia.overview || 'No overview available'}
                    </p>
                    <div className='mb-4'>
                      <strong className='text-gray-300'>
                        {selectedMedia.media_type === 'movie'
                          ? 'Director:'
                          : 'Created by:'}
                      </strong>{' '}
                      {selectedMedia.media_type === 'movie'
                        ? selectedMedia.director || 'Not available'
                        : selectedMedia.created_by
                            ?.map((creator) => creator.name)
                            .join(', ') || 'Not available'}
                    </div>
                    <div className='mb-4'>
                      <strong className='text-gray-300'>Cast:</strong>{' '}
                      {selectedMedia.cast?.join(', ') || 'Not available'}
                    </div>
                    <div className='mb-4'>
                      <strong className='text-gray-300'>
                        Production Companies:
                      </strong>{' '}
                      {selectedMedia.production_companies?.length
                        ? selectedMedia.production_companies
                            .map((company) => company.name)
                            .join(', ') || 'Not available'
                        : 'Not available'}
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='bg-yellow-500 text-black px-2 py-1 rounded text-sm inline-block'>
                        IMDb{' '}
                        {selectedMedia.vote_average
                          ? selectedMedia.vote_average.toFixed(1)
                          : 'N/A'}
                      </div>
                      <button
                        onClick={closeModal}
                        className='bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors'
                      >
                        Close
                      </button>
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