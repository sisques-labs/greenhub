import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateMatureSizeRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate matureSize is required');
	}
}
