import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type Category = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  gradient: [string, string];
};

// Solo se usan nombres de compañías en preguntas factuales: sin logos, personajes ni arte con copyright.
export const CATEGORIES: Category[] = [
  { id: 'nintendo', title: 'Nintendo', subtitle: 'Consolas y portátiles', icon: 'nintendo-switch', gradient: ['#FF5E62', '#FF9966'] },
  { id: 'playstation', title: 'PlayStation', subtitle: 'La era Sony', icon: 'sony-playstation', gradient: ['#4776E6', '#8E54E9'] },
  { id: 'xbox', title: 'Xbox', subtitle: 'El universo Microsoft', icon: 'microsoft-xbox', gradient: ['#11998E', '#38EF7D'] },
  { id: 'sega', title: 'Sega', subtitle: 'Velocidad y nostalgia', icon: 'lightning-bolt', gradient: ['#2193B0', '#6DD5ED'] },
  { id: 'retro', title: 'Retro y Arcade', subtitle: 'Los clásicos de siempre', icon: 'space-invaders', gradient: ['#F7971E', '#FFD200'] },
  { id: 'general', title: 'Cultura Gamer', subtitle: 'Términos y curiosidades', icon: 'head-lightbulb', gradient: ['#DA22FF', '#9733EE'] },
];

export const MIX: Category = {
  id: 'mix',
  title: 'Modo Mezcla',
  subtitle: '10 preguntas de todas las categorías',
  icon: 'star-four-points',
  gradient: ['#F953C6', '#B91D73'],
};

export const getCategory = (id: string): Category =>
  id === MIX.id ? MIX : CATEGORIES.find((c) => c.id === id) ?? MIX;
