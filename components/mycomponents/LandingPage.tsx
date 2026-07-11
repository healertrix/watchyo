'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Clapperboard, Tv, Sparkles, Radio, ArrowRight } from 'lucide-react';

const PILLARS = [
  {
    title: 'Movies',
    description: 'New releases and cult classics, ready in a click.',
    icon: Clapperboard,
    accent: 'text-blue-600 dark:text-blue-400 bg-blue-600/10 dark:bg-blue-400/10',
    mode: 'movies',
  },
  {
    title: 'TV Shows',
    description: 'Binge full seasons of the series everyone is talking about.',
    icon: Tv,
    accent: 'text-cyan-600 dark:text-cyan-400 bg-cyan-600/10 dark:bg-cyan-400/10',
    mode: 'tv',
  },
  {
    title: 'Anime',
    description: 'From seasonal favorites to long-running classics.',
    icon: Sparkles,
    accent: 'text-rose-600 dark:text-rose-400 bg-rose-600/10 dark:bg-rose-400/10',
    mode: 'anime',
  },
  {
    title: 'Live Sports',
    description: 'Football, cricket, and more — streamed as it happens.',
    icon: Radio,
    accent: 'text-amber-600 dark:text-amber-400 bg-amber-600/10 dark:bg-amber-400/10',
    mode: 'sports',
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function LandingPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className='min-h-screen flex flex-col text-white relative overflow-hidden'>
      <main className='flex-grow flex items-center justify-center relative z-10 px-4 py-20 md:py-28'>
        <motion.div
          className='max-w-3xl mx-auto text-center'
          initial={reduceMotion ? undefined : 'hidden'}
          animate={reduceMotion ? undefined : 'show'}
          variants={container}
        >
          <motion.h1
            variants={item}
            className='font-display text-5xl md:text-7xl font-semibold mb-6 leading-[1.05] tracking-tight text-balance text-gray-900 dark:text-white'
          >
            Watch everything.
            <br />
            Anytime. Anywhere.
          </motion.h1>

          <motion.p
            variants={item}
            className='text-xl md:text-2xl mb-10 text-gray-600 dark:text-gray-300 text-pretty'
          >
            Movies. TV shows. Live sports. Just Watchyo.
          </motion.p>

          <motion.div variants={item}>
            <Link href='/select'>
              <Button
                size='lg'
                className='group bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30'
              >
                Start Watching
                <ArrowRight
                  size={18}
                  className='ml-2 transition-transform duration-300 group-hover:translate-x-1'
                />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Content pillars */}
      <section className='py-16 md:py-20 relative z-10'>
        <div className='max-w-5xl mx-auto px-4'>
          <motion.div
            className='grid grid-cols-2 md:grid-cols-4 gap-5'
            initial={reduceMotion ? undefined : 'hidden'}
            whileInView={reduceMotion ? undefined : 'show'}
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
          >
            {PILLARS.map((pillar) => (
              <motion.div key={pillar.title} variants={item}>
                <Link
                  href={`/select?mode=${pillar.mode}`}
                  className='group block h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40 backdrop-blur p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg'
                >
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110 ${pillar.accent}`}
                  >
                    <pillar.icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className='font-display text-lg font-semibold mb-1.5 text-gray-900 dark:text-white'>
                    {pillar.title}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{pillar.description}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='text-center py-6 text-gray-400 relative z-10'>
        <p>&copy; {new Date().getFullYear()} WatchYo. All rights reserved.</p>
      </footer>
    </div>
  );
}
