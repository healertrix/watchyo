import VideoPlayer from '@/components/mycomponents/VideoPlayer';

export default function WatchPage({ params }: { params: { mediaType: string; id: string } }) {
  return (
    <div>
      <VideoPlayer mediaType={params.mediaType as 'movie' | 'tv'} id={params.id} />
    </div>
  );
}