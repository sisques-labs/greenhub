import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { AuthDeleteCommand } from '@/generic/auth/application/commands/auth-delete/auth-delete.command';
import { AssertAuthExistsService } from '@/generic/auth/application/services/assert-auth-exists/assert-auth-exsists.service';
import { AuthAggregate } from '@/generic/auth/domain/aggregate/auth.aggregate';
import {
	AUTH_WRITE_REPOSITORY_TOKEN,
	AuthWriteRepository,
} from '@/generic/auth/domain/repositories/auth-write.repository';
import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';

@CommandHandler(AuthDeleteCommand)
export class AuthDeleteCommandHandler
	extends BaseCommandHandler<AuthDeleteCommand, AuthAggregate>
	implements ICommandHandler<AuthDeleteCommand>
{
	private readonly logger = new Logger(AuthDeleteCommandHandler.name);

	constructor(
		@Inject(AUTH_WRITE_REPOSITORY_TOKEN)
		private readonly authWriteRepository: AuthWriteRepository,
		eventBus: EventBus,
		private readonly assertAuthExistsService: AssertAuthExistsService,
	) {
		super(eventBus);
	}

	async execute(command: AuthDeleteCommand): Promise<void> {
		this.logger.log(`Executing delete auth command by id: ${command.id}`);

		// 01: Check if the auth exists
		const existingAuth = await this.assertAuthExistsService.execute(command.id);

		// 02: Delete the auth
		await existingAuth.delete();

		// 03: Delete the auth from the repository
		await this.authWriteRepository.delete(existingAuth.id.value);

		// 04: Publish the auth deleted event
		await this.publishDomainEvents(existingAuth);
	}
}
