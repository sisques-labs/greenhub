import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesViewModelCommonNameRequiredException extends BaseDomainException {
	constructor() {
		super('PlantSpeciesViewModel commonName is required');
	}
}
