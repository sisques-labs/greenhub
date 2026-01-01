import { Inject, Injectable, Logger } from '@nestjs/common';

import { LocationNotFoundException } from '@/core/location-context/application/exceptions/location/location-not-found/location-not-found.exception';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import {
	LOCATION_WRITE_REPOSITORY_TOKEN,
	ILocationWriteRepository,
} from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

/**
 * Service responsible for asserting that a location exists in the write repository.
 * This service encapsulates the logic for verifying the existence of a location and throws
 * appropriate exceptions if it is not found.
 *
 * @implements {IBaseService<string, LocationAggregate>}
 */
@Injectable()
export class AssertLocationExistsService
	implements IBaseService<string, LocationAggregate>
{
	/**
	 * Logger instance for the service.
	 */
	private readonly logger = new Logger(AssertLocationExistsService.name);

	/**
	 * Creates an instance of AssertLocationExistsService.
	 *
	 * @param locationWriteRepository - Write repository for locations, injected via NestJS DI.
	 */
	constructor(
		@Inject(LOCATION_WRITE_REPOSITORY_TOKEN)
		private readonly locationWriteRepository: ILocationWriteRepository,
	) {}

	/**
	 * Asserts that a location exists by its ID.
	 *
	 * @param id - The unique identifier for the location.
	 * @returns A promise that resolves to the {@link LocationAggregate} if found.
	 * @throws {@link LocationNotFoundException} if the location does not exist.
	 */
	async execute(id: string): Promise<LocationAggregate> {
		this.logger.log(`Asserting location exists by id: ${id}`);

		// 01: Find the location by id
		const existingLocation =
			await this.locationWriteRepository.findById(id);

		// 02: If the location does not exist, throw an error
		if (!existingLocation) {
			this.logger.error(`Location not found by id: ${id}`);
			throw new LocationNotFoundException(id);
		}

		return existingLocation;
	}
}

