'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterState } from '@/lib/filterState';
import { SportInfo } from '@/lib/sports.types';

interface FilterPillsProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap',
        active
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
      )}
    >
      {children}
    </button>
  );
}

function SegmentPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/60'
      )}
    >
      {children}
    </button>
  );
}

// Never leave both Movies and TV off — fall back to showing both.
function ensureContentDefault(showMovies: boolean, showTvSeries: boolean) {
  if (!showMovies && !showTvSeries) return { showMovies: true, showTvSeries: true };
  return { showMovies, showTvSeries };
}

// Movies/TV and Sports are two mutually exclusive modes, presented as a segmented
// control: whichever side isn't active is visually dulled rather than hidden.
export default function FilterPills({ value, onChange }: FilterPillsProps) {
  const moviesTvActive = !value.showSports;

  const toggleContent = (key: 'showMovies' | 'showTvSeries') => {
    const flipped = { showMovies: value.showMovies, showTvSeries: value.showTvSeries, [key]: !value[key] };
    onChange({ ...value, ...ensureContentDefault(flipped.showMovies, flipped.showTvSeries), showSports: false });
  };

  const activateSports = () => {
    onChange({ ...value, showSports: true });
  };

  return (
    <div className='flex items-stretch justify-center gap-3 mb-4'>
      <div
        className={cn(
          'flex items-center gap-1 rounded-xl border-2 p-1 transition-all duration-200',
          moviesTvActive
            ? 'border-blue-500/50 bg-blue-50/60 dark:bg-blue-950/20'
            : 'border-gray-200 dark:border-gray-800 opacity-50 saturate-50'
        )}
      >
        <SegmentPill active={moviesTvActive && value.showMovies} onClick={() => toggleContent('showMovies')}>
          Movies
        </SegmentPill>
        <SegmentPill active={moviesTvActive && value.showTvSeries} onClick={() => toggleContent('showTvSeries')}>
          TV Series
        </SegmentPill>
      </div>

      <button
        type='button'
        onClick={activateSports}
        className={cn(
          'px-6 rounded-xl border-2 text-sm font-semibold transition-all duration-200',
          value.showSports
            ? 'border-blue-500/50 bg-blue-600 text-white shadow-sm'
            : 'border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 opacity-50 saturate-50 hover:opacity-75'
        )}
      >
        Sports
      </button>
    </div>
  );
}

const PILL_GAP_PX = 8;
const MORE_BUTTON_RESERVE_PX = 100;

// Manual overrides for pill placement: pinned sports lead the always-visible row
// (in this order), forced sports always land in the "More" dropdown regardless of
// how much room is available.
const MAIN_PRIORITY = ['football', 'cricket'];
const FORCE_DROPDOWN = ['baseball', 'rugby'];

function sportKey(sport: SportInfo): string {
  return `${sport.name ?? ''} ${sport.displayName ?? ''}`.toLowerCase();
}

// Reorders the fetched sports list so pinned sports lead, forced-dropdown sports are
// pulled out entirely, and everything else keeps its original relative order.
function applyPlacementOverrides(sports: SportInfo[]) {
  const forced = FORCE_DROPDOWN.map((key) => sports.find((s) => sportKey(s).includes(key))).filter(
    (s): s is SportInfo => Boolean(s)
  );
  const forcedNames = new Set(forced.map((s) => s.name));

  const pinned = MAIN_PRIORITY.map((key) =>
    sports.find((s) => sportKey(s).includes(key) && !forcedNames.has(s.name))
  ).filter((s): s is SportInfo => Boolean(s));
  const pinnedNames = new Set(pinned.map((s) => s.name));

  const rest = sports.filter((s) => !pinnedNames.has(s.name) && !forcedNames.has(s.name));

  return { mainPool: [...pinned, ...rest], forced };
}

export function SportsFilterPills({ value, onChange }: FilterPillsProps) {
  const [sports, setSports] = useState<SportInfo[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value.showSports) return;
    if (sports.length > 0) return;

    fetch('/api/sports/list')
      .then((res) => res.json())
      .then((data) => {
        const list: SportInfo[] = data.sports ?? [];
        setSports(list);
      })
      .catch((error) => console.error('Error fetching sports list:', error));
  }, [value.showSports, sports.length]);

  const { mainPool, forced } = applyPlacementOverrides(sports);

  // Fits as many pills as possible on one line, pushing the rest into a "More" dropdown.
  useLayoutEffect(() => {
    if (mainPool.length === 0) return;

    const recompute = () => {
      const container = containerRef.current;
      const measure = measureRef.current;
      if (!container || !measure) return;

      const containerWidth = container.offsetWidth;
      const pillEls = Array.from(measure.children) as HTMLElement[];

      let used = 0;
      let count = 0;
      for (let i = 0; i < pillEls.length; i++) {
        const width = pillEls[i].offsetWidth + (count > 0 ? PILL_GAP_PX : 0);
        const isLast = i === pillEls.length - 1;
        const reserve = isLast ? 0 : MORE_BUTTON_RESERVE_PX;
        if (used + width > containerWidth - reserve) break;
        used += width;
        count++;
      }
      setVisibleCount(count);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sports]);

  useEffect(() => {
    if (!moreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreOpen]);

  if (!value.showSports || sports.length === 0) return null;

  const selectedSport = value.selectedSports[0];

  // Sport selection is single-select: picking a sport replaces any previous pick,
  // and picking the already-active sport clears it back to "All".
  const selectSport = (name: string) => {
    onChange({ ...value, selectedSports: selectedSport === name ? [] : [name] });
    setMoreOpen(false);
  };

  const visibleSports = mainPool.slice(0, visibleCount || mainPool.length);
  const overflowSports = [...mainPool.slice(visibleCount || mainPool.length), ...forced];
  const selectedInOverflow = overflowSports.find((s) => s.name === selectedSport);

  return (
    <div ref={wrapperRef} className='relative w-full max-w-3xl mx-auto mb-6'>
      <div ref={containerRef} className='flex items-center flex-nowrap gap-2'>
        {visibleSports.map((sport) => (
          <Pill key={sport.name} active={selectedSport === sport.name} onClick={() => selectSport(sport.name)}>
            {sport.displayName}
          </Pill>
        ))}

        {overflowSports.length > 0 && (
          <div className='relative shrink-0'>
            <button
              type='button'
              onClick={() => setMoreOpen((open) => !open)}
              className={cn(
                'flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap',
                selectedInOverflow
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
              )}
            >
              More
              <ChevronDown size={14} className={cn('transition-transform', moreOpen && 'rotate-180')} />
            </button>

            {moreOpen && (
              <div className='absolute right-0 z-20 mt-2 min-w-[10rem] max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1'>
                {overflowSports.map((sport) => (
                  <button
                    key={sport.name}
                    type='button'
                    onClick={() => selectSport(sport.name)}
                    className={cn(
                      'block w-full text-left px-4 py-2 text-sm whitespace-nowrap',
                      selectedSport === sport.name
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                    )}
                  >
                    {sport.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden measuring row: same pills, used only to compute how many fit on one line.
          Clipped to the component's own width so it can never widen the page. */}
      <div
        aria-hidden
        className='absolute top-0 left-0 w-full h-0 overflow-hidden invisible pointer-events-none -z-10'
      >
        <div ref={measureRef} className='flex items-center gap-2' style={{ whiteSpace: 'nowrap' }}>
          {mainPool.map((sport) => (
            <Pill key={sport.name} active={false} onClick={() => {}}>
              {sport.displayName}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}
