import { Criteria } from '@/shared/domain/entities/criteria';

/**
 * Represents a query object used to find locations that match specific search and filter criteria.
 */
export class LocationFindByCriteriaQuery {
	/**
	 * The criteria used for searching and filtering locations.
	 */
	public readonly criteria: Criteria;

	/**
	 * Constructs a new {@link LocationFindByCriteriaQuery} instance.
	 *
	 * @param criteria - The criteria to use for finding locations.
	 */
	constructor(criteria: Criteria) {
		this.criteria = criteria;
	}
}

