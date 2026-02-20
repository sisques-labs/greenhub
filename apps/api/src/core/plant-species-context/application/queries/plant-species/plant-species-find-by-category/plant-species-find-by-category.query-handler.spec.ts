import type { IPlantSpeciesFindByCategoryQueryDto } from '@/core/plant-species-context/application/dtos/queries/plant-species/plant-species-find-by-category/plant-species-find-by-category.dto';
import { PlantSpeciesFindByCategoryQuery } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-category/plant-species-find-by-category.query';
import { PlantSpeciesFindByCategoryQueryHandler } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-category/plant-species-find-by-category.query-handler';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import type {
	IPlantSpeciesReadRepository,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

describe('PlantSpeciesFindByCategoryQueryHandler', () => {
	let handler: PlantSpeciesFindByCategoryQueryHandler;
	let mockPlantSpeciesReadRepository: jest.Mocked<IPlantSpeciesReadRepository>;

	beforeEach(() => {
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

		handler = new PlantSpeciesFindByCategoryQueryHandler(
			mockPlantSpeciesReadRepository,
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

		it('should return plant species view models for the given category', async () => {
			const queryDto: IPlantSpeciesFindByCategoryQueryDto = {
				category: PlantSpeciesCategoryEnum.VEGETABLE,
			};
			const query = new PlantSpeciesFindByCategoryQuery(queryDto);

			mockPlantSpeciesReadRepository.findByCategory.mockResolvedValue([
				mockViewModel,
			]);

			const result = await handler.execute(query);

			expect(result).toEqual([mockViewModel]);
			expect(
				mockPlantSpeciesReadRepository.findByCategory,
			).toHaveBeenCalledWith(query.category);
			expect(
				mockPlantSpeciesReadRepository.findByCategory,
			).toHaveBeenCalledTimes(1);
		});

		it('should return empty array when no plant species match the category', async () => {
			const queryDto: IPlantSpeciesFindByCategoryQueryDto = {
				category: PlantSpeciesCategoryEnum.FERN,
			};
			const query = new PlantSpeciesFindByCategoryQuery(queryDto);

			mockPlantSpeciesReadRepository.findByCategory.mockResolvedValue([]);

			const result = await handler.execute(query);

			expect(result).toEqual([]);
			expect(
				mockPlantSpeciesReadRepository.findByCategory,
			).toHaveBeenCalledWith(query.category);
		});
	});
});
