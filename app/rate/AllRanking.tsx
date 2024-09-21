'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  InitialCard,
  calculateNewRatings,
  initializeCards,
  validateCards,
} from '../lib/glicko';
import { getNextPair, getTotalRounds, calculateSonnebornBerger } from '../lib/swiss';
import { SelectRestaurant } from '@/db/schema';
import RestaurantCard from '@/components/mycomponents/ResturantCard';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy } from 'lucide-react';
import { FinalRankings } from '@/components/mycomponents/RankingComponents';

interface GlobalRankingProps {
  initialRestaurants: SelectRestaurant[];
}

export default function AllRanking({ initialRestaurants }: GlobalRankingProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPair, setCurrentPair] = useState<[Card, Card] | null>(null);
  const [winner, setWinner] = useState<Card | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [isRankingComplete, setIsRankingComplete] = useState(false);
  const [pairingHistory, setPairingHistory] = useState<{
    [key: number]: Set<number>;
  }>({});
  const [roundResults, setRoundResults] = useState<Array<{winner: number, loser: number}>>([]);

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
    setTotalRounds(getTotalRounds(initializedCards.length));
    const firstPair = getNextPair(initializedCards, 0, {});
    setCurrentPair(firstPair);
    if (!firstPair) {
      setIsRankingComplete(true);
    }
  }, [initialRestaurants]);

  function handleCardClick(selectedCard: Card) {
    setWinner(selectedCard);
    setTimeout(() => {
      const winner = selectedCard;
      const loser = currentPair!.find((c) => c.id !== winner.id)!;

      setRoundResults(prev => [...prev, {winner: winner.id, loser: loser.id}]);

      setCurrentRound((prevRound) => {
        const newRound = prevRound + 1;
        if (newRound >= totalRounds) {
          updateGlickoRatings();
          setIsRankingComplete(true);
          return newRound;
        }

        setPairingHistory((prev) => {
          const newHistory = { ...prev };
          if (!newHistory[winner.id]) newHistory[winner.id] = new Set();
          if (!newHistory[loser.id]) newHistory[loser.id] = new Set();
          newHistory[winner.id].add(loser.id);
          newHistory[loser.id].add(winner.id);
          return newHistory;
        });

        setCards((prevCards) => {
          const nextPair = getNextPair(prevCards, newRound, pairingHistory);
          if (nextPair) {
            setCurrentPair(nextPair);
          } else {
            updateGlickoRatings();
            setIsRankingComplete(true);
          }
          return prevCards;
        });

        return newRound;
      });

      setWinner(null);
    }, 1000);
  }

  function updateGlickoRatings() {
    setCards((prevCards) => {
      let updatedCards = [...prevCards];
      for (const result of roundResults) {
        const winner = updatedCards.find(c => c.id === result.winner)!;
        const loser = updatedCards.find(c => c.id === result.loser)!;
        const [newWinner, newLoser] = calculateNewRatings(winner, loser);
        updatedCards = updatedCards.map(card => 
          card.id === newWinner.id ? newWinner : 
          card.id === newLoser.id ? newLoser : card
        );
      }

      const cardsWithSB = updatedCards.map(card => ({
        ...card,
        sonnebornBerger: calculateSonnebornBerger(card, updatedCards, roundResults)
      }));

      return validateCards(cardsWithSB);
    });
    setRoundResults([]);
  }

  function handleStop() {
    setIsRankingComplete(true);
  }

  if (isRankingComplete) {
    const sortedCards = cards.sort((a, b) => b.glickoRating - a.glickoRating);
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
                showGlicko={true}
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
            Round: {currentRound + 1} / {totalRounds}
          </p>
        </div>
        <button
          onClick={handleStop}
          className='mt-4 px-4 py-2 bg-white text-black rounded hover:bg-red-600 transition-colors'
        >
          Stop Ranking
        </button>
      </div>
    </div>
  );
}
