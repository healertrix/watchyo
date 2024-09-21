import { Card } from './glicko';

interface PairingHistory {
  [key: number]: Set<number>;
}

export function calculateSonnebornBerger(player: Card, allPlayers: Card[]): number {
  return allPlayers.reduce((score, opponent) => {
    if (player.id === opponent.id) return score;
    const playerWon = player.glickoRating > opponent.glickoRating;
    return score + (playerWon ? opponent.glickoRating : opponent.glickoRating / 2);
  }, 0);
}

export function swissPairing(cards: Card[], round: number, pairingHistory: PairingHistory): [Card, Card][] {
  const sortedCards = [...cards].sort((a, b) => 
    b.glickoRating - a.glickoRating || b.sonnebornBerger - a.sonnebornBerger
  );
  const pairs: [Card, Card][] = [];
  const paired = new Set<number>();

  for (let i = 0; i < sortedCards.length - 1; i++) {
    if (paired.has(sortedCards[i].id)) continue;

    for (let j = i + 1; j < sortedCards.length; j++) {
      if (paired.has(sortedCards[j].id)) continue;

      // Check if they have already been paired in previous rounds
      if (!pairingHistory[sortedCards[i].id]?.has(sortedCards[j].id) || round === 0) {
        pairs.push([sortedCards[i], sortedCards[j]]);
        paired.add(sortedCards[i].id);
        paired.add(sortedCards[j].id);

        // Update pairing history
        if (!pairingHistory[sortedCards[i].id]) pairingHistory[sortedCards[i].id] = new Set();
        if (!pairingHistory[sortedCards[j].id]) pairingHistory[sortedCards[j].id] = new Set();
        pairingHistory[sortedCards[i].id].add(sortedCards[j].id);
        pairingHistory[sortedCards[j].id].add(sortedCards[i].id);

        break; // Move to the next player after pairing
      }
    }
  }

  return pairs;
}

export function getNextPair(cards: Card[], currentRound: number, pairingHistory: PairingHistory): [Card, Card] | null {
  const pairs = swissPairing(cards, currentRound, pairingHistory);
  return pairs[0] || null;
}

export function getTotalRounds(cardCount: number): number {
  return cardCount - 1;
}
