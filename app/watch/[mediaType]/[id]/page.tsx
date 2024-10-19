'use client';

import Image from 'next/image';
import Link from 'next/link';
import VideoPlayer from '@/components/mycomponents/VideoPlayer';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mediaType = params?.mediaType as string;
  const id = params?.id as string;
  const [isBrave, setIsBrave] = useState(true);

  const season = parseInt(searchParams?.get('season') || '1');
  const episode = parseInt(searchParams?.get('episode') || '1');
  const total = parseInt(searchParams?.get('total') || '1');
  const totalSeasons = parseInt(searchParams?.get('totalSeasons') || '1');
  const searchQuery = searchParams?.get('q') || '';

  const isLastEpisodeOfSeason = episode === total;
  const isLastSeason = season === totalSeasons;

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

  const handleNext = async () => {
    if (isLastEpisodeOfSeason) {
      if (!isLastSeason) {
        // Fetch the next season's details
        const nextSeason = season + 1;
        try {
          const response = await fetch(`/api/tv-show-details?id=${id}&season=${nextSeason}`);
          const data = await response.json();
          const nextSeasonEpisodes = data.current_season.episodes.length;
          
          // Move to the next season's first episode
          router.push(
            `/watch/tv/${id}?season=${nextSeason}&episode=1&total=${nextSeasonEpisodes}&totalSeasons=${totalSeasons}&q=${searchQuery}`
          );
        } catch (error) {
          console.error('Error fetching next season details:', error);
        }
      }
    } else {
      // Move to the next episode
      router.push(
        `/watch/tv/${id}?season=${season}&episode=${
          episode + 1
        }&total=${total}&totalSeasons=${totalSeasons}&q=${searchQuery}`
      );
    }
  };

  const getNextButtonText = () => {
    if (isLastEpisodeOfSeason && !isLastSeason) {
      return 'Next Season';
    }
    return 'Next Episode';
  };

  return (
    <div className='flex flex-col min-h-screen '>
      <div className='flex-grow'>
        <VideoPlayer mediaType={mediaType as 'movie' | 'tv'} id={id} />
      </div>

      {mediaType === 'tv' && (!isLastEpisodeOfSeason || !isLastSeason) && (
        <div className=' p-10 flex justify-center'>
          <button
            onClick={handleNext}
            className='inline-flex items-center justify-center px-10 py-4 text-base font-medium text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            <span className='flex items-center'>
              {getNextButtonText()}
              <ChevronRight
                size={20}
                className='ml-2 transition-transform duration-300 group-hover:translate-x-1'
              />
            </span>
          </button>
        </div>
      )}

      {!isBrave && (
        <div className='bg-gradient-to-r bg-gray-800  text-white p-3 sm:p-4 mt-auto flex flex-col sm:flex-row items-center justify-center shadow-lg rounded-b-sm'>
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
