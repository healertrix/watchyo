'use client';

import VideoPlayer from '@/components/mycomponents/VideoPlayer';
import { useParams } from 'next/navigation';

export default function WatchPage() {
  const params = useParams();
  const mediaType = params?.mediaType as string;
  const id = params?.id as string;

  if (!mediaType || !id) {
    return <div>Invalid parameters</div>;
  }

  return (
    <div>
      <VideoPlayer mediaType={mediaType as 'movie' | 'tv'} id={id} />
    </div>
  );
}