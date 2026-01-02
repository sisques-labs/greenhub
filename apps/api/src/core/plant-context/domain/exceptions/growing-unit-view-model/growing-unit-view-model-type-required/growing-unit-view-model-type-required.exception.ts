import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class GrowingUnitViewModelTypeRequiredException extends BaseDomainException {
	constructor() {
		super('Growing unit type is required to build GrowingUnitViewModel');
	}
}

