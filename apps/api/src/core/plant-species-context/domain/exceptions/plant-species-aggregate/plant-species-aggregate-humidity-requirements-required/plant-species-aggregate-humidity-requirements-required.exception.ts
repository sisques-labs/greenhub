import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateHumidityRequirementsRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate humidityRequirements is required');
	}
}
