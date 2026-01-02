import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class LocationViewModelTypeRequiredException extends BaseDomainException {
	constructor() {
		super('Location type is required to build LocationViewModel');
	}
}

