'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function SportsVideoPlayer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const embedUrl = searchParams?.get('stream');
  const title = searchParams?.get('title') || 'Match Stream';

  return (
    <div className='relative h-[80vh] bg-black'>
      <div className='absolute left-10 top-6 z-10'>
        <button
          onClick={() => router.push('/select')}
          className='bg-gray-800 bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-100 transition-all duration-200'
          aria-label='Back to search'
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
            title={title}
            allow='autoplay; fullscreen'
          ></iframe>
        ) : (
          <div className='flex items-center justify-center h-full text-white text-center px-4'>
            No stream selected. Go back and pick a match to watch.
          </div>
        )}
      </div>
    </div>
  );
}
