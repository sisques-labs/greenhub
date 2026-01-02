import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantViewModelNameRequiredException extends BaseDomainException {
	constructor() {
		super('Plant name is required to build PlantViewModel');
	}
}

