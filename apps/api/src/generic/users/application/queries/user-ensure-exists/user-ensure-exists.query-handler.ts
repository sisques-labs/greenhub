import { Logger } from '@nestjs/common';
import { CommandBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserCreateCommand } from '@/generic/users/application/commands/user-create/user-create.command';
import { UserEnsureExistsQuery } from '@/generic/users/application/queries/user-ensure-exists/user-ensure-exists.query';
import { UserAggregate } from '@/generic/users/domain/aggregates/user.aggregate';
import {
	USER_WRITE_REPOSITORY_TOKEN,
	UserWriteRepository,
} from '@/generic/users/domain/repositories/user-write.repository';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { Inject } from '@nestjs/common';

/**
 * Query handler for ensuring a user exists (lazy creation).
 * Used for Clerk integration to create internal users on first authentication.
 */
@QueryHandler(UserEnsureExistsQuery)
export class UserEnsureExistsQueryHandler
	implements IQueryHandler<UserEnsureExistsQuery>
{
	private readonly logger = new Logger(UserEnsureExistsQueryHandler.name);

	constructor(
		@Inject(USER_WRITE_REPOSITORY_TOKEN)
		private readonly userWriteRepository: UserWriteRepository,
		private readonly commandBus: CommandBus,
	) {}

	/**
	 * Ensures a user exists, creating it if it doesn't.
	 * Uses the clerkUserId as the internal user ID.
	 *
	 * @param query - The query containing clerkUserId and user data from Clerk
	 * @returns The user aggregate (existing or newly created)
	 */
	async execute(query: UserEnsureExistsQuery): Promise<UserAggregate> {
		this.logger.log(
			`Ensuring user exists for Clerk user: ${query.clerkUserId}`,
		);

		// 01: Check if user already exists by clerkUserId
		const existingUser = await this.userWriteRepository.findByClerkUserId(
			query.clerkUserId,
		);

		if (existingUser) {
			this.logger.log(`User already exists: ${query.clerkUserId}`);
			return existingUser;
		}

		// 02: User doesn't exist, create it lazily
		this.logger.log(
			`Creating user lazily for Clerk user: ${query.clerkUserId}`,
		);

		await this.commandBus.execute(
			new UserCreateCommand({
				clerkUserId: query.clerkUserId,
				userName: query.userName || null,
				name: query.firstName || null,
				lastName: query.lastName || null,
				avatarUrl: query.avatarUrl || null,
				role: (query.role as UserRoleEnum) || UserRoleEnum.USER,
				bio: null,
			}),
		);

		// 03: Fetch the newly created user
		const newUser = await this.userWriteRepository.findByClerkUserId(
			query.clerkUserId,
		);

		if (!newUser) {
			throw new Error(`Failed to create user: ${query.clerkUserId}`);
		}

		this.logger.log(`User created successfully: ${query.clerkUserId}`);

		return newUser;
	}
}
