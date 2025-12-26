import { Criteria } from '@/shared/domain/entities/criteria';

/**
 * Query for finding plants by criteria.
 *
 * @remarks
 * This query encapsulates the criteria needed to search and filter plants.
 */
export class FindPlantsByCriteriaQuery {
  constructor(public readonly criteria: Criteria) {}
}
