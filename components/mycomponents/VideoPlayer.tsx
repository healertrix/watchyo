'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Globe, Subtitles } from 'lucide-react';

interface VideoPlayerProps {
  mediaType: 'movie' | 'tv';
  id: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ mediaType, id }) => {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  const [subtitles, setSubtitles] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('q') || '';

  useEffect(() => {
    updateEmbedUrl();
  }, [mediaType, id, language, subtitles]);

  const updateEmbedUrl = () => {
    let url = `https://vidsrc.xyz/embed/${mediaType}?tmdb=${id}`;
    if (mediaType === 'tv') {
      url += '&season=1&episode=1';
    }
    if (language !== 'en') {
      url += `&ds_lang=${language}`;
    }
    if (subtitles) {
      url += `&sub_url=${encodeURIComponent(subtitles)}`;
    }
    setEmbedUrl(url);
  };

  const handleBack = () => {
    const selectedMediaId = searchParams?.get('selectedMediaId') || '';
    const selectedMediaType = searchParams?.get('selectedMediaType') || '';
    const query = searchParams?.get('q') || '';
    router.push(
      `/select?q=${encodeURIComponent(
        query
      )}&selectedMediaId=${selectedMediaId}&selectedMediaType=${selectedMediaType}`
    );
  };

  return (
    <div className='flex flex-col h-screen bg-black'>
      <div className='absolute top-4 left-4 z-10 flex space-x-2'>
        <button
          onClick={handleBack}
          className='text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition-colors focus:outline-none'
          aria-label='Go back'
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
          className='text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition-colors focus:outline-none'
          aria-label='Change language'
        >
          <Globe size={24} />
        </button>
        <button
          onClick={() =>
            setSubtitles(subtitles ? '' : 'https://vidsrc.me/sample.srt')
          }
          className='text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full transition-colors focus:outline-none'
          aria-label='Toggle subtitles'
        >
          <Subtitles size={24} />
        </button>
      </div>
      <div className='flex-grow relative'>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className='w-full h-full'
            allowFullScreen
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
