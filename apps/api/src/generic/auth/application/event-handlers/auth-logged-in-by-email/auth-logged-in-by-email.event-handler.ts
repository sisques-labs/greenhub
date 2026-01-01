import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AssertAuthViewModelExistsService } from '@/generic/auth/application/services/assert-auth-view-model-exists/assert-auth-view-model-exists.service';
import {
	AUTH_READ_REPOSITORY_TOKEN,
	AuthReadRepository,
} from '@/generic/auth/domain/repositories/auth-read.repository';
import { AuthLoggedInByEmailEvent } from '@/shared/domain/events/auth/auth-logged-in-by-email/auth-logged-in-by-email.event';

@EventsHandler(AuthLoggedInByEmailEvent)
export class AuthLoggedInByEmailEventHandler
	implements IEventHandler<AuthLoggedInByEmailEvent>
{
	private readonly logger = new Logger(AuthLoggedInByEmailEventHandler.name);

	constructor(
		@Inject(AUTH_READ_REPOSITORY_TOKEN)
		private readonly authReadRepository: AuthReadRepository,
		private readonly assertAuthViewModelExistsService: AssertAuthViewModelExistsService,
	) {}

	/**
	 * Handles the AuthLoggedInEvent event by updating the existing auth view model.
	 *
	 * @param event - The AuthLoggedInEvent event to handle.
	 */
	async handle(event: AuthLoggedInByEmailEvent) {
		this.logger.log(
			`Handling auth logged in by email event: ${event.entityId}`,
		);

		// 01: Assert the auth view model exists
		const existingAuthViewModel =
			await this.assertAuthViewModelExistsService.execute(event.entityId);

		// 02: Update the existing view model with new data (mainly lastLoginAt)
		existingAuthViewModel.update(event.data);

		// 03: Save the updated auth view model
		await this.authReadRepository.save(existingAuthViewModel);
	}
}
