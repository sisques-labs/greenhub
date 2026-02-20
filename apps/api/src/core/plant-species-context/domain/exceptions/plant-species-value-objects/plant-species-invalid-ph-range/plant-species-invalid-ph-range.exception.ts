import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class InvalidPlantSpeciesPhRangeException extends BaseDomainException {
	constructor(min: number, max: number) {
		super(
			`pH range must be between 0 and 14, got min: ${min}, max: ${max}`,
		);
	}
}
