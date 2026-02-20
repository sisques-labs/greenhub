import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesViewModelScientificNameRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesViewModel scientificName is required');
	}
}
