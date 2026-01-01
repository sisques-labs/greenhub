import { Collection } from 'mongodb';

import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { LocationMongoDbDto } from '@/core/location-context/infrastructure/database/mongodb/dtos/location/location-mongodb.dto';
import { LocationMongoDBMapper } from '@/core/location-context/infrastructure/database/mongodb/mappers/location/location-mongodb.mapper';
import { LocationMongoRepository } from '@/core/location-context/infrastructure/database/mongodb/repositories/location-mongodb.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

describe('LocationMongoRepository', () => {
	let repository: LocationMongoRepository;
	let mockMongoMasterService: jest.Mocked<MongoMasterService>;
	let mockLocationMongoDBMapper: jest.Mocked<LocationMongoDBMapper>;
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

		mockLocationMongoDBMapper = {
			toViewModel: jest.fn(),
			toMongoData: jest.fn(),
		} as unknown as jest.Mocked<LocationMongoDBMapper>;

		repository = new LocationMongoRepository(
			mockMongoMasterService,
			mockLocationMongoDBMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findById', () => {
		it('should return location view model when location exists', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const mongoDoc: LocationMongoDbDto = {
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			};

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});

			mockCollection.findOne.mockResolvedValue(mongoDoc);
			mockLocationMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findById(locationId);

			expect(result).toBe(viewModel);
			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				'locations',
			);
			expect(mockCollection.findOne).toHaveBeenCalledWith({
				id: locationId,
			});
			expect(mockLocationMongoDBMapper.toViewModel).toHaveBeenCalled();
		});

		it('should return null when location does not exist', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			mockCollection.findOne.mockResolvedValue(null);

			const result = await repository.findById(locationId);

			expect(result).toBeNull();
			expect(mockCollection.findOne).toHaveBeenCalledWith({
				id: locationId,
			});
			expect(mockLocationMongoDBMapper.toViewModel).not.toHaveBeenCalled();
		});
	});

	describe('findByCriteria', () => {
		it('should return paginated result with locations when criteria matches', async () => {
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');
			const criteria = new Criteria([], [], { page: 1, perPage: 10 });

			const mongoDocs: LocationMongoDbDto[] = [
				{
					id: '123e4567-e89b-12d3-a456-426614174000',
					name: 'Living Room',
					type: LocationTypeEnum.ROOM,
					description: 'North-facing room',
					createdAt,
					updatedAt,
				},
				{
					id: '223e4567-e89b-12d3-a456-426614174001',
					name: 'Balcony',
					type: LocationTypeEnum.BALCONY,
					description: 'South-facing balcony',
					createdAt,
					updatedAt,
				},
			];

			const viewModel1 = new LocationViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room',
				createdAt,
				updatedAt,
			});

			const viewModel2 = new LocationViewModel({
				id: '223e4567-e89b-12d3-a456-426614174001',
				name: 'Balcony',
				type: LocationTypeEnum.BALCONY,
				description: 'South-facing balcony',
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
			mockLocationMongoDBMapper.toViewModel
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
		it('should save location view model using upsert', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});

			const mongoData: LocationMongoDbDto = {
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			};

			mockLocationMongoDBMapper.toMongoData.mockReturnValue(mongoData);
			mockCollection.replaceOne.mockResolvedValue({
				acknowledged: true,
				matchedCount: 1,
				modifiedCount: 1,
				upsertedCount: 0,
				upsertedId: null,
			} as any);

			await repository.save(viewModel);

			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				'locations',
			);
			expect(mockLocationMongoDBMapper.toMongoData).toHaveBeenCalledWith(
				viewModel,
			);
			expect(mockCollection.replaceOne).toHaveBeenCalledWith(
				{ id: locationId },
				mongoData,
				{ upsert: true },
			);
		});
	});

	describe('delete', () => {
		it('should delete location view model by id', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			mockCollection.deleteOne.mockResolvedValue({
				acknowledged: true,
				deletedCount: 1,
			} as any);

			await repository.delete(locationId);

			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				'locations',
			);
			expect(mockCollection.deleteOne).toHaveBeenCalledWith({
				id: locationId,
			});
		});
	});
});
