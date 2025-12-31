import { IAuthProfileMeQueryDto } from '@/generic/auth/application/dtos/queries/auth-profile-me/auth-profile-me-query.dto';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

export class AuthProfileMeQuery {
	readonly userId: UserUuidValueObject;

	constructor(props: IAuthProfileMeQueryDto) {
		this.userId = new UserUuidValueObject(props.userId);
	}
}
