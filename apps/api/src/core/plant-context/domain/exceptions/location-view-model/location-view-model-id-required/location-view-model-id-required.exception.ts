import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class LocationViewModelIdRequiredException extends BaseDomainException {
	constructor() {
		super('Location id is required to build LocationViewModel');
	}
}

