import { Criteria } from "@/shared/domain/entities/criteria";

/**
 * @class FindGrowingUnitsByCriteriaQuery
 * @description
 * Represents a query object used to find growing units that match specific search and filter criteria.
 *
 * @public
 */
export class GrowingUnitFindByCriteriaQuery {
	/**
	 * The criteria used for searching and filtering growing units.
	 */
	public readonly criteria: Criteria;

	/**
	 * Constructs a new {@link FindGrowingUnitsByCriteriaQuery} instance.
	 *
	 * @param criteria - The criteria to use for finding growing units.
	 */
	constructor(criteria: Criteria) {
		this.criteria = criteria;
	}
}
