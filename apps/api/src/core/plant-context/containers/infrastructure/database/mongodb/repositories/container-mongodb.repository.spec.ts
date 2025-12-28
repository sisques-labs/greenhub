import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerMongoDbDto } from '@/core/plant-context/containers/infrastructure/database/mongodb/dtos/container-mongodb.dto';
import { ContainerMongoDBMapper } from '@/core/plant-context/containers/infrastructure/database/mongodb/mappers/container-mongodb.mapper';
import { ContainerMongoRepository } from '@/core/plant-context/containers/infrastructure/database/mongodb/repositories/container-mongodb.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Collection } from 'mongodb';

describe('ContainerMongoRepository', () => {
  let repository: ContainerMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockContainerMongoDBMapper: jest.Mocked<ContainerMongoDBMapper>;
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

    mockContainerMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<ContainerMongoDBMapper>;

    repository = new ContainerMongoRepository(
      mockMongoMasterService,
      mockContainerMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return container view model when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: ContainerMongoDbDto = {
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      };

      const viewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockContainerMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(containerId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'containers',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: containerId,
      });
      expect(mockContainerMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      });
      expect(mockContainerMongoDBMapper.toViewModel).toHaveBeenCalledTimes(1);
    });

    it('should return null when container does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(containerId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: containerId,
      });
      expect(mockContainerMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });

    it('should handle MongoDB errors correctly', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const mongoError = new Error('Database connection error');

      mockCollection.findOne.mockRejectedValue(mongoError);

      await expect(repository.findById(containerId)).rejects.toThrow(
        mongoError,
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: containerId,
      });
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with containers when criteria matches', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: ContainerMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          numberOfPlants: 5,
          createdAt,
          updatedAt,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Pot 1',
          type: ContainerTypeEnum.POT,
          numberOfPlants: 1,
          createdAt,
          updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new ContainerViewModel({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            plants: [],
            numberOfPlants: doc.numberOfPlants,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(2);

      mongoDocs.forEach((doc, index) => {
        mockContainerMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCursor.sort).toHaveBeenCalled();
      expect(mockCursor.skip).toHaveBeenCalledWith(0);
      expect(mockCursor.limit).toHaveBeenCalledWith(10);
      expect(mockCollection.countDocuments).toHaveBeenCalled();
    });

    it('should return empty paginated result when no containers match criteria', async () => {
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockContainerMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });

    it('should handle criteria with filters', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria(
        [
          {
            field: 'type',
            operator: FilterOperator.EQUALS,
            value: ContainerTypeEnum.GARDEN_BED,
          },
        ],
        [],
        { page: 1, perPage: 10 },
      );

      const mongoDocs: ContainerMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          numberOfPlants: 5,
          createdAt,
          updatedAt,
        },
      ];

      const viewModel = new ContainerViewModel({
        id: mongoDocs[0].id,
        name: mongoDocs[0].name,
        type: mongoDocs[0].type,
        plants: [],
        numberOfPlants: mongoDocs[0].numberOfPlants,
        createdAt: mongoDocs[0].createdAt,
        updatedAt: mongoDocs[0].updatedAt,
      });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(1);
      mockContainerMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].type).toBe(ContainerTypeEnum.GARDEN_BED);
      expect(mockCollection.find).toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 20 });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await repository.findByCriteria(criteria);

      expect(result.page).toBe(2);
      expect(result.perPage).toBe(20);
      expect(mockCursor.skip).toHaveBeenCalledWith(20);
      expect(mockCursor.limit).toHaveBeenCalledWith(20);
    });
  });

  describe('save', () => {
    it('should save container view model successfully', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      });

      const mongoData: ContainerMongoDbDto = {
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      };

      mockContainerMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      } as any);

      await repository.save(viewModel);

      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'containers',
      );
      expect(mockContainerMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: containerId },
        { ...mongoData },
        { upsert: true },
      );
    });

    it('should handle MongoDB errors correctly', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt,
        updatedAt,
      });

      const mongoData: ContainerMongoDbDto = {
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        numberOfPlants: 0,
        createdAt,
        updatedAt,
      };

      const mongoError = new Error('Database connection error');

      mockContainerMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockRejectedValue(mongoError);

      await expect(repository.save(viewModel)).rejects.toThrow(mongoError);
      expect(mockContainerMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
    });
  });

  describe('delete', () => {
    it('should delete container view model successfully', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      } as any);

      await repository.delete(containerId);

      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'containers',
      );
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: containerId,
        tenantId: 'test-tenant-123',
      });
      expect(mockCollection.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should handle MongoDB errors correctly', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const mongoError = new Error('Database connection error');

      mockCollection.deleteOne.mockRejectedValue(mongoError);

      await expect(repository.delete(containerId)).rejects.toThrow(mongoError);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: containerId,
        tenantId: 'test-tenant-123',
      });
    });
  });
});
