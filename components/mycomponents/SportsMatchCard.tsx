'use client';

import Image from 'next/image';
import { Clock, Radio } from 'lucide-react';
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
  const liveWatchable = live && watchable;
  const liveNoStream = live && !watchable;

  return (
    <div
      onClick={() => watchable && onSelect(match)}
      className={`group relative w-full rounded-2xl overflow-hidden transition-all duration-300 ease-out p-4 ${large ? 'p-5 sm:p-6' : ''} ${
        watchable
          ? 'cursor-pointer bg-white dark:bg-slate-900 ring-1 ring-black/5 dark:ring-white/10 shadow-sm hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-0.5'
          : 'cursor-not-allowed bg-gray-50/70 dark:bg-slate-900/40 ring-1 ring-dashed ring-gray-200 dark:ring-slate-800'
      }`}
    >
      {liveWatchable && (
        <div className='absolute inset-0 bg-gradient-to-br from-red-500/[0.06] via-transparent to-transparent pointer-events-none' />
      )}
      {watchable && !live && (
        <div className='absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-transparent pointer-events-none' />
      )}

      <div className='relative flex items-center justify-between mb-4 gap-2'>
        <span
          className={`text-gray-500 dark:text-slate-400 truncate font-semibold uppercase tracking-wide ${large ? 'text-xs' : 'text-[11px]'}`}
        >
          {match.league || match.sport}
        </span>

        {liveWatchable ? (
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-red-600 text-white shrink-0 shadow-sm shadow-red-600/30 ${
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
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-red-500 dark:text-red-400 ring-1 ring-red-300/70 dark:ring-red-800 shrink-0 ${
              large ? 'text-sm' : 'text-[11px]'
            }`}
          >
            <span className='w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500' />
            {match.currentMinute ? match.currentMinute : 'LIVE'}
          </span>
        ) : watchable ? (
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-blue-600 text-white shrink-0 shadow-sm shadow-blue-600/30 ${
              large ? 'text-sm' : 'text-[11px]'
            }`}
          >
            <Radio size={large ? 12 : 10} />
            WATCH
          </span>
        ) : (
          kickoffLabel && (
            <span
              className={`flex items-center gap-1 text-gray-500 dark:text-slate-400 shrink-0 font-medium ${
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
        <div className='relative flex items-center gap-2'>
          <span
            className={`font-semibold truncate tracking-tight ${
              watchable ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-500'
            } ${large ? 'text-xl' : 'text-base'}`}
          >
            {match.title}
          </span>
        </div>
      ) : (
        <div className={`relative flex items-center justify-between gap-2 ${!watchable ? 'opacity-60' : ''}`}>
          <TeamRow team={match.teams.home} score={validScore(match.scores?.home)} large={large} />
          <span
            className={`shrink-0 font-bold text-gray-300 dark:text-slate-700 px-2 ${large ? 'text-sm' : 'text-xs'}`}
          >
            VS
          </span>
          <TeamRow
            team={match.teams.away}
            score={validScore(match.scores?.away)}
            align='right'
            large={large}
          />
        </div>
      )}

      {!watchable && (
        <div className='relative mt-4 pt-3 border-t border-gray-200/70 dark:border-slate-800 text-[11px] font-medium text-gray-400 dark:text-slate-500'>
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
  const logoSize = large ? 44 : 36;

  return (
    <div
      className={`flex-1 flex items-center gap-2.5 min-w-0 ${
        align === 'right' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {logoSrc && (
        <div
          className='relative flex-shrink-0 rounded-full bg-gray-100 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/10 p-1.5'
          style={{ width: logoSize, height: logoSize }}
        >
          <Image
            src={logoSrc}
            alt={team.name}
            fill
            sizes={`${logoSize}px`}
            className='object-contain p-1'
            onError={(e) => {
              (e.target as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
        </div>
      )}
      <div className={`min-w-0 flex ${align === 'right' ? 'flex-row-reverse' : ''} items-baseline gap-2`}>
        <span className={`font-semibold text-gray-900 dark:text-white truncate ${large ? 'text-base' : 'text-sm'}`}>
          {team.name}
        </span>
        {score !== undefined && (
          <span className={`font-bold text-gray-900 dark:text-white tabular-nums ${large ? 'text-xl' : 'text-base'}`}>
            {score}
          </span>
        )}
      </div>
    </div>
  );
}
