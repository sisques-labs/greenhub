/**
 * Data Transfer Object for calculating average via command layer.
 *
 * @interface ICalculateAverageCommandDto
 * @property {number[]} values - Array of numbers to calculate the average from
 * @property {number} [decimals] - Number of decimal places (default: 2)
 */
export interface ICalculateAverageCommandDto {
  values: number[];
  decimals?: number;
}
