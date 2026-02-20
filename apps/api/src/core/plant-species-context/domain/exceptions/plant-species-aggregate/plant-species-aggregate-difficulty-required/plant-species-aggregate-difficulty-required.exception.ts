import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateDifficultyRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate difficulty is required');
	}
}
