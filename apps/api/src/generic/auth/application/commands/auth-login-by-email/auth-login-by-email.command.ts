import { IAuthLoginByEmailCommandDto } from "@/generic/auth/application/dtos/commands/auth-login-by-email/auth-login-by-email-command.dto";
import { AuthEmailValueObject } from "@/generic/auth/domain/value-objects/auth-email/auth-email.vo";
import { AuthPasswordValueObject } from "@/generic/auth/domain/value-objects/auth-password/auth-password.vo";

export class AuthLoginByEmailCommand {
	readonly email: AuthEmailValueObject;
	readonly password: AuthPasswordValueObject;

	constructor(props: IAuthLoginByEmailCommandDto) {
		this.email = new AuthEmailValueObject(props.email);
		this.password = new AuthPasswordValueObject(props.password);
	}
}
