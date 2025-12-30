/**
 * Array of valid length units for form validation
 * Used with Zod schemas for type-safe form validation
 * This is a shared enum as it's used across different contexts
 */
export const LENGTH_UNIT = {
  MILLIMETER: 'MILLIMETER',
  CENTIMETER: 'CENTIMETER',
  METER: 'METER',
  INCH: 'INCH',
  FOOT: 'FOOT',
} as const;
