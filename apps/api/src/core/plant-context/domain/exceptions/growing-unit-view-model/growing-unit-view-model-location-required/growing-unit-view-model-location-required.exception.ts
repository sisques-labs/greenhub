import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class GrowingUnitViewModelLocationRequiredException extends BaseDomainException {
	constructor() {
		super('Growing unit location is required to build GrowingUnitViewModel');
	}
}

