import { Test } from '@nestjs/testing';

import { AssertPlantSpeciesViewModelExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-view-model-exists/assert-plant-species-view-model-exists.service';
import { PlantSpeciesNotFoundException } from '@/core/plant-species-context/domain/exceptions/plant-species-not-found/plant-species-not-found.exception';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

describe('AssertPlantSpeciesViewModelExistsService', () => {
	let service: AssertPlantSpeciesViewModelExistsService;
	let mockPlantSpeciesReadRepository: jest.Mocked<IPlantSpeciesReadRepository>;

	beforeEach(async () => {
		mockPlantSpeciesReadRepository = {
			findById: jest.fn(),
			findAll: jest.fn(),
			findByCriteria: jest.fn(),
			findByCategory: jest.fn(),
			findByDifficulty: jest.fn(),
			findByTags: jest.fn(),
			search: jest.fn(),
			findVerified: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IPlantSpeciesReadRepository>;

		const module = await Test.createTestingModule({
			providers: [
				AssertPlantSpeciesViewModelExistsService,
				{
					provide: PLANT_SPECIES_READ_REPOSITORY_TOKEN,
					useValue: mockPlantSpeciesReadRepository,
				},
			],
		}).compile();

		service = module.get<AssertPlantSpeciesViewModelExistsService>(
			AssertPlantSpeciesViewModelExistsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		const plantSpeciesId = '123e4567-e89b-12d3-a456-426614174000';
		const now = new Date();

		const mockViewModel = new PlantSpeciesViewModel({
			id: plantSpeciesId,
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

		it('should return plant species view model when found', async () => {
			mockPlantSpeciesReadRepository.findById.mockResolvedValue(mockViewModel);

			const result = await service.execute(plantSpeciesId);

			expect(result).toBe(mockViewModel);
			expect(mockPlantSpeciesReadRepository.findById).toHaveBeenCalledWith(
				plantSpeciesId,
			);
			expect(mockPlantSpeciesReadRepository.findById).toHaveBeenCalledTimes(1);
		});

		it('should throw PlantSpeciesNotFoundException when plant species does not exist', async () => {
			mockPlantSpeciesReadRepository.findById.mockResolvedValue(null);

			await expect(service.execute(plantSpeciesId)).rejects.toThrow(
				PlantSpeciesNotFoundException,
			);
			expect(mockPlantSpeciesReadRepository.findById).toHaveBeenCalledWith(
				plantSpeciesId,
			);
		});

		it('should throw exception with correct message', async () => {
			mockPlantSpeciesReadRepository.findById.mockResolvedValue(null);

			await expect(service.execute(plantSpeciesId)).rejects.toThrow(
				`Plant species with id ${plantSpeciesId} not found`,
			);
		});
	});
});
