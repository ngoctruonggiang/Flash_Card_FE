export interface Sm2Input {
  repetitions?: number;
  interval?: number;
  eFactor?: number;
}

export interface Sm2Previews {
  Again: string;
  Hard: string;
  Good: string;
  Easy: string;
}

export const calculateSm2Intervals = (card: Sm2Input): Sm2Previews => {
  const repetitions = card.repetitions || 0;
  const interval = card.interval || 0;
  const eFactor = card.eFactor || 2.5;

  // Helper to format days
  const formatDays = (days: number) => {
    if (days < 1) return "<1 min"; // Should not happen for days >= 1
    if (days === 1) return "1 ngày";
    return `${Math.round(days)} ngày`;
  };

  // Calculate interval for a given quality
  const calculateInterval = (quality: number): number => {
    if (quality < 3) {
      return 1; // Again
    }

    const nextRep = repetitions + 1;

    if (nextRep === 1) {
      // First review (New card)
      if (quality === 3) return 1; // Hard
      if (quality === 4) return 2; // Good
      if (quality === 5) return 4; // Easy
    }

    if (nextRep === 2) {
      // Second review
      return 6;
    }

    // Repetitions > 2: Differentiate by quality
    if (quality === 3) {
      // Hard: Fixed slow growth
      return Math.round(interval * 1.2);
    } else if (quality === 4) {
      // Good: Standard growth
      return Math.round(interval * eFactor);
    } else if (quality === 5) {
      // Easy: Bonus growth
      return Math.round(interval * eFactor * 1.3);
    }

    return Math.round(interval * eFactor); // Fallback
  };

  return {
    Again: formatDays(calculateInterval(2)),
    Hard: formatDays(calculateInterval(3)),
    Good: formatDays(calculateInterval(4)),
    Easy: formatDays(calculateInterval(5)),
  };
};
