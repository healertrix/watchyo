'use client';

import Image from 'next/image';
import Link from 'next/link';
import VideoPlayer from '@/components/mycomponents/VideoPlayer';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function WatchPage() {
  const params = useParams();
  const mediaType = params?.mediaType as string;
  const id = params?.id as string;
  const [isBrave, setIsBrave] = useState(true);

  useEffect(() => {
    const checkBrowser = () => {
      // @ts-ignore
      const isBrave = navigator.brave?.isBrave?.() || false;
      setIsBrave(isBrave);
    };

    checkBrowser();
  }, []);

  if (!mediaType || !id) {
    return <div>Invalid parameters</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <VideoPlayer mediaType={mediaType as 'movie' | 'tv'} id={id} />
      </div>
      {!isBrave && (
        <div className='bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3 sm:p-4 mt-auto flex flex-col sm:flex-row items-center justify-center shadow-lg rounded-b-md'>
          <p className='text-xs sm:text-sm text-center sm:text-left mb-2 sm:mb-0 sm:mr-4'>
            For the best streaming experience, we recommend:
          </p>
          <Link
            href='https://brave.com/en-in/'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center hover:opacity-80 transition-opacity duration-300'
          >
            <Image
              src='/brave_color_darkbackground.png'
              alt='Brave Browser Logo'
              width={60}
              height={60}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
