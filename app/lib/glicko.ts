import { z } from 'zod';

// Glicko-2 constants
const TAU = 0.5;
const INITIAL_RD = 350;
const INITIAL_VOLATILITY = 0.06;
const INITIAL_RATING = 1500;

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
  glickoRating: z.number().default(INITIAL_RATING),
  rd: z.number().default(INITIAL_RD),
  volatility: z.number().default(INITIAL_VOLATILITY),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer the Card type from the schema
export type Card = z.infer<typeof CardSchema>;

// Schema for initializing cards without Glicko rating and timestamps
const InitialCardSchema = CardSchema.omit({
  glickoRating: true,
  rd: true,
  volatility: true,
  createdAt: true,
  updatedAt: true,
});
export type InitialCard = z.infer<typeof InitialCardSchema>;

function g(rd: number): number {
  return 1 / Math.sqrt(1 + 3 * Math.pow(rd / Math.PI, 2));
}

function E(rating: number, opponentRating: number, opponentRD: number): number {
  return 1 / (1 + Math.exp((-g(opponentRD) * (rating - opponentRating)) / 400));
}

export function calculateNewRatings(winner: Card, loser: Card): [Card, Card] {
  const winnerRating = winner.glickoRating;
  const winnerRD = winner.rd;
  const winnerVol = winner.volatility;

  const loserRating = loser.glickoRating;
  const loserRD = loser.rd;
  const loserVol = loser.volatility;

  // Calculate new ratings for winner
  const winnerE = E(winnerRating, loserRating, loserRD);
  const winnerV = Math.pow(g(loserRD), 2) * winnerE * (1 - winnerE);
  const winnerDelta = winnerV * (1 - winnerE);

  const newWinnerVol = calculateNewVolatility(
    winnerRating,
    winnerRD,
    winnerVol,
    winnerDelta,
    winnerV
  );
  const newWinnerRD = Math.sqrt(
    Math.pow(winnerRD, 2) + Math.pow(newWinnerVol, 2)
  );
  const newWinnerRating =
    winnerRating + Math.pow(newWinnerRD, 2) * g(loserRD) * (1 - winnerE);

  // Calculate new ratings for loser
  const loserE = E(loserRating, winnerRating, winnerRD);
  const loserV = Math.pow(g(winnerRD), 2) * loserE * (1 - loserE);
  const loserDelta = loserV * (0 - loserE);

  const newLoserVol = calculateNewVolatility(
    loserRating,
    loserRD,
    loserVol,
    loserDelta,
    loserV
  );
  const newLoserRD = Math.sqrt(Math.pow(loserRD, 2) + Math.pow(newLoserVol, 2));
  const newLoserRating =
    loserRating + Math.pow(newLoserRD, 2) * g(winnerRD) * (0 - loserE);

  return [
    {
      ...winner,
      glickoRating: newWinnerRating,
      rd: newWinnerRD,
      volatility: newWinnerVol,
    },
    {
      ...loser,
      glickoRating: newLoserRating,
      rd: newLoserRD,
      volatility: newLoserVol,
    },
  ];
}

function calculateNewVolatility(
  rating: number,
  rd: number,
  vol: number,
  delta: number,
  v: number
): number {
  const a = Math.log(vol * vol);
  const deltaSq = delta * delta;
  const rdSq = rd * rd;
  let A = a;
  let B: number;

  if (deltaSq > rdSq + v) {
    B = Math.log(deltaSq - rdSq - v);
  } else {
    let k = 1;
    while (f(a - k * TAU, delta, rdSq, v, a) < 0) {
      k *= 2; // Exponential search
    }
    B = a - k * TAU;
  }

  // Use a tolerance based on the magnitude of A and B
  const tolerance = 1e-6 * Math.min(Math.abs(A), Math.abs(B));

  while (Math.abs(B - A) > tolerance) {
    const C = (A + B) / 2;
    const fC = f(C, delta, rdSq, v, a);
    if (fC * f(A, delta, rdSq, v, a) < 0) {
      B = C;
    } else {
      A = C;
    }
  }

  return Math.exp((A + B) / 4);
}

function f(
  x: number,
  delta: number,
  rdSq: number,
  v: number,
  a: number
): number {
  const expX = Math.exp(x);
  return (
    (expX * (delta * delta - rdSq - v - expX)) /
      (2 * Math.pow(rdSq + v + expX, 2)) -
    (x - a) / (TAU * TAU)
  );
}

export function initializeCards(cards: InitialCard[]): Card[] {
  return cards.map((card) => ({
    ...card,
    glickoRating: INITIAL_RATING,
    rd: INITIAL_RD,
    volatility: INITIAL_VOLATILITY,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export function validateCards(cards: unknown): Card[] {
  const result = z.array(CardSchema).safeParse(cards);
  if (!result.success) {
    throw new Error(`Invalid card data: ${result.error}`);
  }
  return result.data;
}

export function getRandomPair(cards: Card[]): [Card, Card] {
  if (cards.length < 2) {
    throw new Error('Not enough cards to form a pair');
  }

  const firstIndex = Math.floor(Math.random() * cards.length);
  let secondIndex;
  do {
    secondIndex = Math.floor(Math.random() * cards.length);
  } while (secondIndex === firstIndex);

  return [cards[firstIndex], cards[secondIndex]];
}
// ... rest of the file
