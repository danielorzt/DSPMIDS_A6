import type { ArtKind } from '../components/Illustration';
import { tones } from '../theme/theme';

export type Category = {
  id: string;
  title: string;
  subtitle: string;
  art: ArtKind;
  tone: string;
};

// Solo se nombran compañías en preguntas factuales: sin logos, personajes ni arte con copyright.
export const CATEGORIES: Category[] = [
  { id: 'nintendo', title: 'Nintendo', subtitle: 'Consolas y portátiles', art: 'hybrid', tone: tones.terracotta },
  { id: 'playstation', title: 'PlayStation', subtitle: 'La era Sony', art: 'controller', tone: tones.ultramarine },
  { id: 'xbox', title: 'Xbox', subtitle: 'El universo Microsoft', art: 'sensor', tone: tones.moss },
  { id: 'sega', title: 'Sega', subtitle: 'Velocidad y nostalgia', art: 'spikes', tone: tones.teal },
  { id: 'retro', title: 'Retro y Arcade', subtitle: 'Los clásicos de siempre', art: 'pong', tone: tones.ochre },
  { id: 'general', title: 'Cultura Gamer', subtitle: 'Términos y curiosidades', art: 'bubble', tone: tones.plum },
];

export const MIX: Category = {
  id: 'mix',
  title: 'Modo mezcla',
  subtitle: '10 preguntas de todas las categorías',
  art: 'sparkle',
  tone: tones.ochre,
};

export const getCategory = (id: string): Category =>
  id === MIX.id ? MIX : CATEGORIES.find((c) => c.id === id) ?? MIX;
