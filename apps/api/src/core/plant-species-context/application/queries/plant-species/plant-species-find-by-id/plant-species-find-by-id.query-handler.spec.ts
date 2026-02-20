import type { IPlantSpeciesFindByIdQueryDto } from '@/core/plant-species-context/application/dtos/queries/plant-species/plant-species-find-by-id/plant-species-find-by-id.dto';
import { PlantSpeciesFindByIdQuery } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-id/plant-species-find-by-id.query';
import { PlantSpeciesFindByIdQueryHandler } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-id/plant-species-find-by-id.query-handler';
import type { AssertPlantSpeciesViewModelExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-view-model-exists/assert-plant-species-view-model-exists.service';
import { PlantSpeciesNotFoundException } from '@/core/plant-species-context/domain/exceptions/plant-species-not-found/plant-species-not-found.exception';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

describe('PlantSpeciesFindByIdQueryHandler', () => {
	let handler: PlantSpeciesFindByIdQueryHandler;
	let mockAssertPlantSpeciesViewModelExistsService: jest.Mocked<AssertPlantSpeciesViewModelExistsService>;

	beforeEach(() => {
		mockAssertPlantSpeciesViewModelExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertPlantSpeciesViewModelExistsService>;

		handler = new PlantSpeciesFindByIdQueryHandler(
			mockAssertPlantSpeciesViewModelExistsService,
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
			const queryDto: IPlantSpeciesFindByIdQueryDto = { id: plantSpeciesId };
			const query = new PlantSpeciesFindByIdQuery(queryDto);

			mockAssertPlantSpeciesViewModelExistsService.execute.mockResolvedValue(
				mockViewModel,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockViewModel);
			expect(
				mockAssertPlantSpeciesViewModelExistsService.execute,
			).toHaveBeenCalledWith(plantSpeciesId);
			expect(
				mockAssertPlantSpeciesViewModelExistsService.execute,
			).toHaveBeenCalledTimes(1);
		});

		it('should throw PlantSpeciesNotFoundException when plant species does not exist', async () => {
			const queryDto: IPlantSpeciesFindByIdQueryDto = { id: plantSpeciesId };
			const query = new PlantSpeciesFindByIdQuery(queryDto);
			const error = new PlantSpeciesNotFoundException(plantSpeciesId);

			mockAssertPlantSpeciesViewModelExistsService.execute.mockRejectedValue(
				error,
			);

			await expect(handler.execute(query)).rejects.toThrow(error);
			expect(
				mockAssertPlantSpeciesViewModelExistsService.execute,
			).toHaveBeenCalledWith(plantSpeciesId);
		});
	});
});
