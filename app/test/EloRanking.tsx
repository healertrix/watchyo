'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  InitialCard,
  calculateNewRatings,
  initializeCards,
  validateCards,
  getRandomPair,
} from '../lib/elo';
import { SelectRestaurant } from '@/db/schema';
import RestaurantCard from '@/components/mycomponents/ResturantCard';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import { FinalRankings } from '@/components/mycomponents/RankingComponents';

interface EloRankingProps {
  initialRestaurants: SelectRestaurant[];
}

export default function EloRanking({ initialRestaurants }: EloRankingProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPair, setCurrentPair] = useState<[Card, Card] | null>(null);
  const [winner, setWinner] = useState<Card | null>(null);
  const [totalComparisons, setTotalComparisons] = useState(0);
  const [isRankingComplete, setIsRankingComplete] = useState(false);

  useEffect(() => {
    const initialCards: InitialCard[] = initialRestaurants.map(
      (restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        category: restaurant.category,
        rating: restaurant.rating,
        phoneNumber: restaurant.phoneNumber,
        website: restaurant.website,
        fullAddress: restaurant.fullAddress,
        imageLink: restaurant.imageLink,
      })
    );

    const initializedCards = initializeCards(initialCards);
    setCards(initializedCards);
    setCurrentPair(getRandomPair(initializedCards));
    setTotalComparisons(
      (initializedCards.length * (initializedCards.length - 1)) / 2
    );
  }, [initialRestaurants]);

  function handleCardClick(selectedCard: Card) {
    setWinner(selectedCard);
    setTimeout(() => {
      const winner = selectedCard;
      const loser = currentPair!.find((c) => c.id !== winner.id)!;
      const [newWinnerRating, newLoserRating] = calculateNewRatings(
        winner,
        loser
      );

      setCards((prevCards) => {
        const updatedCards = prevCards.map((card) =>
          card.id === winner.id
            ? { ...card, elorating: newWinnerRating }
            : card.id === loser.id
            ? { ...card, elorating: newLoserRating }
            : card
        );
        return validateCards(updatedCards);
      });

      setTotalComparisons((prev) => prev - 1);

      const nextPair = getRandomPair(cards);
      setCurrentPair(nextPair);
      setWinner(null);

      if (!nextPair || totalComparisons <= 1) {
        setIsRankingComplete(true);
      }
    }, 1000);
  }

  function handleStop() {
    setIsRankingComplete(true);
  }

  if (isRankingComplete) {
    const sortedCards = cards.sort((a, b) => b.elorating - a.elorating);
    return <FinalRankings sortedCards={sortedCards} />;
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className='text-2xl font-bold mb-6'>
        Which restaurant do you prefer?
      </h2>
      <div className='flex flex-col md:flex-row items-center justify-center w-full max-w-4xl'>
        {currentPair?.map((card, index) => (
          <motion.div
            key={card.id}
            className='w-full md:w-1/2 p-4'
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div
              className='relative cursor-pointer transform transition-transform hover:scale-105'
              onClick={() => handleCardClick(card)}
            >
              <RestaurantCard 
                restaurant={card} 
                showElo={true} 
                showDetails={true} 
                isComparison={true}
              />
              {winner && winner.id === card.id && (
                <div className='absolute top-2 right-2'>
                  <Trophy className='w-8 h-8 text-yellow-500 fill-current' />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <div className='mt-8 flex flex-col items-center'>
        <div className='flex items-center mb-2'>
          <ArrowRight className='w-6 h-6 mr-2 text-blue-500' />
          <p className='text-lg font-semibold'>
            Comparisons left: {totalComparisons}
          </p>
        </div>
        <button
          onClick={handleStop}
          className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
        >
          Stop Ranking
        </button>
      </div>
    </div>
  );
}
