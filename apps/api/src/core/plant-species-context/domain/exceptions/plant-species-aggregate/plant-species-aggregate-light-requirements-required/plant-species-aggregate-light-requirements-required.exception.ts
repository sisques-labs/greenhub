import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateLightRequirementsRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate lightRequirements is required');
	}
}
