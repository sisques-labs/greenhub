import { IAuthUpdateCommandDto } from "@/generic/auth/application/dtos/commands/auth-update/auth-update-command.dto";
import { AuthEmailValueObject } from "@/generic/auth/domain/value-objects/auth-email/auth-email.vo";
import { AuthEmailVerifiedValueObject } from "@/generic/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo";
import { AuthLastLoginAtValueObject } from "@/generic/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo";
import { AuthPasswordValueObject } from "@/generic/auth/domain/value-objects/auth-password/auth-password.vo";
import { AuthProviderValueObject } from "@/generic/auth/domain/value-objects/auth-provider/auth-provider.vo";
import { AuthProviderIdValueObject } from "@/generic/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo";
import { AuthTwoFactorEnabledValueObject } from "@/generic/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo";
import { AuthUuidValueObject } from "@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo";

export class AuthUpdateCommand {
	readonly id: AuthUuidValueObject;
	readonly email?: AuthEmailValueObject | null;
	readonly emailVerified?: AuthEmailVerifiedValueObject;
	readonly lastLoginAt: AuthLastLoginAtValueObject | null;
	readonly password?: AuthPasswordValueObject | null;
	readonly provider?: AuthProviderValueObject;
	readonly providerId?: AuthProviderIdValueObject | null;
	readonly twoFactorEnabled?: AuthTwoFactorEnabledValueObject;

	constructor(props: IAuthUpdateCommandDto) {
		this.id = new AuthUuidValueObject(props.id);

		if (props.email !== undefined) {
			this.email = props.email ? new AuthEmailValueObject(props.email) : null;
		}

		if (props.emailVerified !== undefined) {
			this.emailVerified = new AuthEmailVerifiedValueObject(
				props.emailVerified,
			);
		}

		if (props.lastLoginAt !== undefined) {
			this.lastLoginAt = props.lastLoginAt
				? new AuthLastLoginAtValueObject(props.lastLoginAt)
				: null;
		}

		if (props.password !== undefined) {
			this.password = props.password
				? new AuthPasswordValueObject(props.password)
				: null;
		}

		if (props.provider !== undefined) {
			this.provider = new AuthProviderValueObject(props.provider);
		}

		if (props.providerId !== undefined) {
			this.providerId = props.providerId
				? new AuthProviderIdValueObject(props.providerId)
				: null;
		}

		if (props.twoFactorEnabled !== undefined) {
			this.twoFactorEnabled = new AuthTwoFactorEnabledValueObject(
				props.twoFactorEnabled,
			);
		}
	}
}
