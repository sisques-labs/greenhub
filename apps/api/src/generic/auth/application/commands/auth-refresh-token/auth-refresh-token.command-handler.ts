import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { AssertAuthExistsService } from '@/generic/auth/application/services/assert-auth-exists/assert-auth-exsists.service';
import { JwtAuthService } from '@/generic/auth/application/services/jwt-auth/jwt-auth.service';
import { AuthAggregate } from '@/generic/auth/domain/aggregate/auth.aggregate';
import { ITokenPair } from '@/generic/auth/domain/interfaces/token-pair.interface';
import { UserFindByIdQuery } from '@/generic/users/application/queries/user-find-by-id/user-find-by-id.query';

import { AuthRefreshTokenCommand } from './auth-refresh-token.command';

@CommandHandler(AuthRefreshTokenCommand)
export class AuthRefreshTokenCommandHandler
	implements ICommandHandler<AuthRefreshTokenCommand>
{
	private readonly logger = new Logger(AuthRefreshTokenCommandHandler.name);

	constructor(
		private readonly assertAuthExistsService: AssertAuthExistsService,
		private readonly jwtAuthService: JwtAuthService,
		private readonly queryBus: QueryBus,
	) {}

	/**
	 * Executes the auth refresh token command
	 *
	 * @param command - The command to execute
	 * @returns The new access token and refresh token pair
	 */
	async execute(command: AuthRefreshTokenCommand): Promise<ITokenPair> {
		this.logger.log('Executing refresh token command');

		// 01: Verify and decode the refresh token
		const payload = this.jwtAuthService.verifyRefreshToken(
			command.refreshToken.value,
		);

		// 02: Assert the auth exists
		const auth: AuthAggregate = await this.assertAuthExistsService.execute(
			payload.id,
		);

		// 03: Find the user
		const user = await this.queryBus.execute(
			new UserFindByIdQuery({ id: auth.userId.value }),
		);

		// 04: Generate new token pair with current user data (refresh token rotation)
		const tokenPair = this.jwtAuthService.generateTokenPair({
			id: auth.id.value,
			userId: auth.userId.value,
			email: auth.email?.value || undefined,
			username: user?.userName?.value ?? undefined,
			role: user?.role?.value ?? undefined,
		});

		this.logger.log(
			`New token pair generated for auth: ${auth.id.value} (refresh token rotation)`,
		);

		return tokenPair;
	}
}
