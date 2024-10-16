'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface VideoPlayerProps {
  mediaType: 'movie' | 'tv';
  id: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ mediaType, id }) => {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('q') || '';
  const season = searchParams?.get('season') || '1';
  const episode = searchParams?.get('episode') || '1';

  const updateEmbedUrl = () => {
    let url = `https://vidsrc.xyz/embed/${mediaType}?tmdb=${id}`;
    if (mediaType === 'tv') {
      url += `&season=${season}&episode=${episode}`;
    }
    setEmbedUrl(url);
  };

  useEffect(() => {
    updateEmbedUrl();
  }, [mediaType, id, season, episode]);

  const handleBack = () => {
    if (mediaType === 'tv') {
      const query = searchParams?.get('q') || '';
      router.push(`/tv/${id}?q=${encodeURIComponent(query)}&season=${season}`);
    } else {
      const selectedMediaId = searchParams?.get('selectedMediaId') || '';
      const selectedMediaType = searchParams?.get('selectedMediaType') || '';
      const query = searchParams?.get('q') || '';
      router.push(
        `/select?q=${encodeURIComponent(query)}&selectedMediaId=${selectedMediaId}&selectedMediaType=${selectedMediaType}`
      );
    }
  };

  return (
    <div className='relative h-screen bg-black'>
      <div className='absolute left-10 top-6 z-10'>
        <button
          onClick={handleBack}
          className='bg-gray-800 bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-100 transition-all duration-200'
          aria-label={`Back to ${mediaType === 'tv' ? 'TV Show' : 'Search'}`}
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      <div className='h-full'>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className='w-full h-full'
            allowFullScreen
            title='Video Player'
            allow='autoplay'
          ></iframe>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500'></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
