import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateWaterRequirementsRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate waterRequirements is required');
	}
}
