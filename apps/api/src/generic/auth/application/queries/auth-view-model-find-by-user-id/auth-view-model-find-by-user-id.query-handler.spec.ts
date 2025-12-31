import { AuthViewModelFindByUserIdQuery } from '@/generic/auth/application/queries/auth-view-model-find-by-user-id/auth-view-model-find-by-user-id.query';
import { AuthViewModelFindByUserIdQueryHandler } from '@/generic/auth/application/queries/auth-view-model-find-by-user-id/auth-view-model-find-by-user-id.query-handler';
import { AssertAuthViewModelExistsByUserIdService } from '@/generic/auth/application/services/assert-auth-view-model-exists-by-user-id/assert-auth-view-model-exists-by-user-id.service';
import { AuthProviderEnum } from '@/generic/auth/domain/enums/auth-provider.enum';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';

describe('AuthViewModelFindByUserIdQueryHandler', () => {
	let handler: AuthViewModelFindByUserIdQueryHandler;
	let mockAssertAuthViewModelExistsByUserIdService: jest.Mocked<AssertAuthViewModelExistsByUserIdService>;

	beforeEach(() => {
		mockAssertAuthViewModelExistsByUserIdService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertAuthViewModelExistsByUserIdService>;

		handler = new AuthViewModelFindByUserIdQueryHandler(
			mockAssertAuthViewModelExistsByUserIdService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return auth view model when auth exists by user id', async () => {
			const userId = '123e4567-e89b-12d3-a456-426614174001';
			const query = new AuthViewModelFindByUserIdQuery({ userId });

			const mockAuthViewModel = new AuthViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: userId,
				email: 'test@example.com',
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

			mockAssertAuthViewModelExistsByUserIdService.execute.mockResolvedValue(
				mockAuthViewModel,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockAuthViewModel);
			expect(
				mockAssertAuthViewModelExistsByUserIdService.execute,
			).toHaveBeenCalledWith(userId);
			expect(
				mockAssertAuthViewModelExistsByUserIdService.execute,
			).toHaveBeenCalledTimes(1);
		});
	});
});
