import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantViewModelSpeciesRequiredException extends BaseDomainException {
	constructor() {
		super('Plant species is required to build PlantViewModel');
	}
}

