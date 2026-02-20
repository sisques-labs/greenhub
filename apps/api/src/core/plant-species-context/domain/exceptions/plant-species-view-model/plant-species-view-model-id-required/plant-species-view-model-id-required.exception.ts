import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesViewModelIdRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesViewModel id is required');
	}
}
