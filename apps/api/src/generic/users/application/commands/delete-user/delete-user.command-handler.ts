import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { UserDeleteCommand } from '@/generic/users/application/commands/delete-user/delete-user.command';
import { AssertUserExsistsService } from '@/generic/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { UserAggregate } from '@/generic/users/domain/aggregates/user.aggregate';
import {
	USER_WRITE_REPOSITORY_TOKEN,
	UserWriteRepository,
} from '@/generic/users/domain/repositories/user-write.repository';
import { BaseCommandHandler } from '@/shared/application/commands/base';

@CommandHandler(UserDeleteCommand)
export class UserDeleteCommandHandler
	extends BaseCommandHandler<UserDeleteCommand, UserAggregate>
	implements ICommandHandler<UserDeleteCommand>
{
	private readonly logger = new Logger(UserDeleteCommandHandler.name);

	constructor(
		@Inject(USER_WRITE_REPOSITORY_TOKEN)
		private readonly userWriteRepository: UserWriteRepository,
		eventBus: EventBus,
		private readonly assertUserExsistsService: AssertUserExsistsService,
	) {
		super(eventBus);
	}

	async execute(command: UserDeleteCommand): Promise<void> {
		this.logger.log(`Executing delete user command by id: ${command.id}`);

		// 01: Check if the user exists
		const existingUser = await this.assertUserExsistsService.execute(
			command.id,
		);

		// 02: Delete the user
		await existingUser.delete();

		// 04: Delete the user from the repository
		await this.userWriteRepository.delete(existingUser.id.value);

		// 05: Publish the user deleted event
		await this.publishDomainEvents(existingUser);
	}
}
