/**
 * Array of valid growing unit types for form validation
 * Used with Zod schemas for type-safe form validation
 */
export const GROWING_UNIT_TYPE = {
  POT: 'POT',
  GARDEN_BED: 'GARDEN_BED',
  HANGING_BASKET: 'HANGING_BASKET',
  WINDOW_BOX: 'WINDOW_BOX',
} as const;
