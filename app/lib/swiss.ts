import { Card } from './glicko';

interface PairingHistory {
  [key: number]: Set<number>;
}

export function swissPairing(cards: Card[], round: number, pairingHistory: PairingHistory): [Card, Card][] {
  // Sort cards by Glicko rating in descending order
  const sortedCards = [...cards].sort((a, b) => b.glickoRating - a.glickoRating);
  const pairs: [Card, Card][] = [];
  const paired = new Set<number>();

  // Increase the number of pairing attempts
  const maxPairingsPerRound = Math.floor(cards.length / 2) * 2;

  for (let pairingAttempt = 0; pairingAttempt < maxPairingsPerRound; pairingAttempt++) {
    for (let i = 0; i < sortedCards.length; i++) {
      if (paired.has(sortedCards[i].id)) continue;

      for (let j = i + 1; j < sortedCards.length; j++) {
        if (paired.has(sortedCards[j].id)) continue;

        // Check if these cards have been paired before in this round
        if (!pairingHistory[sortedCards[i].id]?.has(sortedCards[j].id)) {
          pairs.push([sortedCards[i], sortedCards[j]]);
          paired.add(sortedCards[i].id);
          paired.add(sortedCards[j].id);

          // Update pairing history
          if (!pairingHistory[sortedCards[i].id]) pairingHistory[sortedCards[i].id] = new Set();
          if (!pairingHistory[sortedCards[j].id]) pairingHistory[sortedCards[j].id] = new Set();
          pairingHistory[sortedCards[i].id].add(sortedCards[j].id);
          pairingHistory[sortedCards[j].id].add(sortedCards[i].id);

          break;
        }
      }
    }

    // If all cards have been paired, reset the paired set to allow for more pairings
    if (paired.size === sortedCards.length) {
      paired.clear();
    }
  }

  // Handle odd number of cards or unpaired cards
  const unpaired = sortedCards.filter(card => !paired.has(card.id));
  if (unpaired.length > 0) {
    console.log(`Cards ${unpaired.map(card => card.name).join(', ')} get a bye in round ${round + 1}`);
  }

  return pairs;
}

export function getNextPair(cards: Card[], currentRound: number, pairingHistory: PairingHistory): [Card, Card] | null {
  const pairs = swissPairing(cards, currentRound, pairingHistory);
  return pairs[currentRound % pairs.length] || null;
}

export function getTotalRounds(cardCount: number): number {
  // Increase the number of rounds to get more comparisons
  return Math.max(cardCount - 1, Math.floor(cardCount * 1.5));
}
