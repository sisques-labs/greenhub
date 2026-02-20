import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateSoilTypeRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate soilType is required');
	}
}
