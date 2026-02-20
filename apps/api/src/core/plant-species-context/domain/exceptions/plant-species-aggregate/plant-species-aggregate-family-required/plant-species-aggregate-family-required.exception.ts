import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateFamilyRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate family is required');
	}
}
