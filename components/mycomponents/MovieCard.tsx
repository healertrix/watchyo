'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[] | undefined;
  overview: string;
  video: string | null;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  creative_team?: { role: string; name: string }[];
}

interface MovieCardProps {
  movie: Movie;
  genres: { [id: number]: string };
  mediaType: string;
  onSelect: (movie: Movie) => void;
  onWatchOnline: (mediaType: string, id: string) => void;
}

export default function MovieCard({
  movie,
  genres,
  mediaType,
  onSelect,
  onWatchOnline,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this breakpoint as needed
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/movie.png';

  const movieGenres = movie.genre_ids
    ? movie.genre_ids
        .map((id) => genres[id])
        .filter(Boolean)
        .slice(0, 2)
        .join(' • ')
    : 'Genre not available';

  const year = (() => {
    const date = movie.release_date || movie.first_air_date;
    if (date && typeof date === 'string') {
      return new Date(date).getFullYear();
    }
    return 'Year not available';
  })();

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  // console.log('Movie data:', movie);

  const formatCreativeTeam = (creativeTeam: { role: string; name: string }[]) => {
    const directors = creativeTeam.filter(member => member.role === 'Director').slice(0, 2);
    const producers = creativeTeam.filter(member => member.role === 'Producer').slice(0, 2);
    const writer = creativeTeam.find(member => member.role === 'Writer');

    const formattedTeam = [
      ...directors.map(d => `${d.name} (Director)`),
      ...producers.map(p => `${p.name} (Producer)`),
      writer ? `${writer.name} (Writer)` : null
    ].filter(Boolean);

    return formattedTeam.join(', ') || 'Creative team not available';
  };

  const creativeTeam = movie.creative_team
    ? formatCreativeTeam(movie.creative_team)
    : 'Creative team not available';

  return (
    <motion.div
      className='relative w-full aspect-[2/3] rounded-lg overflow-hidden cursor-pointer'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(movie)}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className='relative w-full h-full'>
        <span
          className={`absolute top-2 left-2 px-2 py-1 text-white rounded text-xs ${
            mediaType === 'movie' ? 'bg-blue-500' : 'bg-green-500'
          } opacity-80 z-10`}
        >
          {mediaType === 'movie' ? 'Movie' : 'TV Show'}
        </span>
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          style={{ objectFit: 'cover' }}
          className='rounded-lg'
        />
        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4'>
          <h3 className='text-white text-lg font-bold mb-1 line-clamp-2'>
            {movie.title}
          </h3>
          <p className='text-gray-300 text-sm'>{movieGenres}</p>
          <div className='flex items-center justify-between mt-2'>
            <div className='flex items-center'>
              <div className='bg-yellow-500 text-black px-2 py-1 rounded text-sm mr-2'>
                IMDb {rating}
              </div>
              <span className='text-white text-sm'>{year}</span>
            </div>
            {isMobile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWatchOnline(movie.media_type, movie.id.toString());
                }}
                className='bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center'
              >
                <PlayCircle size={16} className="mr-1" />
                Watch
              </button>
            )}
          </div>
        </div>
        {(isHovered && !isMobile) && (
          <motion.div
            className='absolute inset-0 bg-black bg-opacity-75 p-4 flex flex-col justify-end'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className='text-white text-xl font-bold mb-2'>{movie.title}</h3>
            <div className='flex items-center text-sm text-gray-300 mb-2'>
              <span className='mr-2'>{year}</span>
              <span className='mr-2'>•</span>
              <span>{movieGenres}</span>
            </div>
            <p className='text-gray-300 text-sm mb-2 line-clamp-3'>
              {movie.overview || 'No overview available'}
            </p>
            <div className='flex items-center justify-between'>
              <div className='bg-yellow-500 text-black px-2 py-1 rounded text-sm'>
                IMDb {rating}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWatchOnline(movie.media_type, movie.id.toString());
                }}
                className='bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center'
              >
                <PlayCircle size={16} className="mr-1" />
                Watch Online
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
