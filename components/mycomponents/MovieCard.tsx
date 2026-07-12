'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Play, PlayCircle, Star, Clapperboard, Tv } from 'lucide-react';

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

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function MovieCard({
  movie,
  genres,
  mediaType,
  onSelect,
  onWatchOnline,
}: MovieCardProps) {
  const reduceMotion = useReducedMotion();

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

  const TypeIcon = mediaType === 'movie' ? Clapperboard : Tv;

  const watchNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatchOnline(movie.media_type, movie.id.toString());
  };

  return (
    <motion.div
      className='group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer ring-1 ring-black/5 dark:ring-white/10 shadow-sm sm:hover:shadow-2xl sm:hover:shadow-black/20 transition-shadow duration-300'
      onClick={() => onSelect(movie)}
      initial={{ scale: 1 }}
      whileHover={reduceMotion ? undefined : { scale: 1.025 }}
      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
    >
      <div className='relative w-full h-full'>
        <span
          className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 text-white rounded-full text-[11px] font-semibold backdrop-blur-md z-10 ${
            mediaType === 'movie' ? 'bg-blue-600/85' : 'bg-cyan-600/85'
          }`}
        >
          <TypeIcon size={11} strokeWidth={2.5} />
          {mediaType === 'movie' ? 'Movie' : 'TV Show'}
        </span>
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw'
          style={{ objectFit: 'cover' }}
          className='rounded-2xl transition-transform duration-500 ease-out sm:group-hover:scale-[1.04]'
        />

        {/* Always-on quick-watch button. Touch devices have no hover, so this is the
            only affordance on mobile; on sm+ it sits alongside the richer hover reveal. */}
        <button
          onClick={watchNow}
          aria-label='Watch now'
          className='absolute top-2.5 right-2.5 z-10 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600/90 text-white backdrop-blur-md active:scale-90 transition-transform sm:opacity-0 sm:group-hover:opacity-100'
        >
          <Play size={14} fill='currentColor' className='ml-0.5' />
        </button>

        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 sm:p-4 pt-8 sm:pt-10'>
          <h3 className='text-white text-sm sm:text-base font-semibold mb-1 line-clamp-2 tracking-tight'>
            {movie.title}
          </h3>
          <p className='text-gray-300 text-[11px] sm:text-xs mb-1.5 sm:mb-2'>{movieGenres}</p>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1 bg-yellow-500/95 text-black px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold'>
              <Star size={10} fill='currentColor' strokeWidth={0} />
              {rating}
            </div>
            <span className='text-gray-300 text-[11px] sm:text-xs'>{year}</span>
          </div>
        </div>

        {/* Desktop-only hover reveal: full overview + labeled CTA. Hidden entirely below
            sm so touch devices never depend on a hover state that can't fire for them. */}
        <div
          className='hidden sm:flex absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/40 backdrop-blur-[2px] p-4 flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out'
        >
          <h3 className='text-white text-lg font-semibold mb-2 tracking-tight text-balance'>{movie.title}</h3>
          <div className='flex items-center text-xs text-gray-300 mb-2'>
            <span className='mr-2'>{year}</span>
            <span className='mr-2 text-gray-500'>•</span>
            <span>{movieGenres}</span>
          </div>
          <p className='text-gray-300 text-sm mb-3 line-clamp-3 text-pretty'>
            {movie.overview || 'No overview available'}
          </p>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex shrink-0 items-center gap-1 bg-yellow-500/95 text-black px-2 py-0.5 rounded-full text-xs font-semibold'>
              <Star size={11} fill='currentColor' strokeWidth={0} />
              {rating}
            </div>
            <button
              onClick={watchNow}
              className='min-w-0 bg-blue-600 text-white px-3.5 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-500 active:scale-95 transition-all flex items-center whitespace-nowrap shadow-lg shadow-blue-600/30'
            >
              <PlayCircle size={16} className='mr-1.5 shrink-0' />
              Watch Online
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
