import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	Logger,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ClerkAuthService } from '@/shared/infrastructure/clerk/services/clerk-auth/clerk-auth.service';
import { UserEnsureExistsQuery } from '@/generic/users/application/queries/user-ensure-exists/user-ensure-exists.query';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';

/**
 * Clerk Auth Guard
 * GraphQL compatible authentication guard using Clerk
 * Creates internal user lazily on first authentication
 */
@Injectable()
export class ClerkAuthGuard implements CanActivate {
	private readonly logger = new Logger(ClerkAuthGuard.name);

	constructor(
		private readonly clerkAuthService: ClerkAuthService,
		private readonly queryBus: QueryBus,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Get GraphQL context
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		try {
			// Verify authentication with Clerk
			const authResult = await this.clerkAuthService.verifyRequest(
				request.headers,
			);

			if (!authResult.userId) {
				throw new UnauthorizedException('Invalid authentication');
			}

			// Get user information from Clerk
			const clerkUser = await this.clerkAuthService.getUser(authResult.userId);

			// Extract role from Clerk metadata
			const clerkRole =
				(clerkUser.publicMetadata?.role as string) ||
				(clerkUser.privateMetadata?.role as string) ||
				UserRoleEnum.USER;

			// Ensure internal user exists (lazy creation) via query
			const internalUser = await this.queryBus.execute(
				new UserEnsureExistsQuery({
					clerkUserId: clerkUser.id,
					userName: clerkUser.username || null,
					firstName: clerkUser.firstName || null,
					lastName: clerkUser.lastName || null,
					avatarUrl: clerkUser.imageUrl || null,
					role: clerkRole,
				}),
			);

			// Attach user to request object
			// userId is the internal user ID (UUID)
			// clerkUserId is the Clerk user ID
			// This will be used by @CurrentUser() decorator and RolesGuard
			request.user = {
				id: internalUser.id.value,
				userId: internalUser.id.value, // Internal user ID (UUID)
				clerkUserId: clerkUser.id, // Clerk user ID
				email: clerkUser.emailAddresses[0]?.emailAddress || null,
				username: internalUser.userName?.value || null,
				firstName: internalUser.name?.value || null,
				lastName: internalUser.lastName?.value || null,
				role: internalUser.role.value,
				// Store the full user objects for reference
				clerkUser: clerkUser,
				internalUser: internalUser,
				sessionId: authResult.sessionId || null,
			};

			this.logger.log(`User authenticated: ${internalUser.id.value}`);

			return true;
		} catch (error) {
			this.logger.error(`Authentication failed: ${error.message}`);
			if (error instanceof UnauthorizedException) {
				throw error;
			}
			throw new UnauthorizedException('Authentication failed');
		}
	}
}

