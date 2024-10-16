import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className='min-h-screen flex flex-col text-white relative overflow-hidden'>
      {/* Main Content */}
      <main className='flex-grow flex items-center justify-center relative z-10 px-4 py-16'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className='text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r dark:from-blue-400 dark:to-purple-600 from-black to-gray-600 drop-shadow-lg'>
            Discover, Watch, and Rate with RateWise
          </h1>
          <p className='text-xl md:text-2xl mb-12 text-gray-800 dark:text-gray-400 drop-shadow-md'>
            Search any movie or TV show, watch it instantly, and share your
            ratings. Your ultimate entertainment companion for finding,
            enjoying, and reviewing content.
          </p>
          <div className='space-y-4 md:space-y-0 md:space-x-4'>
            <Link href='/select'>
              <Button
                size='lg'
                className='bg-gradient-to-r from-black to-gray-700 hover:from-gray-800 hover:to-gray-700 text-white font-bold py-4 px-10 rounded-full transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600'
              >
                Search Movies & Shows
              </Button>
            </Link>
            
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className='py-16 bg-gray-100 dark:bg-transparent bg-opacity-0.2 relative z-10 rounded-md'>
        <div className='max-w-5xl mx-auto px-4'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white'>
            Features
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <FeatureCard
              title='Search Anything'
              description='Find any movie or TV show with our powerful search engine.'
              icon='🔍'
            />
            <FeatureCard
              title='Watch Instantly'
              description='Stream your favorite content directly on our platform.'
              icon='▶️'
            />
            <FeatureCard
              title='Rate and Review'
              description='Share your thoughts and see what others think about the latest releases.'
              icon='⭐'
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='text-center py-6 text-gray-400 relative z-10'>
        <p>&copy; 2024 RateWise. All rights reserved.</p>
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
    <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md'>
      <div className='text-4xl mb-4'>{icon}</div>
      <h3 className='text-xl font-semibold mb-2 text-gray-800 dark:text-white'>
        {title}
      </h3>
      <p className='text-gray-600 dark:text-gray-300'>{description}</p>
    </div>
  );
}
