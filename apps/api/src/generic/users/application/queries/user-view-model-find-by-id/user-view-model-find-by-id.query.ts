import { IUserFindByIdQueryDto } from '@/generic/users/application/dtos/queries/user-find-by-id/user-find-by-id-query.dto';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

export class UserViewModelFindByIdQuery {
	readonly id: UserUuidValueObject;

	constructor(props: IUserFindByIdQueryDto) {
		this.id = new UserUuidValueObject(props.id);
	}
}
