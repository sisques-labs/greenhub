import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class InvalidNumericRangeException extends BaseDomainException {
	public readonly domain: string = 'ValueObject';

	constructor(min: number, max: number) {
		super(`Range min (${min}) cannot be greater than max (${max})`);
	}
}
