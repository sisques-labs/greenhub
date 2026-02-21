import { Criteria } from '@/shared/domain/entities/criteria';

/**
 * Query for finding plant species view models matching the specified criteria.
 */
export class PlantSpeciesFindByCriteriaQuery {
	public readonly criteria: Criteria;

	constructor(criteria: Criteria) {
		this.criteria = criteria;
	}
}
