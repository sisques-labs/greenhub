import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Paginates an array of items based on current page and items per page.
 *
 * @param items - The array of items to paginate
 * @param currentPage - The current page number (1-based)
 * @param perPage - The number of items per page
 * @returns An object containing the paginated items, total pages, start index, and end index
 *
 * @example
 * const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * const result = paginate(items, 1, 5);
 * // Returns: { items: [1, 2, 3, 4, 5], totalPages: 2, startIndex: 0, endIndex: 5 }
 */
export function paginate<T>(
  items: T[],
  currentPage: number,
  perPage: number,
): {
  items: T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
} {
  const totalPages = Math.ceil(items.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalPages,
    startIndex,
    endIndex,
  };
}
