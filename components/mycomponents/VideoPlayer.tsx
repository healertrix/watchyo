'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
      router.push(`/tv/${id}?q=${encodeURIComponent(searchQuery)}`);
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
    <div className='flex flex-col h-screen'>
      <div className='flex-grow relative'>
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
      <div className='p-4'>
        <button
          onClick={handleBack}
          className='bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors'
        >
          Back to {mediaType === 'tv' ? 'TV Show' : 'Search'}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
