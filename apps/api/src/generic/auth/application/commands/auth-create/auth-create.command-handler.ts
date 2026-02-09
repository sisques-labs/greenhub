import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { PasswordHashingService } from '@/generic/auth/application/services/password-hashing/password-hashing.service';
import { AuthAggregate } from '@/generic/auth/domain/aggregate/auth.aggregate';
import { AuthAggregateFactory } from '@/generic/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import {
	AUTH_WRITE_REPOSITORY_TOKEN,
	AuthWriteRepository,
} from '@/generic/auth/domain/repositories/auth-write.repository';
import { AuthPasswordValueObject } from '@/generic/auth/domain/value-objects/auth-password/auth-password.vo';
import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';

import { AuthCreateCommand } from './auth-create.command';

@CommandHandler(AuthCreateCommand)
export class AuthCreateCommandHandler
	extends BaseCommandHandler<AuthCreateCommand, AuthAggregate>
	implements ICommandHandler<AuthCreateCommand>
{
	private readonly logger = new Logger(AuthCreateCommandHandler.name);

	constructor(
		@Inject(AUTH_WRITE_REPOSITORY_TOKEN)
		private readonly authWriteRepository: AuthWriteRepository,
		private readonly authAggregateFactory: AuthAggregateFactory,
		eventBus: EventBus,
		private readonly passwordHashingService: PasswordHashingService,
	) {
		super(eventBus);
	}

	/**
	 * Executes the auth create command
	 *
	 * @param command - The command to execute
	 * @returns The created auth id
	 */
	async execute(command: AuthCreateCommand): Promise<string> {
		this.logger.log(
			`Executing auth create command for user: ${command.userId.value}`,
		);

		const now = new Date();

		// 01: If password is provided, hash it
		let hashedPassword: string | null = null;
		if (command.password) {
			hashedPassword = await this.passwordHashingService.hashPassword(
				command.password,
			);
		}

		// 01: Create the auth entity
		const auth = this.authAggregateFactory.create({
			id: command.id,
			userId: command.userId,
			email: command.email,
			emailVerified: command.emailVerified,
			lastLoginAt: command.lastLoginAt,
			password: command.password
				? new AuthPasswordValueObject(hashedPassword)
				: null,
			phoneNumber: command.phoneNumber,
			provider: command.provider,
			providerId: command.providerId,
			twoFactorEnabled: command.twoFactorEnabled,
			createdAt: new DateValueObject(now),
			updatedAt: new DateValueObject(now),
		});

		// 02: Save the auth entity
		await this.authWriteRepository.save(auth);

		// 03: Publish all events
		await this.publishEvents(auth);

		// 04: Return the auth id
		return auth.id.value;
	}
}
