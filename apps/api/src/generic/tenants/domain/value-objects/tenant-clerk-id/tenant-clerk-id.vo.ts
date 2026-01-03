import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * TenantClerkIdValueObject represents a Clerk ID for a tenant in the domain.
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class TenantClerkIdValueObject extends StringValueObject {
	constructor(value: string) {
		super(value, {
			minLength: 1,
			maxLength: 255,
			allowEmpty: false,
		});
	}
}

