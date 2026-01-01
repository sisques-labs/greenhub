import { ILocationViewModelFindByIdQueryDto } from '@/core/location-context/application/dtos/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.dto';
import { LocationNotFoundException } from '@/core/location-context/application/exceptions/location/location-not-found/location-not-found.exception';
import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { LocationViewModelFindByIdQueryHandler } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query-handler';
import { AssertLocationViewModelExistsService } from '@/core/location-context/application/services/location/assert-location-view-model-exists/assert-location-view-model-exists.service';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';

describe('LocationViewModelFindByIdQueryHandler', () => {
	let handler: LocationViewModelFindByIdQueryHandler;
	let mockAssertLocationViewModelExistsService: jest.Mocked<AssertLocationViewModelExistsService>;

	beforeEach(() => {
		mockAssertLocationViewModelExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertLocationViewModelExistsService>;

		handler = new LocationViewModelFindByIdQueryHandler(
			mockAssertLocationViewModelExistsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return location view model when found', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const queryDto: ILocationViewModelFindByIdQueryDto = {
				id: locationId,
			};

			const query = new LocationViewModelFindByIdQuery(queryDto);
			const now = new Date();
			const mockViewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				totalGrowingUnits: 5,
				totalPlants: 12,
				createdAt: now,
				updatedAt: now,
			});

			mockAssertLocationViewModelExistsService.execute.mockResolvedValue(
				mockViewModel,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockViewModel);
			expect(
				mockAssertLocationViewModelExistsService.execute,
			).toHaveBeenCalledWith(locationId);
			expect(
				mockAssertLocationViewModelExistsService.execute,
			).toHaveBeenCalledTimes(1);
		});

		it('should throw LocationNotFoundException when location does not exist', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const queryDto: ILocationViewModelFindByIdQueryDto = {
				id: locationId,
			};

			const query = new LocationViewModelFindByIdQuery(queryDto);
			const error = new LocationNotFoundException(locationId);

			mockAssertLocationViewModelExistsService.execute.mockRejectedValue(
				error,
			);

			await expect(handler.execute(query)).rejects.toThrow(error);
			expect(
				mockAssertLocationViewModelExistsService.execute,
			).toHaveBeenCalledWith(locationId);
		});
	});
});

