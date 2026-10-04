export type BestScore = { correct: number; total: number };

export const isBetter = (next: BestScore, current?: BestScore) =>
  !current || next.correct / next.total > current.correct / current.total;
