import { EventBus } from "@nestjs/cqrs";
import { AuthUpdateCommandHandler } from "@/generic/auth/application/commands/auth-update/auth-update.command-handler";
import { AssertAuthExistsService } from "@/generic/auth/application/services/assert-auth-exists/assert-auth-exsists.service";
import { AuthAggregate } from "@/generic/auth/domain/aggregate/auth.aggregate";
import { AuthProviderEnum } from "@/generic/auth/domain/enums/auth-provider.enum";
import { AuthWriteRepository } from "@/generic/auth/domain/repositories/auth-write.repository";
import { AuthEmailValueObject } from "@/generic/auth/domain/value-objects/auth-email/auth-email.vo";
import { AuthEmailVerifiedValueObject } from "@/generic/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo";
import { AuthProviderValueObject } from "@/generic/auth/domain/value-objects/auth-provider/auth-provider.vo";
import { AuthTwoFactorEnabledValueObject } from "@/generic/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo";
import { DateValueObject } from "@/shared/domain/value-objects/date/date.vo";
import { AuthUuidValueObject } from "@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo";
import { UserUuidValueObject } from "@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo";
import { AuthUpdateCommand } from "./auth-update.command";

describe("AuthUpdateCommandHandler", () => {
	let handler: AuthUpdateCommandHandler;
	let mockAuthWriteRepository: jest.Mocked<AuthWriteRepository>;
	let mockEventBus: jest.Mocked<EventBus>;
	let mockAssertAuthExistsService: jest.Mocked<AssertAuthExistsService>;

	beforeEach(() => {
		mockAuthWriteRepository = {
			findById: jest.fn(),
			findByEmail: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<AuthWriteRepository>;

		mockEventBus = {
			publishAll: jest.fn(),
			publish: jest.fn(),
		} as unknown as jest.Mocked<EventBus>;

		mockAssertAuthExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertAuthExistsService>;

		handler = new AuthUpdateCommandHandler(
			mockAuthWriteRepository,
			mockEventBus,
			mockAssertAuthExistsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should update auth successfully when auth exists", async () => {
			const authId = "123e4567-e89b-12d3-a456-426614174000";
			const now = new Date();

			const command = new AuthUpdateCommand({
				id: authId,
				email: "updated@example.com",
			});

			const existingAuth = new AuthAggregate(
				{
					id: new AuthUuidValueObject(authId),
					userId: new UserUuidValueObject(
						"123e4567-e89b-12d3-a456-426614174001",
					),
					email: new AuthEmailValueObject("old@example.com"),
					emailVerified: new AuthEmailVerifiedValueObject(false),
					lastLoginAt: null,
					password: null,
					phoneNumber: null,
					provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
					providerId: null,
					twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
					createdAt: new DateValueObject(now),
					updatedAt: new DateValueObject(now),
				},
				false,
			);

			const updateSpy = jest.spyOn(existingAuth, "update");
			const commitSpy = jest.spyOn(existingAuth, "commit");
			const getUncommittedEventsSpy = jest
				.spyOn(existingAuth, "getUncommittedEvents")
				.mockReturnValue([]);

			mockAssertAuthExistsService.execute.mockResolvedValue(existingAuth);
			mockAuthWriteRepository.save.mockResolvedValue(undefined);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockAssertAuthExistsService.execute).toHaveBeenCalledWith(authId);
			expect(updateSpy).toHaveBeenCalled();
			expect(mockAuthWriteRepository.save).toHaveBeenCalledWith(existingAuth);
			expect(mockEventBus.publishAll).toHaveBeenCalled();
			expect(commitSpy).toHaveBeenCalled();

			updateSpy.mockRestore();
			commitSpy.mockRestore();
			getUncommittedEventsSpy.mockRestore();
		});

		it("should throw exception when auth does not exist", async () => {
			const authId = "123e4567-e89b-12d3-a456-426614174000";

			const command = new AuthUpdateCommand({
				id: authId,
				email: "updated@example.com",
			});

			const error = new Error("Auth not found");
			mockAssertAuthExistsService.execute.mockRejectedValue(error);

			await expect(handler.execute(command)).rejects.toThrow(error);
			expect(mockAuthWriteRepository.save).not.toHaveBeenCalled();
			expect(mockEventBus.publishAll).not.toHaveBeenCalled();
		});
	});
});
