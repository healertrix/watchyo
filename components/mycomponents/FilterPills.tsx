'use client';

import { useEffect, useState } from 'react';
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

// Movies/TV and Sports are mutually exclusive modes: turning one group on turns the other off.
export default function FilterPills({ value, onChange }: FilterPillsProps) {
  const toggleContent = (key: 'showMovies' | 'showTvSeries') => {
    onChange({ ...value, [key]: !value[key], showSports: false });
  };

  const toggleSports = () => {
    const next = !value.showSports;
    onChange({
      ...value,
      showSports: next,
      showMovies: next ? false : value.showMovies,
      showTvSeries: next ? false : value.showTvSeries,
    });
  };

  return (
    <div className='flex flex-wrap items-center justify-center gap-2 mb-4'>
      <Pill active={value.showMovies} onClick={() => toggleContent('showMovies')}>
        Movies
      </Pill>
      <Pill active={value.showTvSeries} onClick={() => toggleContent('showTvSeries')}>
        TV Series
      </Pill>
      <Pill active={value.showSports} onClick={toggleSports}>
        Sports
      </Pill>
    </div>
  );
}

export function SportsFilterPills({ value, onChange }: FilterPillsProps) {
  const [sports, setSports] = useState<SportInfo[]>([]);

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

  if (!value.showSports || sports.length === 0) return null;

  const toggleSport = (name: string) => {
    const selected = value.selectedSports.includes(name)
      ? value.selectedSports.filter((s) => s !== name)
      : [...value.selectedSports, name];
    onChange({ ...value, selectedSports: selected });
  };

  return (
    <div className='flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-6'>
      {sports.map((sport) => (
        <Pill
          key={sport.name}
          active={value.selectedSports.includes(sport.name)}
          onClick={() => toggleSport(sport.name)}
        >
          {sport.displayName}
        </Pill>
      ))}
    </div>
  );
}
