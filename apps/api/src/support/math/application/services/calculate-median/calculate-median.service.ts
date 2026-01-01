import { Injectable, Logger } from '@nestjs/common';

/**
 * Service for calculating medians.
 *
 * @remarks
 * This service provides methods to calculate the median value
 * from arrays of numbers.
 */
@Injectable()
export class CalculateMedianService {
	private readonly logger = new Logger(CalculateMedianService.name);

	/**
	 * Calculates the median value of an array of numbers.
	 *
	 * @param values - Array of numbers to calculate the median from
	 * @param decimals - Number of decimal places (default: 2)
	 * @returns The median value
	 *
	 * @example
	 * ```typescript
	 * const median = service.execute([10, 20, 30]); // Returns 20.00
	 * const median = service.execute([10, 20, 30, 40]); // Returns 25.00
	 * ```
	 */
	execute(values: number[], decimals: number = 2): number {
		this.logger.debug(
			`Calculating median of ${values.length} values with ${decimals} decimals`,
		);

		if (values.length === 0) {
			this.logger.warn('Empty array provided, returning 0');
			return 0;
		}

		const sortedValues = [...values].sort((a, b) => a - b);
		const middleIndex = Math.floor(sortedValues.length / 2);

		let median: number;
		if (sortedValues.length % 2 === 0) {
			// Even number of values: average of two middle values
			median = (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
		} else {
			// Odd number of values: middle value
			median = sortedValues[middleIndex];
		}

		return Number(median.toFixed(decimals));
	}
}

