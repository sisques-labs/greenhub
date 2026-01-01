import { Test } from '@nestjs/testing';

import { LocationNotFoundException } from '@/core/location-context/application/exceptions/location/location-not-found/location-not-found.exception';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import {
	LOCATION_WRITE_REPOSITORY_TOKEN,
	ILocationWriteRepository,
} from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('AssertLocationExistsService', () => {
	let service: AssertLocationExistsService;
	let mockLocationWriteRepository: jest.Mocked<ILocationWriteRepository>;

	beforeEach(async () => {
		mockLocationWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<ILocationWriteRepository>;

		const module = await Test.createTestingModule({
			providers: [
				AssertLocationExistsService,
				{
					provide: LOCATION_WRITE_REPOSITORY_TOKEN,
					useValue: mockLocationWriteRepository,
				},
			],
		}).compile();

		service = module.get<AssertLocationExistsService>(
			AssertLocationExistsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return location aggregate when found', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockLocationWriteRepository.findById.mockResolvedValue(mockLocation);

			const result = await service.execute(locationId);

			expect(result).toBe(mockLocation);
			expect(mockLocationWriteRepository.findById).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockLocationWriteRepository.findById).toHaveBeenCalledTimes(1);
		});

		it('should throw LocationNotFoundException when location does not exist', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			mockLocationWriteRepository.findById.mockResolvedValue(null);

			await expect(service.execute(locationId)).rejects.toThrow(
				LocationNotFoundException,
			);
			expect(mockLocationWriteRepository.findById).toHaveBeenCalledWith(
				locationId,
			);
		});

		it('should throw exception with correct message', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			mockLocationWriteRepository.findById.mockResolvedValue(null);

			await expect(service.execute(locationId)).rejects.toThrow(
				`Location with id ${locationId} not found`,
			);
		});
	});
});

