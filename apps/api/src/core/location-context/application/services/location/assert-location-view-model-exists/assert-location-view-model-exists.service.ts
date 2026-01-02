import { Inject, Injectable, Logger } from '@nestjs/common';

import { LocationNotFoundException } from '@/core/location-context/application/exceptions/location/location-not-found/location-not-found.exception';
import {
	LOCATION_READ_REPOSITORY_TOKEN,
	ILocationReadRepository,
} from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

/**
 * Service responsible for asserting that a location view model exists in the read repository.
 *
 * @remarks
 * This service provides a method to assert the existence of a location view model
 * by its unique identifier. If the view model does not exist, an exception is thrown.
 */
@Injectable()
export class AssertLocationViewModelExistsService
	implements IBaseService<string, LocationViewModel>
{
	/**
	 * Logger instance for this service.
	 */
	private readonly logger = new Logger(
		AssertLocationViewModelExistsService.name,
	);

	/**
	 * Constructs the service.
	 *
	 * @param locationReadRepository - Repository for reading location view models
	 */
	constructor(
		@Inject(LOCATION_READ_REPOSITORY_TOKEN)
		private readonly locationReadRepository: ILocationReadRepository,
	) {}

	/**
	 * Asserts that a location view model exists by its ID.
	 *
	 * @param id - The unique identifier of the location.
	 * @returns The {@link LocationViewModel} if found.
	 * @throws {@link LocationNotFoundException} If the location view model does not exist.
	 */
	async execute(id: string): Promise<LocationViewModel> {
		this.logger.log(`Asserting location view model exists by id: ${id}`);

		// 01: Find the location view model by id
		const existingLocationViewModel =
			await this.locationReadRepository.findById(id);

		// 02: If the location view model does not exist, throw an error
		if (!existingLocationViewModel) {
			this.logger.error(`Location view model not found by id: ${id}`);
			throw new LocationNotFoundException(id);
		}

		return existingLocationViewModel;
	}
}

