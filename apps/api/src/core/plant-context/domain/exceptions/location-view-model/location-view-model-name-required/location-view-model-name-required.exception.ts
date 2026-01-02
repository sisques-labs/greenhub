import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class LocationViewModelNameRequiredException extends BaseDomainException {
	constructor() {
		super('Location name is required to build LocationViewModel');
	}
}

