import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateTemperatureRangeRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate temperatureRange is required');
	}
}
