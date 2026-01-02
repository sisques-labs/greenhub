import { Test } from '@nestjs/testing';

import { LocationNotFoundException } from '@/core/location-context/application/exceptions/location/location-not-found/location-not-found.exception';
import { AssertLocationViewModelExistsService } from '@/core/location-context/application/services/location/assert-location-view-model-exists/assert-location-view-model-exists.service';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import {
	LOCATION_READ_REPOSITORY_TOKEN,
	ILocationReadRepository,
} from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';

describe('AssertLocationViewModelExistsService', () => {
	let service: AssertLocationViewModelExistsService;
	let mockLocationReadRepository: jest.Mocked<ILocationReadRepository>;

	beforeEach(async () => {
		mockLocationReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<ILocationReadRepository>;

		const module = await Test.createTestingModule({
			providers: [
				AssertLocationViewModelExistsService,
				{
					provide: LOCATION_READ_REPOSITORY_TOKEN,
					useValue: mockLocationReadRepository,
				},
			],
		}).compile();

		service = module.get<AssertLocationViewModelExistsService>(
			AssertLocationViewModelExistsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return location view model when found', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const now = new Date();
			const mockViewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt: now,
				updatedAt: now,
			});

			mockLocationReadRepository.findById.mockResolvedValue(mockViewModel);

			const result = await service.execute(locationId);

			expect(result).toBe(mockViewModel);
			expect(mockLocationReadRepository.findById).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockLocationReadRepository.findById).toHaveBeenCalledTimes(1);
		});

		it('should throw LocationNotFoundException when location does not exist', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			mockLocationReadRepository.findById.mockResolvedValue(null);

			await expect(service.execute(locationId)).rejects.toThrow(
				LocationNotFoundException,
			);
			expect(mockLocationReadRepository.findById).toHaveBeenCalledWith(
				locationId,
			);
		});

		it('should throw exception with correct message', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			mockLocationReadRepository.findById.mockResolvedValue(null);

			await expect(service.execute(locationId)).rejects.toThrow(
				`Location with id ${locationId} not found`,
			);
		});
	});
});

