import * as SQLite from 'expo-sqlite';

import { isBetter, type BestScore } from './scoreTypes';

export type { BestScore };

// SQLite guarda las mejores puntuaciones. Si no está disponible (p. ej. web sin soporte)
// se usa un mapa en memoria para que la app siga funcionando.
const memory = new Map<string, BestScore>();
let dbPromise: Promise<SQLite.SQLiteDatabase | null> | null = null;

function getDb() {
  dbPromise ??= (async () => {
    try {
      const db = await SQLite.openDatabaseAsync('trivia.db');
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS best_scores (
           category TEXT PRIMARY KEY NOT NULL,
           correct INTEGER NOT NULL,
           total INTEGER NOT NULL
         );`,
      );
      return db;
    } catch {
      return null;
    }
  })();
  return dbPromise;
}

export async function getBestScores(): Promise<Record<string, BestScore>> {
  const db = await getDb();
  if (!db) return Object.fromEntries(memory);
  try {
    const rows = await db.getAllAsync<{ category: string; correct: number; total: number }>(
      'SELECT category, correct, total FROM best_scores',
    );
    return Object.fromEntries(rows.map((r) => [r.category, { correct: r.correct, total: r.total }]));
  } catch {
    return Object.fromEntries(memory);
  }
}

/** Guarda el resultado si mejora el récord. Devuelve true si es un nuevo récord. */
export async function saveScore(category: string, score: BestScore): Promise<boolean> {
  const current = (await getBestScores())[category];
  if (!isBetter(score, current)) return false;

  memory.set(category, score);
  const db = await getDb();
  if (db) {
    try {
      await db.runAsync(
        'INSERT OR REPLACE INTO best_scores (category, correct, total) VALUES (?, ?, ?)',
        category,
        score.correct,
        score.total,
      );
    } catch {
      /* el récord queda en memoria */
    }
  }
  return true;
}
