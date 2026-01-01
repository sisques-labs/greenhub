import { Test } from '@nestjs/testing';

import { LocationFindByCriteriaQueryHandler } from '@/core/location-context/application/queries/location/location-find-by-criteria/location-find-by-criteria.query-handler';
import { LocationFindByCriteriaQuery } from '@/core/location-context/application/queries/location/location-find-by-criteria/location-find-by-criteria.query';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import {
	LOCATION_READ_REPOSITORY_TOKEN,
	ILocationReadRepository,
} from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('LocationFindByCriteriaQueryHandler', () => {
	let handler: LocationFindByCriteriaQueryHandler;
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
				LocationFindByCriteriaQueryHandler,
				{
					provide: LOCATION_READ_REPOSITORY_TOKEN,
					useValue: mockLocationReadRepository,
				},
			],
		}).compile();

		handler = module.get<LocationFindByCriteriaQueryHandler>(
			LocationFindByCriteriaQueryHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return paginated result when criteria matches', async () => {
			const criteria = new Criteria();
			const query = new LocationFindByCriteriaQuery(criteria);
			const now = new Date();
			const mockViewModels = [
				new LocationViewModel({
					id: '123e4567-e89b-12d3-a456-426614174000',
					name: 'Living Room',
					type: LocationTypeEnum.ROOM,
					description: 'North-facing room',
					totalGrowingUnits: 5,
					totalPlants: 12,
					createdAt: now,
					updatedAt: now,
				}),
				new LocationViewModel({
					id: '223e4567-e89b-12d3-a456-426614174000',
					name: 'Balcony',
					type: LocationTypeEnum.BALCONY,
					description: 'South-facing balcony',
					totalGrowingUnits: 3,
					totalPlants: 8,
					createdAt: now,
					updatedAt: now,
				}),
			];

			const mockPaginatedResult = new PaginatedResult<LocationViewModel>(
				mockViewModels,
				2,
				1,
				10,
			);

			mockLocationReadRepository.findByCriteria.mockResolvedValue(
				mockPaginatedResult,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockPaginatedResult);
			expect(mockLocationReadRepository.findByCriteria).toHaveBeenCalledWith(
				criteria,
			);
			expect(
				mockLocationReadRepository.findByCriteria,
			).toHaveBeenCalledTimes(1);
		});

		it('should return empty paginated result when no matches found', async () => {
			const criteria = new Criteria();
			const query = new LocationFindByCriteriaQuery(criteria);
			const mockPaginatedResult = new PaginatedResult<LocationViewModel>(
				[],
				0,
				1,
				10,
			);

			mockLocationReadRepository.findByCriteria.mockResolvedValue(
				mockPaginatedResult,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockPaginatedResult);
			expect(result.items).toHaveLength(0);
			expect(result.total).toBe(0);
		});
	});
});

