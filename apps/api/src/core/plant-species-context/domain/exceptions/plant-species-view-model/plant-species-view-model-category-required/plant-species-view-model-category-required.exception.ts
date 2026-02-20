import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesViewModelCategoryRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesViewModel category is required');
	}
}
