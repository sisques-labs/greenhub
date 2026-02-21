import { Collection } from 'mongodb';

import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesCategoryValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-category/plant-species-category.vo';
import { PlantSpeciesDifficultyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-difficulty/plant-species-difficulty.vo';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { PlantSpeciesMongoDbDto } from '@/core/plant-species-context/infrastructure/database/mongodb/dtos/plant-species/plant-species-mongodb.dto';
import { PlantSpeciesMongoDBMapper } from '@/core/plant-species-context/infrastructure/database/mongodb/mappers/plant-species/plant-species-mongodb.mapper';
import { PlantSpeciesMongoRepository } from '@/core/plant-species-context/infrastructure/database/mongodb/repositories/plant-species/plant-species-mongodb.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

const makeMongoDto = (overrides: Partial<PlantSpeciesMongoDbDto> = {}): PlantSpeciesMongoDbDto => ({
	id: '123e4567-e89b-12d3-a456-426614174000',
	commonName: 'Tomato',
	scientificName: 'Solanum lycopersicum',
	family: 'Solanaceae',
	description: 'A common garden vegetable',
	category: PlantSpeciesCategoryEnum.VEGETABLE,
	difficulty: PlantSpeciesDifficultyEnum.EASY,
	growthRate: 'FAST',
	lightRequirements: 'FULL_SUN',
	waterRequirements: 'MODERATE',
	temperatureRange: { min: 15, max: 30 },
	humidityRequirements: 'MODERATE',
	soilType: 'LOAMY',
	phRange: { min: 6.0, max: 6.8 },
	matureSize: { height: 150, width: 60 },
	growthTime: 90,
	tags: ['vegetable', 'annual'],
	isVerified: true,
	contributorId: null,
	createdAt: new Date('2024-01-01'),
	updatedAt: new Date('2024-01-02'),
	deletedAt: null,
	...overrides,
});

const makeViewModel = (overrides: Partial<ConstructorParameters<typeof PlantSpeciesViewModel>[0]> = {}): PlantSpeciesViewModel =>
	new PlantSpeciesViewModel({
		id: '123e4567-e89b-12d3-a456-426614174000',
		commonName: 'Tomato',
		scientificName: 'Solanum lycopersicum',
		family: 'Solanaceae',
		description: 'A common garden vegetable',
		category: PlantSpeciesCategoryEnum.VEGETABLE,
		difficulty: PlantSpeciesDifficultyEnum.EASY,
		growthRate: 'FAST',
		lightRequirements: 'FULL_SUN',
		waterRequirements: 'MODERATE',
		temperatureRange: { min: 15, max: 30 },
		humidityRequirements: 'MODERATE',
		soilType: 'LOAMY',
		phRange: { min: 6.0, max: 6.8 },
		matureSize: { height: 150, width: 60 },
		growthTime: 90,
		tags: ['vegetable', 'annual'],
		isVerified: true,
		contributorId: null,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-02'),
		...overrides,
	});

describe('PlantSpeciesMongoRepository', () => {
	let repository: PlantSpeciesMongoRepository;
	let mockMongoMasterService: jest.Mocked<MongoMasterService>;
	let mockPlantSpeciesMongoDBMapper: jest.Mocked<PlantSpeciesMongoDBMapper>;
	let mockCollection: jest.Mocked<Collection>;

	beforeEach(() => {
		mockCollection = {
			findOne: jest.fn(),
			find: jest.fn(),
			replaceOne: jest.fn(),
			deleteOne: jest.fn(),
			countDocuments: jest.fn(),
		} as unknown as jest.Mocked<Collection>;

		mockMongoMasterService = {
			getCollection: jest.fn().mockReturnValue(mockCollection),
		} as unknown as jest.Mocked<MongoMasterService>;

		mockPlantSpeciesMongoDBMapper = {
			toViewModel: jest.fn(),
			toMongoData: jest.fn(),
		} as unknown as jest.Mocked<PlantSpeciesMongoDBMapper>;

		repository = new PlantSpeciesMongoRepository(
			mockMongoMasterService,
			mockPlantSpeciesMongoDBMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findById', () => {
		it('should return view model when plant species exists', async () => {
			const speciesId = '123e4567-e89b-12d3-a456-426614174000';
			const mongoDoc = makeMongoDto({ id: speciesId });
			const viewModel = makeViewModel({ id: speciesId });

			mockCollection.findOne.mockResolvedValue(mongoDoc);
			mockPlantSpeciesMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findById(speciesId);

			expect(result).toBe(viewModel);
			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				'plant-species',
			);
			expect(mockCollection.findOne).toHaveBeenCalledWith({ id: speciesId });
			expect(mockPlantSpeciesMongoDBMapper.toViewModel).toHaveBeenCalled();
		});

		it('should return null when plant species does not exist', async () => {
			const speciesId = '123e4567-e89b-12d3-a456-426614174000';

			mockCollection.findOne.mockResolvedValue(null);

			const result = await repository.findById(speciesId);

			expect(result).toBeNull();
			expect(mockCollection.findOne).toHaveBeenCalledWith({ id: speciesId });
			expect(mockPlantSpeciesMongoDBMapper.toViewModel).not.toHaveBeenCalled();
		});
	});

	describe('findByCriteria', () => {
		it('should return paginated result with plant species when criteria matches', async () => {
			const criteria = new Criteria([], [], { page: 1, perPage: 10 });
			const mongoDocs = [
				makeMongoDto({ id: '123e4567-e89b-12d3-a456-426614174000' }),
				makeMongoDto({
					id: '223e4567-e89b-12d3-a456-426614174001',
					scientificName: 'Capsicum annuum',
				}),
			];
			const viewModel1 = makeViewModel({ id: '123e4567-e89b-12d3-a456-426614174000' });
			const viewModel2 = makeViewModel({ id: '223e4567-e89b-12d3-a456-426614174001' });

			const findChain = {
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				toArray: jest.fn().mockResolvedValue(mongoDocs),
			};

			(mockCollection.find as jest.Mock).mockReturnValue(findChain);
			mockCollection.countDocuments.mockResolvedValue(2);
			mockPlantSpeciesMongoDBMapper.toViewModel
				.mockReturnValueOnce(viewModel1)
				.mockReturnValueOnce(viewModel2);

			const result = await repository.findByCriteria(criteria);

			expect(result).toBeInstanceOf(PaginatedResult);
			expect(result.items).toHaveLength(2);
			expect(result.items[0]).toBe(viewModel1);
			expect(result.items[1]).toBe(viewModel2);
			expect(result.total).toBe(2);
			expect(result.page).toBe(1);
			expect(result.perPage).toBe(10);
		});
	});

	describe('save', () => {
		it('should save plant species view model using upsert', async () => {
			const speciesId = '123e4567-e89b-12d3-a456-426614174000';
			const viewModel = makeViewModel({ id: speciesId });
			const mongoData = makeMongoDto({ id: speciesId });

			mockPlantSpeciesMongoDBMapper.toMongoData.mockReturnValue(mongoData);
			mockCollection.replaceOne.mockResolvedValue({
				acknowledged: true,
				matchedCount: 1,
				modifiedCount: 1,
				upsertedCount: 0,
				upsertedId: null,
			} as any);

			await repository.save(viewModel);

			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				'plant-species',
			);
			expect(mockPlantSpeciesMongoDBMapper.toMongoData).toHaveBeenCalledWith(
				viewModel,
			);
			expect(mockCollection.replaceOne).toHaveBeenCalledWith(
				{ id: speciesId },
				mongoData,
				{ upsert: true },
			);
		});
	});

	describe('delete', () => {
		it('should delete plant species view model by id', async () => {
			const speciesId = '123e4567-e89b-12d3-a456-426614174000';

			mockCollection.deleteOne.mockResolvedValue({
				acknowledged: true,
				deletedCount: 1,
			} as any);

			await repository.delete(speciesId);

			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				'plant-species',
			);
			expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: speciesId });
		});
	});

	describe('findByCategory', () => {
		it('should return array of plant species view models matching the category', async () => {
			const category = new PlantSpeciesCategoryValueObject(
				PlantSpeciesCategoryEnum.VEGETABLE,
			);
			const mongoDocs = [makeMongoDto()];
			const viewModel = makeViewModel();

			const findChain = { toArray: jest.fn().mockResolvedValue(mongoDocs) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);
			mockPlantSpeciesMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findByCategory(category);

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(viewModel);
			expect(mockCollection.find).toHaveBeenCalledWith({
				category: PlantSpeciesCategoryEnum.VEGETABLE,
			});
		});

		it('should return empty array when no plant species found for category', async () => {
			const category = new PlantSpeciesCategoryValueObject(
				PlantSpeciesCategoryEnum.FERN,
			);

			const findChain = { toArray: jest.fn().mockResolvedValue([]) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);

			const result = await repository.findByCategory(category);

			expect(result).toEqual([]);
			expect(mockPlantSpeciesMongoDBMapper.toViewModel).not.toHaveBeenCalled();
		});
	});

	describe('findByDifficulty', () => {
		it('should return array of plant species view models matching the difficulty', async () => {
			const difficulty = new PlantSpeciesDifficultyValueObject(
				PlantSpeciesDifficultyEnum.EASY,
			);
			const mongoDocs = [makeMongoDto()];
			const viewModel = makeViewModel();

			const findChain = { toArray: jest.fn().mockResolvedValue(mongoDocs) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);
			mockPlantSpeciesMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findByDifficulty(difficulty);

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(viewModel);
			expect(mockCollection.find).toHaveBeenCalledWith({
				difficulty: PlantSpeciesDifficultyEnum.EASY,
			});
		});

		it('should return empty array when no plant species found for difficulty', async () => {
			const difficulty = new PlantSpeciesDifficultyValueObject(
				PlantSpeciesDifficultyEnum.HARD,
			);

			const findChain = { toArray: jest.fn().mockResolvedValue([]) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);

			const result = await repository.findByDifficulty(difficulty);

			expect(result).toEqual([]);
			expect(mockPlantSpeciesMongoDBMapper.toViewModel).not.toHaveBeenCalled();
		});
	});

	describe('findByTags', () => {
		it('should return array of plant species view models matching the tags', async () => {
			const tags = ['vegetable', 'annual'];
			const mongoDocs = [makeMongoDto()];
			const viewModel = makeViewModel();

			const findChain = { toArray: jest.fn().mockResolvedValue(mongoDocs) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);
			mockPlantSpeciesMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findByTags(tags);

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(viewModel);
			expect(mockCollection.find).toHaveBeenCalledWith({
				tags: { $in: tags },
			});
		});

		it('should return empty array when no plant species found for tags', async () => {
			const tags = ['exotic', 'tropical'];

			const findChain = { toArray: jest.fn().mockResolvedValue([]) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);

			const result = await repository.findByTags(tags);

			expect(result).toEqual([]);
			expect(mockPlantSpeciesMongoDBMapper.toViewModel).not.toHaveBeenCalled();
		});
	});

	describe('search', () => {
		it('should return array of plant species view models matching the search query', async () => {
			const query = 'tomato';
			const mongoDocs = [makeMongoDto()];
			const viewModel = makeViewModel();

			const findChain = { toArray: jest.fn().mockResolvedValue(mongoDocs) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);
			mockPlantSpeciesMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.search(query);

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(viewModel);
			expect(mockCollection.find).toHaveBeenCalledWith({
				$text: { $search: query },
			});
		});

		it('should return empty array when no plant species found for search query', async () => {
			const query = 'nonexistent plant';

			const findChain = { toArray: jest.fn().mockResolvedValue([]) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);

			const result = await repository.search(query);

			expect(result).toEqual([]);
			expect(mockPlantSpeciesMongoDBMapper.toViewModel).not.toHaveBeenCalled();
		});
	});

	describe('findVerified', () => {
		it('should return array of verified plant species view models', async () => {
			const mongoDocs = [makeMongoDto({ isVerified: true })];
			const viewModel = makeViewModel({ isVerified: true });

			const findChain = { toArray: jest.fn().mockResolvedValue(mongoDocs) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);
			mockPlantSpeciesMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findVerified();

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(viewModel);
			expect(mockCollection.find).toHaveBeenCalledWith({ isVerified: true });
		});

		it('should return empty array when no verified plant species exist', async () => {
			const findChain = { toArray: jest.fn().mockResolvedValue([]) };
			(mockCollection.find as jest.Mock).mockReturnValue(findChain);

			const result = await repository.findVerified();

			expect(result).toEqual([]);
			expect(mockPlantSpeciesMongoDBMapper.toViewModel).not.toHaveBeenCalled();
		});
	});
});
