export type ReviewItem = { text: string; correct: string; chosen: string | null; ok: boolean };
export type LastResult = { category: string; items: ReviewItem[]; bestStreak: number };

// Resultado de la última partida: pasa de la pantalla de quiz a la de resultados sin serializarlo en la ruta.
let last: LastResult | null = null;
export const setLastResult = (r: LastResult) => {
  last = r;
};
export const getLastResult = () => last;
