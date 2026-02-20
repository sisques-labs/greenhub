import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregatePhRangeRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate phRange is required');
	}
}
