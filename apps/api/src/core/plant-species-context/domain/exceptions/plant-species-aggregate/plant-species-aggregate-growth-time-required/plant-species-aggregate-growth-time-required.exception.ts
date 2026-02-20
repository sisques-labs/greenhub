import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateGrowthTimeRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate growthTime is required');
	}
}
