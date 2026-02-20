import { Test } from '@nestjs/testing';

import { PlantSpeciesFindByCriteriaQueryHandler } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-criteria/plant-species-find-by-criteria.query-handler';
import { PlantSpeciesFindByCriteriaQuery } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-criteria/plant-species-find-by-criteria.query';
import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('PlantSpeciesFindByCriteriaQueryHandler', () => {
	let handler: PlantSpeciesFindByCriteriaQueryHandler;
	let mockPlantSpeciesReadRepository: jest.Mocked<IPlantSpeciesReadRepository>;

	beforeEach(async () => {
		mockPlantSpeciesReadRepository = {
			findById: jest.fn(),
			findByCriteria: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IPlantSpeciesReadRepository>;

		const module = await Test.createTestingModule({
			providers: [
				PlantSpeciesFindByCriteriaQueryHandler,
				{
					provide: PLANT_SPECIES_READ_REPOSITORY_TOKEN,
					useValue: mockPlantSpeciesReadRepository,
				},
			],
		}).compile();

		handler = module.get<PlantSpeciesFindByCriteriaQueryHandler>(
			PlantSpeciesFindByCriteriaQueryHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		const now = new Date();

		const mockViewModel = new PlantSpeciesViewModel({
			id: '123e4567-e89b-12d3-a456-426614174000',
			commonName: 'Tomato',
			scientificName: 'Solanum lycopersicum',
			family: 'Solanaceae',
			description: 'A common garden plant',
			category: PlantSpeciesCategoryEnum.VEGETABLE,
			difficulty: PlantSpeciesDifficultyEnum.EASY,
			growthRate: 'FAST',
			lightRequirements: 'FULL_SUN',
			waterRequirements: 'MODERATE',
			temperatureRange: { min: 15, max: 30 },
			humidityRequirements: 'MODERATE',
			soilType: 'LOAMY',
			phRange: { min: 6.0, max: 6.8 },
			matureSize: { height: 150, width: 50 },
			growthTime: 90,
			tags: ['vegetable', 'summer'],
			isVerified: true,
			contributorId: null,
			createdAt: now,
			updatedAt: now,
		});

		it('should return paginated result when criteria matches', async () => {
			const criteria = new Criteria();
			const query = new PlantSpeciesFindByCriteriaQuery(criteria);
			const mockPaginatedResult = new PaginatedResult<PlantSpeciesViewModel>(
				[mockViewModel],
				1,
				1,
				10,
			);

			mockPlantSpeciesReadRepository.findByCriteria.mockResolvedValue(
				mockPaginatedResult,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockPaginatedResult);
			expect(
				mockPlantSpeciesReadRepository.findByCriteria,
			).toHaveBeenCalledWith(criteria);
			expect(
				mockPlantSpeciesReadRepository.findByCriteria,
			).toHaveBeenCalledTimes(1);
		});

		it('should return empty paginated result when no matches found', async () => {
			const criteria = new Criteria();
			const query = new PlantSpeciesFindByCriteriaQuery(criteria);
			const mockPaginatedResult = new PaginatedResult<PlantSpeciesViewModel>(
				[],
				0,
				1,
				10,
			);

			mockPlantSpeciesReadRepository.findByCriteria.mockResolvedValue(
				mockPaginatedResult,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockPaginatedResult);
			expect(result.items).toHaveLength(0);
			expect(result.total).toBe(0);
		});
	});
});
