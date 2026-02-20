import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesAggregateCategoryRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesAggregate category is required');
	}
}
