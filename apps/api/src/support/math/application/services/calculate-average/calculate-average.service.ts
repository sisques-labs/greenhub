import { Injectable, Logger } from '@nestjs/common';

/**
 * Service for calculating averages.
 *
 * @remarks
 * This service provides methods to calculate various types of averages
 * from arrays of numbers.
 */
@Injectable()
export class CalculateAverageService {
  private readonly logger = new Logger(CalculateAverageService.name);

  /**
   * Calculates the arithmetic mean (average) of an array of numbers.
   *
   * @param values - Array of numbers to calculate the average from
   * @param decimals - Number of decimal places (default: 2)
   * @returns The average value
   *
   * @example
   * ```typescript
   * const average = service.execute([10, 20, 30]); // Returns 20.00
   * ```
   */
  execute(values: number[], decimals: number = 2): number {
    this.logger.debug(
      `Calculating average of ${values.length} values with ${decimals} decimals`,
    );

    if (values.length === 0) {
      this.logger.warn('Empty array provided, returning 0');
      return 0;
    }

    const sum = values.reduce((acc, value) => acc + value, 0);
    const average = sum / values.length;
    return Number(average.toFixed(decimals));
  }
}
