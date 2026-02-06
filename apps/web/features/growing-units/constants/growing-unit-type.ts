/**
 * Growing Unit Type Constants
 * Valid growing unit types for form validation and business logic
 */

export type GrowingUnitType = "POT" | "GARDEN_BED" | "HANGING_BASKET" | "WINDOW_BOX";

export const GROWING_UNIT_TYPE = {
  POT: "POT",
  GARDEN_BED: "GARDEN_BED",
  HANGING_BASKET: "HANGING_BASKET",
  WINDOW_BOX: "WINDOW_BOX",
} as const;
