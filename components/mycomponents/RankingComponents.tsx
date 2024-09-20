import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import RestaurantCard from './ResturantCard';
import { Card } from '@/app/lib/elo';

interface RankingCardProps {
  card: Card;
  index: number;
}

function getMedalColor(index: number): string {
  switch (index) {
    case 0:
      return 'text-yellow-500';
    case 1:
      return 'text-gray-400';
    case 2:
      return 'text-amber-600';
    default:
      return 'hidden';
  }
}

function getEloColor(index: number): string {
  switch (index) {
    case 0:
      return 'text-yellow-500';
    case 1:
      return 'text-gray-400';
    case 2:
      return 'text-amber-600';
    default:
      return 'text-white';
  }
}

export function RankingCard({ card, index }: RankingCardProps) {
  return (
    <motion.div
      className='bg-card rounded-lg shadow-md overflow-hidden h-[200px]'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className='flex items-center h-full'>
        <div className='flex-shrink-0 w-12 flex items-center justify-center h-full bg-blue-500 text-white font-bold text-xl'>
          {index + 1}
        </div>
        <div className='flex-grow relative p-4'>
          <RestaurantCard
            restaurant={card}
            showElo={true}
            eloColor={getEloColor(index)}
            showDetails={false}
          />
          <Trophy
            className={`absolute top-1/4 right-2 w-8 h-8 ${getMedalColor(
              index
            )}`}
            fill={getMedalColor(index)}
            stroke='currentColor'
          />
        </div>
      </div>
    </motion.div>
  );
}

interface FinalRankingsProps {
  sortedCards: Card[];
}

export function FinalRankings({ sortedCards }: FinalRankingsProps) {
  return (
    <div className='flex flex-col items-center justify-start p-4'>
      <Trophy className='w-16 h-16 text-yellow-500 mb-4' />
      <h2 className='text-2xl font-bold mb-6'>Final Rankings</h2>
      <div className='w-full max-w-4xl grid gap-4'>
        {sortedCards.map((card, index) => (
          <RankingCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
}
