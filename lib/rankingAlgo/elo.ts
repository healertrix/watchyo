import { z } from 'zod';

// ELO calculation constants
const K_FACTOR = 32;
const BASE_RATING = 1000;

// Define the Card schema using Zod
const CardSchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  category: z.string().max(50),
  rating: z.number(),
  phoneNumber: z.string().max(15),
  website: z.string().max(200),
  fullAddress: z.string().max(500),
  imageLink: z.string().max(512),
  elorating: z.number().default(BASE_RATING),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer the Card type from the schema
export type Card = z.infer<typeof CardSchema>;

// Schema for initializing cards without ELO rating and timestamps
const InitialCardSchema = CardSchema.omit({ 
  elorating: true, 
  createdAt: true, 
  updatedAt: true
});
export type InitialCard = z.infer<typeof InitialCardSchema>;

export function calculateNewRatings(winner: Card, loser: Card): [number, number] {
  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loser.elorating - winner.elorating) / 400));
  const expectedScoreLoser = 1 - expectedScoreWinner;

  const newWinnerRating = winner.elorating + K_FACTOR * (1 - expectedScoreWinner);
  const newLoserRating = loser.elorating + K_FACTOR * (0 - expectedScoreLoser);

  return [Math.round(newWinnerRating), Math.round(newLoserRating)];
}

export function initializeCards(cards: InitialCard[]): Card[] {
  return cards.map(card => CardSchema.parse({ 
    ...card, 
    elorating: BASE_RATING,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}

// Validation function for an array of Card objects
export function validateCards(cards: unknown[]): Card[] {
  return z.array(CardSchema).parse(cards);
}

// Function to get a random pair of cards for comparison
export function getRandomPair(cards: Card[]): [Card, Card] {
  const shuffled = [...cards].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}