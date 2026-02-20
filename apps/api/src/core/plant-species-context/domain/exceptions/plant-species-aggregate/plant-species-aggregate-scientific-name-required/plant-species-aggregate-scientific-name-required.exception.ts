import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateScientificNameRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate scientificName is required');
	}
}
