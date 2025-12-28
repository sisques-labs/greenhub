export type ContainerType =
  | 'POT'
  | 'GARDEN_BED'
  | 'HANGING_BASKET'
  | 'WINDOW_BOX';

/**
 * Container type constants for type-safe usage
 */
export const CONTAINER_TYPE = {
  POT: 'POT' as const,
  GARDEN_BED: 'GARDEN_BED' as const,
  HANGING_BASKET: 'HANGING_BASKET' as const,
  WINDOW_BOX: 'WINDOW_BOX' as const,
} as const;
