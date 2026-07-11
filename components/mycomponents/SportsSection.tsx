'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  SportsMatch,
  bestStream,
  isMatchLive,
  isMatchFinished,
  hasWatchableStream,
  toMs,
} from '@/lib/sports.types';
import SportsMatchCard from './SportsMatchCard';

interface SportsSectionProps {
  selectedSports: string[];
  searchQuery: string;
}

export default function SportsSection({ selectedSports, searchQuery }: SportsSectionProps) {
  const [matches, setMatches] = useState<SportsMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const hasQuery = Boolean(searchQuery.trim());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sportsToFetch = selectedSports.length > 0 ? selectedSports : ['all'];
        // No search query yet: show today's top/popular matches, but always also pull the
        // live feed directly since currently-live matches aren't necessarily "popular".
        const popularParam = hasQuery ? '' : '&popular=true';
        const fetches = sportsToFetch.flatMap((sport) => {
          const base = fetch(`/api/sports/matches?sport=${encodeURIComponent(sport)}${popularParam}`).then(
            (res) => res.json()
          );
          if (hasQuery) return [base];
          const live = fetch(`/api/sports/matches?sport=${encodeURIComponent(sport)}&live=true`).then((res) =>
            res.json()
          );
          return [base, live];
        });
        const responses = await Promise.all(fetches);

        if (cancelled) return;

        const combined: SportsMatch[] = responses.flatMap((data) => data.matches ?? []);
        const deduped = Array.from(new Map(combined.map((m) => [m.matchId, m])).values());
        setMatches(deduped);
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching matches:', err);
          setError('Failed to load matches. Please try again later.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    const interval = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSports.join(','), hasQuery]);

  const searched = hasQuery
    ? matches.filter((match) => {
        const q = searchQuery.trim().toLowerCase();
        return (
          (match.title ?? '').toLowerCase().includes(q) ||
          (match.teams?.home?.name ?? '').toLowerCase().includes(q) ||
          (match.teams?.away?.name ?? '').toLowerCase().includes(q) ||
          (match.league ?? '').toLowerCase().includes(q) ||
          (match.sport ?? '').toLowerCase().includes(q)
        );
      })
    : matches;

  // Matches with a watchable stream link are kept together at the top of each
  // section, ahead of matches you can't click into yet.
  const byWatchableThen = (compareTime: (a: SportsMatch, b: SportsMatch) => number) => {
    return (a: SportsMatch, b: SportsMatch) => {
      const aWatchable = hasWatchableStream(a) ? 0 : 1;
      const bWatchable = hasWatchableStream(b) ? 0 : 1;
      if (aWatchable !== bWatchable) return aWatchable - bWatchable;
      return compareTime(a, b);
    };
  };

  const notFinished = searched.filter((m) => !isMatchFinished(m));
  const liveMatches = notFinished
    .filter((m) => isMatchLive(m))
    .sort(byWatchableThen((a, b) => toMs(b.timestamp) - toMs(a.timestamp)));
  const upcomingMatches = notFinished
    .filter((m) => !isMatchLive(m))
    .sort(byWatchableThen((a, b) => toMs(a.timestamp) - toMs(b.timestamp)));

  const handleSelect = (match: SportsMatch) => {
    // The match-details API doesn't include streams, only the list endpoints do,
    // so we carry the chosen stream URL and title through the navigation.
    const stream = bestStream(match);
    if (!stream) return;
    if (stream.isRedirect) {
      // Redirect streams refuse to be embedded in an iframe (blank/black screen).
      // Open them directly in a new tab instead.
      window.open(stream.url, '_blank', 'noopener,noreferrer');
      return;
    }
    const params = new URLSearchParams({ stream: stream.url, title: match.title });
    router.push(`/watch/sports/${match.matchId}?${params.toString()}`);
  };

  const totalCount = liveMatches.length + upcomingMatches.length;

  return (
    <div className='mb-8'>
      {isLoading ? (
        <div className='flex justify-center items-center h-32'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      ) : error ? (
        <div className='text-center text-red-500'>{error}</div>
      ) : totalCount > 0 ? (
        <>
          {liveMatches.length > 0 && (
            <div className='mb-8'>
              <h2 className='text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2'>
                <span className='w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse' />
                Live Now
              </h2>
              <motion.div
                className='grid grid-cols-1 lg:grid-cols-2 gap-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {liveMatches.map((match) => (
                  <SportsMatchCard key={match.matchId} match={match} onSelect={handleSelect} size='large' />
                ))}
              </motion.div>
            </div>
          )}

          {upcomingMatches.length > 0 && (
            <div>
              <h2 className='text-xl font-bold mb-4 text-gray-800 dark:text-white'>
                {hasQuery ? 'Other Matches' : 'Upcoming'}
              </h2>
              <motion.div
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {upcomingMatches.map((match) => (
                  <SportsMatchCard key={match.matchId} match={match} onSelect={handleSelect} />
                ))}
              </motion.div>
            </div>
          )}
        </>
      ) : (
        <div className='text-center py-8'>
          <Image
            src='/reel.jpg'
            alt='Movie reel'
            width={300}
            height={300}
            className='mx-auto mb-4'
            loading='eager'
          />
          <p className='text-gray-500'>
            {hasQuery
              ? `No streams found for "${searchQuery}". Try searching for something else.`
              : 'No streams found. Try searching for something else.'}
          </p>
        </div>
      )}
    </div>
  );
}
