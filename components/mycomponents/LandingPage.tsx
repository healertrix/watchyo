import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className='min-h-screen flex flex-col text-white relative overflow-hidden'>
      {/* Main Content */}
      <main className='flex-grow flex items-center justify-center relative z-10 px-4 py-16'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className='text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r dark:from-blue-400 dark:to-purple-600 from-black to-gray-600 drop-shadow-lg'>
            Discover, Stream, and Explore with WatchWise
          </h1>
          <p className='text-xl md:text-2xl mb-12 text-gray-800 dark:text-gray-400 drop-shadow-md'>
            Your ultimate entertainment hub for movies, TV shows, and anime. Search, discover, watch trailers, and stream in the best available quality. Experience entertainment like never before.
          </p>
          <div className='space-y-4 md:space-y-0 md:space-x-4'>
            <Link href='/select'>
              <Button
                size='lg'
                className='bg-gradient-to-r from-gray-800 to-black hover:from-gray-400 hover:to-gray-900 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-700 dark:hover:to-purple-700 text-white font-bold py-4 px-10 rounded-full transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl'
              >
                Explore Now
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className='py-14 bg-gray-50 dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-50 relative z-10 rounded-lg shadow-lg'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-3xl md:text-5xl font-bold text-center mb-12 text-gray-800 dark:text-white'>
            Unleash the Power of WatchWise
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <FeatureCard
              title='Universal Search'
              description='Find any movie, TV show, or anime with our advanced search engine.'
              icon='🌐'
            />
            <FeatureCard
              title='High-Quality Streaming'
              description='Watch your favorite content in the best available quality.'
              icon='🎥'
            />
            <FeatureCard
              title='Trailers & Previews'
              description='Watch trailers and get a sneak peek before diving into full content.'
              icon='🍿'
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='text-center py-6 text-gray-400 relative z-10'>
        <p>&copy; 2024 WatchWise. All rights reserved.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300'>
      <div className='text-4xl mb-4'>{icon}</div>
      <h3 className='text-xl font-semibold mb-2 text-gray-800 dark:text-white'>
        {title}
      </h3>
      <p className='text-gray-600 dark:text-gray-300'>{description}</p>
    </div>
  );
}
