import { IUserEnsureExistsQueryDto } from '@/generic/users/application/dtos/queries/user-ensure-exists/user-ensure-exists-query.dto';

export class UserEnsureExistsQuery {
	readonly clerkUserId: string;
	readonly userName?: string | null;
	readonly firstName?: string | null;
	readonly lastName?: string | null;
	readonly avatarUrl?: string | null;
	readonly role?: string;

	constructor(props: IUserEnsureExistsQueryDto) {
		this.clerkUserId = props.clerkUserId;
		this.userName = props.userName || null;
		this.firstName = props.firstName || null;
		this.lastName = props.lastName || null;
		this.avatarUrl = props.avatarUrl || null;
		this.role = props.role;
	}
}
