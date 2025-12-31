import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { AuthCreateCommand } from "@/generic/auth/application/commands/auth-create/auth-create.command";
import { AuthDeleteCommand } from "@/generic/auth/application/commands/auth-delete/auth-delete.command";
import { IAuthCreateCommandDto } from "@/generic/auth/application/dtos/commands/auth-create/auth-create-command.dto";
import { UserDeleteCommand } from "@/generic/users/application/commands/delete-user/delete-user.command";
import { UserCreateCommand } from "@/generic/users/application/commands/user-create/user-create.command";
import { BaseSaga } from "@/shared/application/sagas/base-saga/base-saga";
import { AuthRegistrationRequestedEvent } from "@/shared/domain/events/auth/auth-registration-requested/auth-registration-requested.event";

/**
 * Saga that orchestrates the complete user registration flow:
 * 1. Create user
 * 2. Create auth
 *
 * Compensation flow (in reverse order):
 * - Delete user
 * - Delete auth
 *
 * Note: This saga is called synchronously from AuthRegisterByEmailCommandHandler
 * to provide immediate feedback to the client. It's not registered as an event handler
 * to avoid duplicate execution.
 */
@Injectable()
export class AuthRegistrationSaga extends BaseSaga {
	private compensationActions: Array<() => Promise<void>> = [];

	constructor(commandBus: CommandBus) {
		super(commandBus);
	}

	async handle(event: AuthRegistrationRequestedEvent): Promise<void> {
		const authId = event.entityId;
		const userId = event.data.userId;

		this.logger.log(
			`🚀 Starting complete user registration SAGA for auth: ${authId}, user: ${userId}`,
		);

		const sagaInstanceId = await this.createSagaInstance(
			`Complete User Registration for Auth ${authId}`,
		);

		try {
			// Step 1: Create user
			const userResult = await this.executeStep(sagaInstanceId, {
				name: "Create User",
				order: 1,
				payload: {},
				action: () => this.createUserStep(),
			});
			const userId = userResult.userId;

			// Register compensation: delete user
			this.compensationActions.push(async () => {
				this.logger.log(`🔄 Compensating: Deleting user ${userId}`);
				try {
					await this.commandBus.execute(new UserDeleteCommand({ id: userId }));
				} catch (compensationError) {
					this.logger.error(
						`❌ Failed to delete user ${userId} during compensation: ${compensationError}`,
					);
					// Continue with other compensations even if this fails
				}
			});

			// Step 2: Create auth
			const authResult = await this.executeStep(sagaInstanceId, {
				name: "Create Auth",
				order: 2,
				payload: { userId, ...(event.data as IAuthCreateCommandDto) },
				action: () =>
					this.createAuthStep({
						id: event.data.id,
						userId: userId,
						email: event.data.email,
						password: event.data.password,
						emailVerified: event.data.emailVerified ?? false,
						phoneNumber: event.data.phoneNumber,
						provider: event.data.provider,
						providerId: event.data.providerId,
						twoFactorEnabled: event.data.twoFactorEnabled ?? false,
						lastLoginAt: event.data.lastLoginAt,
					}),
			});
			const createdAuthId = authResult.authId;

			// Register compensation: delete auth
			this.compensationActions.push(async () => {
				this.logger.log(`🔄 Compensating: Deleting auth ${createdAuthId}`);
				try {
					await this.commandBus.execute(
						new AuthDeleteCommand({ id: createdAuthId }),
					);
				} catch (compensationError) {
					this.logger.error(
						`❌ Failed to delete auth ${createdAuthId} during compensation: ${compensationError}`,
					);
				}
			});

			await this.completeSagaInstance(sagaInstanceId);
			this.logger.log(
				`🎉 Complete user registration SAGA completed successfully for auth: ${authId}`,
			);
		} catch (error) {
			this.logger.error(
				`❌ Complete user registration SAGA failed for auth: ${authId}. Error: ${error}`,
			);

			// Execute compensation in reverse order
			await this.executeCompensation();

			await this.failSagaInstance(sagaInstanceId);
			throw error;
		}
	}

	/**
	 * Creates a user with the provided data
	 */
	private async createUserStep(): Promise<{ userId: string }> {
		const userId = await this.commandBus.execute(
			new UserCreateCommand({
				avatarUrl: null,
				bio: null,
				lastName: null,
				name: null,
				userName: null,
			}),
		);

		this.logger.log(`✅ User created successfully: ${userId}`);

		return { userId };
	}

	/**
	 * Creates an auth with the provided data
	 */
	private async createAuthStep(
		authData: IAuthCreateCommandDto,
	): Promise<{ authId: string }> {
		const authId = await this.commandBus.execute(
			new AuthCreateCommand(authData),
		);
		this.logger.log(`✅ Auth created successfully: ${authId}`);

		return { authId };
	}

	/**
	 * Executes compensation actions in reverse order
	 */
	private async executeCompensation(): Promise<void> {
		if (this.compensationActions.length === 0) {
			return;
		}

		this.logger.log(
			`🔄 Starting compensation for ${this.compensationActions.length} actions`,
		);

		// Execute compensation actions in reverse order
		for (let i = this.compensationActions.length - 1; i >= 0; i--) {
			try {
				await this.compensationActions[i]();
			} catch (compensationError) {
				this.logger.error(
					`❌ Compensation action ${i} failed: ${compensationError}`,
				);
			}
		}

		// Clear compensation actions after execution
		this.compensationActions = [];
	}
}
