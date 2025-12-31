import { AuthNotFoundException } from "@/generic/auth/application/exceptions/auth-not-found/auth-not-found.exception";
import { AssertAuthViewModelExistsService } from "@/generic/auth/application/services/assert-auth-view-model-exists/assert-auth-view-model-exists.service";
import { AuthProviderEnum } from "@/generic/auth/domain/enums/auth-provider.enum";
import { AuthReadRepository } from "@/generic/auth/domain/repositories/auth-read.repository";
import { AuthViewModel } from "@/generic/auth/domain/view-models/auth.view-model";

describe("AssertAuthViewModelExsistsService", () => {
	let service: AssertAuthViewModelExistsService;
	let mockAuthReadRepository: jest.Mocked<AuthReadRepository>;

	beforeEach(() => {
		mockAuthReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<AuthReadRepository>;

		service = new AssertAuthViewModelExistsService(mockAuthReadRepository);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should return auth view model when auth exists by id", async () => {
			const authId = "123e4567-e89b-12d3-a456-426614174000";
			const mockAuthViewModel = new AuthViewModel({
				id: authId,
				userId: "123e4567-e89b-12d3-a456-426614174001",
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

			mockAuthReadRepository.findById.mockResolvedValue(mockAuthViewModel);

			const result = await service.execute(authId);

			expect(result).toBe(mockAuthViewModel);
			expect(mockAuthReadRepository.findById).toHaveBeenCalledWith(authId);
			expect(mockAuthReadRepository.findById).toHaveBeenCalledTimes(1);
		});

		it("should throw AuthNotFoundException when auth view model does not exist", async () => {
			const authId = "123e4567-e89b-12d3-a456-426614174000";

			mockAuthReadRepository.findById.mockResolvedValue(null);

			await expect(service.execute(authId)).rejects.toThrow(
				AuthNotFoundException,
			);
			expect(mockAuthReadRepository.findById).toHaveBeenCalledWith(authId);
			expect(mockAuthReadRepository.findById).toHaveBeenCalledTimes(1);
		});
	});
});
