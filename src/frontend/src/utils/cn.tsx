import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes and resolves conflicts.
 * Example: cn('p-4 text-red-500', 'p-2') -> 'p-2 text-red-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
