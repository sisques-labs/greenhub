import { CommandBus } from "@nestjs/cqrs";
import { AuthCreateCommand } from "@/generic/auth/application/commands/auth-create/auth-create.command";
import { AuthDeleteCommand } from "@/generic/auth/application/commands/auth-delete/auth-delete.command";
import { AuthRegistrationSaga } from "@/generic/auth/application/sagas/auth-registration/auth-registration.saga";
import { AuthAggregate } from "@/generic/auth/domain/aggregate/auth.aggregate";
import { AuthProviderEnum } from "@/generic/auth/domain/enums/auth-provider.enum";
import { SagaInstanceChangeStatusCommand } from "@/generic/saga-context/saga-instance/application/commands/saga-instance-change-status/saga-instance-change-status.command";
import { SagaInstanceCreateCommand } from "@/generic/saga-context/saga-instance/application/commands/saga-instance-create/saga-instance-create.command";
import { UserDeleteCommand } from "@/generic/users/application/commands/delete-user/delete-user.command";
import { UserCreateCommand } from "@/generic/users/application/commands/user-create/user-create.command";
import { AuthRegistrationRequestedEvent } from "@/shared/domain/events/auth/auth-registration-requested/auth-registration-requested.event";
import { IAuthEventData } from "@/shared/domain/events/auth/interfaces/auth-event-data.interface";

describe("AuthRegistrationSaga", () => {
	let saga: AuthRegistrationSaga;
	let mockCommandBus: jest.Mocked<CommandBus>;

	const authId = "123e4567-e89b-12d3-a456-426614174000";
	const userId = "123e4567-e89b-12d3-a456-426614174001";
	const sagaInstanceId = "423e4567-e89b-12d3-a456-426614174000";
	const sagaStepId = "523e4567-e89b-12d3-a456-426614174000";

	const createEvent = (): AuthRegistrationRequestedEvent => {
		const eventData: IAuthEventData = {
			id: authId,
			userId: userId,
			email: "test@example.com",
			emailVerified: false,
			phoneNumber: null,
			lastLoginAt: null,
			password: null,
			provider: AuthProviderEnum.LOCAL,
			providerId: null,
			twoFactorEnabled: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		return new AuthRegistrationRequestedEvent(
			{
				aggregateRootId: authId,
				aggregateRootType: AuthAggregate.name,
				entityId: authId,
				entityType: AuthAggregate.name,
				eventType: AuthRegistrationRequestedEvent.name,
			},
			eventData,
		);
	};

	beforeEach(() => {
		mockCommandBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<CommandBus>;

		saga = new AuthRegistrationSaga(mockCommandBus);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("handle", () => {
		it("should complete registration successfully", async () => {
			const event = createEvent();

			// Mock saga instance creation
			mockCommandBus.execute
				.mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
				.mockResolvedValueOnce(undefined) // changeStatus to RUNNING
				.mockResolvedValueOnce(sagaStepId) // create step 1
				.mockResolvedValueOnce(undefined) // update step 1 to RUNNING
				.mockResolvedValueOnce(userId) // UserCreateCommand
				.mockResolvedValueOnce(undefined) // update step 1 to COMPLETED
				.mockResolvedValueOnce(sagaStepId) // create step 2
				.mockResolvedValueOnce(undefined) // update step 2 to RUNNING
				.mockResolvedValueOnce(authId) // AuthCreateCommand
				.mockResolvedValueOnce(undefined) // update step 2 to COMPLETED
				.mockResolvedValueOnce(undefined); // completeSagaInstance

			await saga.handle(event);

			// Verify saga instance creation
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(SagaInstanceCreateCommand),
			);
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(SagaInstanceChangeStatusCommand),
			);

			// Verify user creation
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(UserCreateCommand),
			);

			// Verify auth creation
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(AuthCreateCommand),
			);

			// Verify saga completion
			const completeCalls = mockCommandBus.execute.mock.calls.filter(
				(call) => call[0] instanceof SagaInstanceChangeStatusCommand,
			);
			expect(completeCalls.length).toBeGreaterThan(0);
		});

		it("should execute compensation actions when user creation fails", async () => {
			const event = createEvent();
			const error = new Error("User creation failed");

			// Mock saga instance creation and user creation failure
			mockCommandBus.execute
				.mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
				.mockResolvedValueOnce(undefined) // changeStatus to RUNNING
				.mockResolvedValueOnce(sagaStepId) // create step 1
				.mockResolvedValueOnce(undefined) // update step 1 to RUNNING
				.mockRejectedValueOnce(error) // UserCreateCommand fails
				.mockResolvedValueOnce(undefined) // update step 1 to FAILED
				.mockResolvedValueOnce(undefined); // failSagaInstance

			await expect(saga.handle(event)).rejects.toThrow(error);

			// Verify saga instance is marked as failed
			const failCalls = mockCommandBus.execute.mock.calls.filter(
				(call) => call[0] instanceof SagaInstanceChangeStatusCommand,
			);
			expect(failCalls.length).toBeGreaterThan(0);
		});

		it("should execute compensation actions when auth creation fails", async () => {
			const event = createEvent();
			const error = new Error("Auth creation failed");

			// Mock saga instance creation, user creation success, auth creation failure
			mockCommandBus.execute
				.mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
				.mockResolvedValueOnce(undefined) // changeStatus to RUNNING
				.mockResolvedValueOnce(sagaStepId) // create step 1
				.mockResolvedValueOnce(undefined) // update step 1 to RUNNING
				.mockResolvedValueOnce(userId) // UserCreateCommand
				.mockResolvedValueOnce(undefined) // update step 1 to COMPLETED
				.mockResolvedValueOnce(sagaStepId) // create step 2
				.mockResolvedValueOnce(undefined) // update step 2 to RUNNING
				.mockRejectedValueOnce(error) // AuthCreateCommand fails
				.mockResolvedValueOnce(undefined) // update step 2 to FAILED
				.mockResolvedValueOnce(undefined) // UserDeleteCommand (compensation)
				.mockResolvedValueOnce(undefined); // failSagaInstance

			await expect(saga.handle(event)).rejects.toThrow(error);

			// Verify compensation: user deletion
			expect(mockCommandBus.execute).toHaveBeenCalledWith(
				expect.any(UserDeleteCommand),
			);
		});

		it("should execute compensation actions in reverse order", async () => {
			const event = createEvent();
			const error = new Error("Saga completion failed");

			const compensationOrder: string[] = [];

			// Mock saga instance creation, both steps success, but completeSagaInstance fails
			mockCommandBus.execute
				.mockResolvedValueOnce(sagaInstanceId) // createSagaInstance
				.mockResolvedValueOnce(undefined) // changeStatus to RUNNING
				.mockResolvedValueOnce(sagaStepId) // create step 1
				.mockResolvedValueOnce(undefined) // update step 1 to RUNNING
				.mockResolvedValueOnce(userId) // UserCreateCommand
				.mockResolvedValueOnce(undefined) // update step 1 to COMPLETED
				.mockResolvedValueOnce(sagaStepId) // create step 2
				.mockResolvedValueOnce(undefined) // update step 2 to RUNNING
				.mockResolvedValueOnce(authId) // AuthCreateCommand
				.mockResolvedValueOnce(undefined) // update step 2 to COMPLETED
				.mockRejectedValueOnce(error) // completeSagaInstance fails
				.mockImplementationOnce((command) => {
					// Track compensation order
					if (command instanceof AuthDeleteCommand) {
						compensationOrder.push("auth");
					}
					return Promise.resolve(undefined);
				})
				.mockImplementationOnce((command) => {
					if (command instanceof UserDeleteCommand) {
						compensationOrder.push("user");
					}
					return Promise.resolve(undefined);
				})
				.mockResolvedValueOnce(undefined); // failSagaInstance

			await expect(saga.handle(event)).rejects.toThrow(error);

			// Verify compensation order is reverse (auth -> user)
			expect(compensationOrder).toEqual(["auth", "user"]);
		});
	});
});
