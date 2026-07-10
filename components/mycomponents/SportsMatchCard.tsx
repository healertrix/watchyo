'use client';

import Image from 'next/image';
import { Clock } from 'lucide-react';
import {
  SportsMatch,
  SportsTeam,
  isMatchLive,
  hasWatchableStream,
  validScore,
  assetUrl,
  toMs,
} from '@/lib/sports.types';

interface SportsMatchCardProps {
  match: SportsMatch;
  onSelect: (match: SportsMatch) => void;
  size?: 'large' | 'normal';
}

export default function SportsMatchCard({ match, onSelect, size = 'normal' }: SportsMatchCardProps) {
  const live = isMatchLive(match);
  const watchable = hasWatchableStream(match);
  const kickoffLabel = match.timestamp
    ? new Date(toMs(match.timestamp)).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const large = size === 'large';
  // A match can be live but have no stream link yet (source hasn't posted one). That
  // needs to look clearly different from a live match you can actually click into.
  const liveWatchable = live && watchable;
  const liveNoStream = live && !watchable;

  return (
    <div
      onClick={() => watchable && onSelect(match)}
      className={`group relative w-full rounded-xl border transition-all duration-200 p-4 ${large ? 'p-5' : ''} ${
        watchable
          ? 'cursor-pointer bg-white dark:bg-gray-800/70 border-gray-200 dark:border-gray-700/70 hover:border-blue-400 dark:hover:border-blue-500/70 hover:shadow-lg hover:-translate-y-0.5'
          : 'cursor-not-allowed bg-gray-50 dark:bg-gray-900/40 border-dashed'
      } ${
        liveWatchable
          ? 'border-red-300 dark:border-red-500/50 shadow-sm shadow-red-500/10 bg-red-50/40 dark:bg-red-950/10'
          : ''
      } ${liveNoStream ? 'border-red-200/70 dark:border-red-900/50' : ''} ${
        !watchable && !live ? 'border-gray-200/70 dark:border-gray-800' : ''
      }`}
    >
      <div className='flex items-center justify-between mb-3 gap-2'>
        <span
          className={`text-gray-500 dark:text-gray-400 truncate font-medium ${large ? 'text-sm' : 'text-xs'}`}
        >
          {match.league || match.sport}
        </span>

        {liveWatchable ? (
          <span
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold bg-red-600 text-white shrink-0 ${
              large ? 'text-sm' : 'text-[11px]'
            }`}
          >
            <span className='relative flex w-1.5 h-1.5'>
              <span className='absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping' />
              <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-white' />
            </span>
            {match.currentMinute ? match.currentMinute : 'LIVE'}
          </span>
        ) : liveNoStream ? (
          <span
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold text-red-500 dark:text-red-400 border border-red-300/70 dark:border-red-800 shrink-0 ${
              large ? 'text-sm' : 'text-[11px]'
            }`}
          >
            <span className='w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500' />
            {match.currentMinute ? match.currentMinute : 'LIVE'}
          </span>
        ) : watchable ? (
          <span
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold bg-green-600 text-white shrink-0 ${
              large ? 'text-sm' : 'text-[11px]'
            }`}
          >
            <span className='relative flex w-1.5 h-1.5'>
              <span className='absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping' />
              <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-white' />
            </span>
            WATCH
          </span>
        ) : (
          kickoffLabel && (
            <span
              className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 shrink-0 ${
                large ? 'text-sm' : 'text-xs'
              }`}
            >
              <Clock size={large ? 14 : 12} />
              {kickoffLabel}
            </span>
          )
        )}
      </div>

      {match.isEvent || !match.teams?.home || !match.teams?.away ? (
        <div className='flex items-center gap-2'>
          <span
            className={`font-medium truncate ${
              watchable ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            } ${large ? 'text-lg' : 'text-sm'}`}
          >
            {match.title}
          </span>
        </div>
      ) : (
        <div className={`flex items-center justify-between gap-2 ${!watchable ? 'opacity-70' : ''}`}>
          <TeamRow team={match.teams.home} score={validScore(match.scores?.home)} large={large} />
          <span className='text-xs text-gray-400 dark:text-gray-600 px-1 font-medium'>vs</span>
          <TeamRow
            team={match.teams.away}
            score={validScore(match.scores?.away)}
            align='right'
            large={large}
          />
        </div>
      )}

      {!watchable && (
        <div className='mt-3 pt-2 border-t border-gray-200/70 dark:border-gray-800 text-[11px] text-gray-400 dark:text-gray-500'>
          {liveNoStream ? 'No stream link yet' : 'Not live yet'}
        </div>
      )}
    </div>
  );
}

function TeamRow({
  team,
  score,
  align = 'left',
  large = false,
}: {
  team: SportsTeam;
  score?: number;
  align?: 'left' | 'right';
  large?: boolean;
}) {
  const logoSrc = assetUrl(team.logoUrl);
  const logoSize = large ? 40 : 32;

  return (
    <div
      className={`flex-1 flex items-center gap-2 min-w-0 ${
        align === 'right' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {logoSrc && (
        <div className='relative flex-shrink-0' style={{ width: logoSize, height: logoSize }}>
          <Image
            src={logoSrc}
            alt={team.name}
            fill
            sizes={`${logoSize}px`}
            className='object-contain'
            onError={(e) => {
              (e.target as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
        </div>
      )}
      <span className={`font-medium text-gray-800 dark:text-white truncate ${large ? 'text-base' : 'text-sm'}`}>
        {team.name}
      </span>
      {score !== undefined && (
        <span className={`font-bold text-gray-900 dark:text-gray-100 ${large ? 'text-lg' : 'text-sm'}`}>
          {score}
        </span>
      )}
    </div>
  );
}
