import { isBetter, type BestScore } from './scoreTypes';

export type { BestScore };

// En web no se usa SQLite: los récords se guardan en localStorage (o en memoria si no está disponible).
const KEY = 'pixelquest:best-scores';
let cache: Record<string, BestScore> = {};

export async function getBestScores(): Promise<Record<string, BestScore>> {
  try {
    cache = { ...cache, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
  } catch {
    /* sin almacenamiento: se usa la memoria */
  }
  return cache;
}

export async function saveScore(category: string, score: BestScore): Promise<boolean> {
  const current = (await getBestScores())[category];
  if (!isBetter(score, current)) return false;
  cache = { ...cache, [category]: score };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* ignorado */
  }
  return true;
}
