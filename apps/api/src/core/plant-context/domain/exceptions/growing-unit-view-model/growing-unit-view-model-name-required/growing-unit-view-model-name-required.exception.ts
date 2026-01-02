import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class GrowingUnitViewModelNameRequiredException extends BaseDomainException {
	constructor() {
		super('Growing unit name is required to build GrowingUnitViewModel');
	}
}

