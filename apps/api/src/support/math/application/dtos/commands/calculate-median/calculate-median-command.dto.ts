/**
 * Data Transfer Object for calculating median via command layer.
 *
 * @interface ICalculateMedianCommandDto
 * @property {number[]} values - Array of numbers to calculate the median from
 * @property {number} [decimals] - Number of decimal places (default: 2)
 */
export interface ICalculateMedianCommandDto {
	values: number[];
	decimals?: number;
}

