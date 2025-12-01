import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...clases: ClassValue[]): string {
  // Une clases condicionales y resuelve conflictos de Tailwind de forma segura.
  return twMerge(clsx(...clases));
}
