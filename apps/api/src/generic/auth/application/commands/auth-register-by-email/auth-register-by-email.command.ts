import { IAuthRegisterByEmailCommandDto } from "@/generic/auth/application/dtos/commands/auth-register-by-email/auth-register-by-email-command.dto";
import { AuthEmailValueObject } from "@/generic/auth/domain/value-objects/auth-email/auth-email.vo";
import { AuthPasswordValueObject } from "@/generic/auth/domain/value-objects/auth-password/auth-password.vo";

export class AuthRegisterByEmailCommand {
	readonly email: AuthEmailValueObject;
	readonly password: AuthPasswordValueObject;

	constructor(props: IAuthRegisterByEmailCommandDto) {
		this.email = new AuthEmailValueObject(props.email);
		this.password = new AuthPasswordValueObject(props.password);
	}
}
