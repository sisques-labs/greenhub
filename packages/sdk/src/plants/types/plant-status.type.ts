export type PlantStatus =
  | 'PLANTED'
  | 'GROWING'
  | 'HARVESTED'
  | 'DEAD'
  | 'ARCHIVED';

/**
 * Plant status constants for type-safe usage
 */
export const PLANT_STATUS = {
  PLANTED: 'PLANTED' as const,
  GROWING: 'GROWING' as const,
  HARVESTED: 'HARVESTED' as const,
  DEAD: 'DEAD' as const,
  ARCHIVED: 'ARCHIVED' as const,
} as const;
