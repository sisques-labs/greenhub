/**
 * Data Transfer Object for rounding number via command layer.
 *
 * @interface IRoundNumberCommandDto
 * @property {number} value - The number to round
 * @property {number} [decimals] - Number of decimal places (default: 2)
 */
export interface IRoundNumberCommandDto {
  value: number;
  decimals?: number;
}
