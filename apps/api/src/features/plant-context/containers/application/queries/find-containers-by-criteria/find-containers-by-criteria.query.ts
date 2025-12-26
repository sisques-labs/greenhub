import { Criteria } from '@/shared/domain/entities/criteria';

/**
 * Query for finding containers by criteria.
 *
 * @remarks
 * This query encapsulates the criteria needed to search and filter containers.
 */
export class FindContainersByCriteriaQuery {
  constructor(public readonly criteria: Criteria) {}
}
