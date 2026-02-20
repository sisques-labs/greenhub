import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateGrowthRateRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate growthRate is required');
	}
}
