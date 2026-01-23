import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserDeleteCommand } from '@/generic/users/application/commands/delete-user/delete-user.command';
import { AssertUserExsistsService } from '@/generic/users/application/services/assert-user-exsits/assert-user-exsits.service';
import {
	USER_WRITE_REPOSITORY_TOKEN,
	UserWriteRepository,
} from '@/generic/users/domain/repositories/user-write.repository';
import { PublishDomainEventsService } from '@/shared/application/services/publish-domain-events/publish-domain-events.service';

@CommandHandler(UserDeleteCommand)
export class UserDeleteCommandHandler
	implements ICommandHandler<UserDeleteCommand>
{
	private readonly logger = new Logger(UserDeleteCommandHandler.name);

	constructor(
		@Inject(USER_WRITE_REPOSITORY_TOKEN)
		private readonly userWriteRepository: UserWriteRepository,
		private readonly publishDomainEventsService: PublishDomainEventsService,
		private readonly assertUserExsistsService: AssertUserExsistsService,
	) {}

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

		// 05: Publish all domain events
		await this.publishDomainEventsService.execute(
			existingUser.getUncommittedEvents(),
		);
		await existingUser.commit();
	}
}
