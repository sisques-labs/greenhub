import { AuthNotFoundException } from "@/generic/auth/application/exceptions/auth-not-found/auth-not-found.exception";
import { AssertAuthViewModelExistsByUserIdService } from "@/generic/auth/application/services/assert-auth-view-model-exists-by-user-id/assert-auth-view-model-exists-by-user-id.service";
import { AuthProviderEnum } from "@/generic/auth/domain/enums/auth-provider.enum";
import { AuthReadRepository } from "@/generic/auth/domain/repositories/auth-read.repository";
import { AuthViewModel } from "@/generic/auth/domain/view-models/auth.view-model";

describe("AssertAuthViewModelExistsByUserIdService", () => {
	let service: AssertAuthViewModelExistsByUserIdService;
	let mockAuthReadRepository: jest.Mocked<AuthReadRepository>;

	beforeEach(() => {
		mockAuthReadRepository = {
			findById: jest.fn(),
			findByUserId: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<AuthReadRepository>;

		service = new AssertAuthViewModelExistsByUserIdService(
			mockAuthReadRepository,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should return auth view model when auth exists by user id", async () => {
			const userId = "123e4567-e89b-12d3-a456-426614174001";
			const mockAuthViewModel = new AuthViewModel({
				id: "123e4567-e89b-12d3-a456-426614174000",
				userId: userId,
				email: "test@example.com",
				emailVerified: false,
				lastLoginAt: null,
				password: null,
				phoneNumber: null,
				provider: AuthProviderEnum.LOCAL,
				providerId: null,
				twoFactorEnabled: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			mockAuthReadRepository.findByUserId.mockResolvedValue(mockAuthViewModel);

			const result = await service.execute(userId);

			expect(result).toBe(mockAuthViewModel);
			expect(mockAuthReadRepository.findByUserId).toHaveBeenCalledWith(userId);
			expect(mockAuthReadRepository.findByUserId).toHaveBeenCalledTimes(1);
		});

		it("should throw AuthNotFoundException when auth view model does not exist by user id", async () => {
			const userId = "123e4567-e89b-12d3-a456-426614174001";

			mockAuthReadRepository.findByUserId.mockResolvedValue(null);

			await expect(service.execute(userId)).rejects.toThrow(
				AuthNotFoundException,
			);
			expect(mockAuthReadRepository.findByUserId).toHaveBeenCalledWith(userId);
			expect(mockAuthReadRepository.findByUserId).toHaveBeenCalledTimes(1);
		});
	});
});
