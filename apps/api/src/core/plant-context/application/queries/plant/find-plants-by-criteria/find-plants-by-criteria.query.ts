import { Criteria } from '@/shared/domain/entities/criteria';

/**
 * Query for finding plants by criteria.
 *
 * @remarks
 * This query encapsulates the criteria used for searching and filtering plants.
 */
export class FindPlantsByCriteriaQuery {
	/**
	 * The criteria used for searching and filtering plants.
	 */
	public readonly criteria: Criteria;

	/**
	 * Constructs a new FindPlantsByCriteriaQuery instance.
	 *
	 * @param criteria - The criteria to use for finding plants.
	 */
	constructor(criteria: Criteria) {
		this.criteria = criteria;
	}
}

