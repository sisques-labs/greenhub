import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * UserClerkUserIdValueObject represents a Clerk user ID in the domain.
 * It extends the StringValueObject to leverage common string functionalities.
 */
export class UserClerkUserIdValueObject extends StringValueObject {
	constructor(value: string) {
		super(value, {
			minLength: 1,
			maxLength: 255,
			allowEmpty: false,
		});
	}
}
