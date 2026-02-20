import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateCommonNameRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate commonName is required');
	}
}
