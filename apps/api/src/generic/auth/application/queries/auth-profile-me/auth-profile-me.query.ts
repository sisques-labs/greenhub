import { IAuthProfileMeQueryDto } from '@/generic/auth/application/dtos/queries/auth-profile-me/auth-profile-me-query.dto';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

export class AuthProfileMeQuery {
	readonly userId: UserUuidValueObject;
	readonly clerkUserId: StringValueObject;

	constructor(props: IAuthProfileMeQueryDto) {
		this.userId = new UserUuidValueObject(props.userId);
		this.clerkUserId = new StringValueObject(props.clerkUserId, {
			minLength: 1,
			maxLength: 255,
			allowEmpty: false,
		});
	}
}
