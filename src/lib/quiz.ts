import { QUESTIONS, type Question } from '../data/questions';
import { MIX } from '../data/categories';

export const QUESTIONS_PER_QUIZ = 8;
export const MIX_QUESTIONS = 10;
export const SECONDS_PER_QUESTION = 20;

export type PlayableQuestion = Omit<Question, 'options'> & {
  options: string[];
  correctIndex: number;
};

function shuffle<T>(list: readonly T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildQuiz(categoryId: string): PlayableQuestion[] {
  const isMix = categoryId === MIX.id;
  const pool = isMix ? QUESTIONS : QUESTIONS.filter((q) => q.category === categoryId);
  const amount = isMix ? MIX_QUESTIONS : QUESTIONS_PER_QUIZ;

  return shuffle(pool)
    .slice(0, amount)
    .map((q) => {
      const correct = q.options[0];
      const options = shuffle(q.options);
      return { ...q, options, correctIndex: options.indexOf(correct) };
    });
}

export function getRank(accuracy: number) {
  if (accuracy === 100) return { title: 'Leyenda gamer', message: 'Puntuación perfecta. Dominas el tema.' };
  if (accuracy >= 75) return { title: 'Jugador élite', message: 'Gran partida: sabes mucho de videojuegos.' };
  if (accuracy >= 50) return { title: 'Aventurero', message: 'Buen camino. Una ronda más y lo logras.' };
  return { title: 'Novato con potencial', message: 'Todos empezamos así. Repasa abajo y vuelve a intentarlo.' };
}
