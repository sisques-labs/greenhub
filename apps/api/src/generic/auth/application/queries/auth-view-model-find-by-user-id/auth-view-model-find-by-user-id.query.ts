import { IAuthViewModelFindByUserIdQueryDto } from "@/generic/auth/application/dtos/queries/auth-view-model-find-by-user-id/auth-view-model-find-by-user-id-query.dto";
import { UserUuidValueObject } from "@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo";

export class AuthViewModelFindByUserIdQuery {
	readonly userId: UserUuidValueObject;

	constructor(props: IAuthViewModelFindByUserIdQueryDto) {
		this.userId = new UserUuidValueObject(props.userId);
	}
}
