import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthNotFoundException } from '@/generic/auth/application/exceptions/auth-not-found/auth-not-found.exception';
import {
	AUTH_READ_REPOSITORY_TOKEN,
	AuthReadRepository,
} from '@/generic/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

@Injectable()
export class AssertAuthViewModelExistsByUserIdService
	implements IBaseService<string, AuthViewModel>
{
	private readonly logger = new Logger(
		AssertAuthViewModelExistsByUserIdService.name,
	);

	constructor(
		@Inject(AUTH_READ_REPOSITORY_TOKEN)
		private readonly authReadRepository: AuthReadRepository,
	) {}

	/**
	 * Asserts that an auth view model exists by user id.
	 *
	 * @param userId - The user id
	 * @returns The auth view model if found
	 * @throws {AuthNotFoundException} If the auth does not exist
	 */
	async execute(userId: string): Promise<AuthViewModel> {
		this.logger.log(`Asserting auth view model exists by user id: ${userId}`);

		// 01: Find the auth by user id
		const existingAuthViewModel =
			await this.authReadRepository.findByUserId(userId);

		// 02: If the auth view model does not exist, throw an error
		if (!existingAuthViewModel) {
			this.logger.error(`Auth view model not found by user id: ${userId}`);
			throw new AuthNotFoundException(userId);
		}

		return existingAuthViewModel;
	}
}
