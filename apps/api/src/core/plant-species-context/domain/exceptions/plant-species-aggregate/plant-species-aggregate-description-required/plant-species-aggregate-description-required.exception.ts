import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateDescriptionRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate description is required');
	}
}
