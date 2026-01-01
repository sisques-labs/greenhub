import { Collection } from 'mongodb';

import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/growing-unit/growing-unit-mongodb.dto';
import { GrowingUnitMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/growing-unit/growing-unit-mongodb.mapper';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';
import { GrowingUnitMongoRepository } from '@/core/plant-context/infrastructure/database/mongodb/repositories/growing-unit-mongodb.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

describe('GrowingUnitMongoRepository', () => {
	let repository: GrowingUnitMongoRepository;
	let mockMongoMasterService: jest.Mocked<MongoMasterService>;
	let mockGrowingUnitMongoDBMapper: jest.Mocked<GrowingUnitMongoDBMapper>;
	let mockPlantMongoDBMapper: jest.Mocked<PlantMongoDBMapper>;
	let mockCollection: jest.Mocked<Collection>;

	beforeEach(() => {
		const mockFind = jest.fn();
		const mockSort = jest.fn();
		const mockSkip = jest.fn();
		const mockLimit = jest.fn();
		const mockToArray = jest.fn();

		mockFind.mockReturnValue({
			sort: mockSort,
		});
		mockSort.mockReturnValue({
			skip: mockSkip,
		});
		mockSkip.mockReturnValue({
			limit: mockLimit,
		});
		mockLimit.mockReturnValue({
			toArray: mockToArray,
		});

		mockCollection = {
			findOne: jest.fn(),
			find: mockFind,
			replaceOne: jest.fn(),
			deleteOne: jest.fn(),
			countDocuments: jest.fn(),
		} as unknown as jest.Mocked<Collection>;

		mockMongoMasterService = {
			getCollection: jest.fn().mockReturnValue(mockCollection),
		} as unknown as jest.Mocked<MongoMasterService>;

		mockGrowingUnitMongoDBMapper = {
			toViewModel: jest.fn(),
			toMongoData: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitMongoDBMapper>;

		mockPlantMongoDBMapper = {
			toViewModel: jest.fn(),
			toMongoData: jest.fn(),
		} as unknown as jest.Mocked<PlantMongoDBMapper>;

		repository = new GrowingUnitMongoRepository(
			mockMongoMasterService,
			mockGrowingUnitMongoDBMapper,
			mockPlantMongoDBMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findById', () => {
		it('should return growing unit view model when growing unit exists', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const mongoDoc: GrowingUnitMongoDbDto = {
				id: growingUnitId,
				locationId,
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			};

			const viewModel = new GrowingUnitViewModel({
				id: growingUnitId,
				locationId,
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			});

			mockCollection.findOne.mockResolvedValue(mongoDoc);
			mockGrowingUnitMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findById(growingUnitId);

			expect(result).toBe(viewModel);
			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				'growing-units',
			);
			expect(mockCollection.findOne).toHaveBeenCalledWith({
				id: growingUnitId,
			});
			expect(mockGrowingUnitMongoDBMapper.toViewModel).toHaveBeenCalled();
		});

		it('should return null when growing unit does not exist', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';

			mockCollection.findOne.mockResolvedValue(null);

			const result = await repository.findById(growingUnitId);

			expect(result).toBeNull();
			expect(mockCollection.findOne).toHaveBeenCalledWith({
				id: growingUnitId,
			});
			expect(mockGrowingUnitMongoDBMapper.toViewModel).not.toHaveBeenCalled();
		});
	});

	describe('findByCriteria', () => {
		it('should return paginated result with growing units when criteria matches', async () => {
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');
			const criteria = new Criteria([], [], { page: 1, perPage: 10 });

			const mongoDocs: GrowingUnitMongoDbDto[] = [
				{
					id: '123e4567-e89b-12d3-a456-426614174000',
					locationId,
					name: 'Garden Bed 1',
					type: 'GARDEN_BED',
					capacity: 10,
					dimensions: null,
					plants: [],
					remainingCapacity: 10,
					numberOfPlants: 0,
					volume: 0,
					createdAt,
					updatedAt,
				},
				{
					id: '223e4567-e89b-12d3-a456-426614174001',
					locationId,
					name: 'Garden Bed 2',
					type: 'GARDEN_BED',
					capacity: 15,
					dimensions: null,
					plants: [],
					remainingCapacity: 15,
					numberOfPlants: 0,
					volume: 0,
					createdAt,
					updatedAt,
				},
			];

			const viewModel1 = new GrowingUnitViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				locationId,
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			});

			const viewModel2 = new GrowingUnitViewModel({
				id: '223e4567-e89b-12d3-a456-426614174001',
				locationId,
				name: 'Garden Bed 2',
				type: 'GARDEN_BED',
				capacity: 15,
				dimensions: null,
				plants: [],
				remainingCapacity: 15,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			});

			const findChain = {
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				toArray: jest.fn().mockResolvedValue(mongoDocs),
			};

			(mockCollection.find as jest.Mock).mockReturnValue(findChain);
			mockCollection.countDocuments.mockResolvedValue(2);
			mockGrowingUnitMongoDBMapper.toViewModel
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
		it('should save growing unit view model using upsert', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new GrowingUnitViewModel({
				id: growingUnitId,
				locationId,
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			});

			const mongoData: GrowingUnitMongoDbDto = {
				id: growingUnitId,
				locationId,
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			};

			mockGrowingUnitMongoDBMapper.toMongoData.mockReturnValue(mongoData);
			mockCollection.replaceOne.mockResolvedValue({
				acknowledged: true,
				matchedCount: 1,
				modifiedCount: 1,
				upsertedCount: 0,
				upsertedId: null,
			} as any);

			await repository.save(viewModel);

			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				'growing-units',
			);
			expect(mockGrowingUnitMongoDBMapper.toMongoData).toHaveBeenCalledWith(
				viewModel,
			);
			expect(mockCollection.replaceOne).toHaveBeenCalledWith(
				{ id: growingUnitId },
				mongoData,
				{ upsert: true },
			);
		});
	});

	describe('delete', () => {
		it('should delete growing unit view model by id', async () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';

			mockCollection.deleteOne.mockResolvedValue({
				acknowledged: true,
				deletedCount: 1,
			} as any);

			await repository.delete(growingUnitId);

			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				'growing-units',
			);
			expect(mockCollection.deleteOne).toHaveBeenCalledWith({
				id: growingUnitId,
			});
		});
	});

	describe('findByContainerId', () => {
		it('should return array of growing unit view models when growing units exist', async () => {
			const containerId = '223e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const mongoDocs: GrowingUnitMongoDbDto[] = [
				{
					id: '123e4567-e89b-12d3-a456-426614174000',
					locationId,
					name: 'Garden Bed 1',
					type: 'GARDEN_BED',
					capacity: 10,
					dimensions: null,
					plants: [],
					remainingCapacity: 10,
					numberOfPlants: 0,
					volume: 0,
					createdAt,
					updatedAt,
				},
			];

			const viewModel = new GrowingUnitViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				locationId,
				name: 'Garden Bed 1',
				type: 'GARDEN_BED',
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			});

			const findChain = {
				toArray: jest.fn().mockResolvedValue(mongoDocs),
			};

			(mockCollection.find as jest.Mock).mockReturnValue(findChain);
			mockGrowingUnitMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findByContainerId(containerId);

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(viewModel);
			expect(mockCollection.find).toHaveBeenCalledWith({
				containerId,
			});
		});
	});
});

