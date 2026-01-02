import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantViewModelIdRequiredException extends BaseDomainException {
	constructor() {
		super('Plant id is required to build PlantViewModel');
	}
}
