'use client';

import { useState, useEffect, KeyboardEvent, useCallback } from 'react';
import MovieCard from './MovieCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  genre_ids: number[];
  overview: string;
  video: string;
  release_date: string;
  vote_average: number;
}

interface MovieDetails extends Movie {
  runtime: number;
  director: string;
  cast: string[];
  production_companies: string[];
}

interface Genre {
  id: number;
  name: string;
}

export default function MovieSelector() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ [id: number]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

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

  const searchMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/search-movies?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data.results) {
        setSearchResults(data.results);
      } else {
        setError('No results found');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      setError('Failed to search movies');
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

  const handleSelectMovie = async (movie: Movie) => {
    setSelectedMovie({
      ...movie,
      runtime: 0,
      director: '',
      cast: [],
      production_companies: [],
    });
    setIsModalLoading(true);
    try {
      const response = await fetch(`/api/movie-details?id=${movie.id}`);
      const data = await response.json();
      setSelectedMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to fetch movie details');
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchMovies();
    }
  };

  const handleYoutubeError = useCallback(() => {
    setYoutubeError(true);
  }, []);

  return (
    <div className='min-h-screen text-white dark:text-gray-200 '>
      <div className='px-4 py-8'>
        <div className='max-w-3xl mx-auto mb-8 relative'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Search for movies...'
              className='w-full p-4 pr-12 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-700 shadow-md'
            />
            <button
              onClick={searchMovies}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
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
        ) : (
          <motion.div
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {searchResults.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie as Movie}
                genres={genres}
                onSelect={(movie) => handleSelectMovie(movie as Movie)}
              />
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-50 p-4 overflow-y-auto pt-20'
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
                    {selectedMovie.video && !youtubeError ? (
                      <iframe
                        key={selectedMovie.video}
                        title={selectedMovie.title}
                        src={`https://www.youtube.com/embed/${selectedMovie.video}?autoplay=1`}
                        allow='autoplay; encrypted-media'
                        allowFullScreen
                        className='w-full h-full'
                        onError={handleYoutubeError}
                      ></iframe>
                    ) : (
                      <Image
                        key={selectedMovie.poster_path}
                        width={500}
                        height={500}
                        src={
                          selectedMovie.poster_path
                            ? `https://image.tmdb.org/t/p/w1280${selectedMovie.poster_path}`
                            : '/movie.png'
                        }
                        alt={selectedMovie.title}
                        className='w-full h-full object-cover'
                      />
                    )}
                    {youtubeError && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                        <p className='text-white text-center'>
                          Unable to load video. It may be blocked by your browser or an extension.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className='p-6'>
                    <h2 className='text-2xl font-bold mb-2'>
                      {selectedMovie.title}
                    </h2>
                    <p className='text-gray-300 mb-4'>
                      {selectedMovie.release_date
                        ? new Date(
                            selectedMovie.release_date
                          ).toLocaleDateString()
                        : 'Release date not available'}{' '}
                      •
                      {selectedMovie.runtime
                        ? `${selectedMovie.runtime} min`
                        : 'Runtime not available'}{' '}
                      •
                      {selectedMovie.genre_ids
                        .map((id) => genres[id])
                        .filter(Boolean)
                        .join(', ') || 'Genres not available'}
                    </p>
                    <p className='text-gray-400 mb-4'>
                      {selectedMovie.overview || 'No overview available'}
                    </p>
                    <div className='mb-4'>
                      <strong className='text-gray-300'>Director:</strong>{' '}
                      {selectedMovie.director || 'Not available'}
                    </div>
                    <div className='mb-4'>
                      <strong className='text-gray-300'>Cast:</strong>{' '}
                      {selectedMovie.cast?.join(', ') || 'Not available'}
                    </div>
                    <div className='mb-4'>
                      <strong className='text-gray-300'>
                        Production Companies:
                      </strong>{' '}
                      {selectedMovie.production_companies?.join(', ') ||
                        'Not available'}
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='bg-yellow-500 text-black px-2 py-1 rounded text-sm inline-block'>
                        IMDb{' '}
                        {selectedMovie.vote_average
                          ? selectedMovie.vote_average.toFixed(1)
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
