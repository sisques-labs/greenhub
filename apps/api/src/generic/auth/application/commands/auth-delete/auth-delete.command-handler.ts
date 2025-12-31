import { Inject, Logger } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { AuthDeleteCommand } from "@/generic/auth/application/commands/auth-delete/auth-delete.command";
import { AssertAuthExistsService } from "@/generic/auth/application/services/assert-auth-exists/assert-auth-exsists.service";
import {
	AUTH_WRITE_REPOSITORY_TOKEN,
	AuthWriteRepository,
} from "@/generic/auth/domain/repositories/auth-write.repository";

@CommandHandler(AuthDeleteCommand)
export class AuthDeleteCommandHandler
	implements ICommandHandler<AuthDeleteCommand>
{
	private readonly logger = new Logger(AuthDeleteCommandHandler.name);

	constructor(
		@Inject(AUTH_WRITE_REPOSITORY_TOKEN)
		private readonly authWriteRepository: AuthWriteRepository,
		private readonly eventBus: EventBus,
		private readonly assertAuthExistsService: AssertAuthExistsService,
	) {}

	async execute(command: AuthDeleteCommand): Promise<void> {
		this.logger.log(`Executing delete auth command by id: ${command.id}`);

		// 01: Check if the auth exists
		const existingAuth = await this.assertAuthExistsService.execute(command.id);

		// 02: Delete the auth
		await existingAuth.delete();

		// 03: Delete the auth from the repository
		await this.authWriteRepository.delete(existingAuth.id.value);

		// 04: Publish the auth deleted event
		await this.eventBus.publishAll(existingAuth.getUncommittedEvents());
		await existingAuth.commit();
	}
}
