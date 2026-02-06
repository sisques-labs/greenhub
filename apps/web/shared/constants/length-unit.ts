/**
 * Length Unit Constants
 * Valid length units for form validation and business logic
 * Shared across different contexts (growing units, dimensions, etc.)
 */

export type LengthUnit = "MILLIMETER" | "CENTIMETER" | "METER" | "INCH" | "FOOT";

export const LENGTH_UNIT = {
  MILLIMETER: "MILLIMETER",
  CENTIMETER: "CENTIMETER",
  METER: "METER",
  INCH: "INCH",
  FOOT: "FOOT",
} as const;
