import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { PlantMongoDbDto } from '@/core/plant-context/plants/infrastructure/database/mongodb/dtos/plant-mongodb.dto';
import { PlantMongoDBMapper } from '@/core/plant-context/plants/infrastructure/database/mongodb/mappers/plant-mongodb.mapper';
import { PlantMongoRepository } from '@/core/plant-context/plants/infrastructure/database/mongodb/repositories/plant-mongodb.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Collection } from 'mongodb';

describe('PlantMongoRepository', () => {
  let repository: PlantMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockTenantContextService: jest.Mocked<TenantContextService>;
  let mockPlantMongoDBMapper: jest.Mocked<PlantMongoDBMapper>;
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

    mockTenantContextService = {
      getTenantIdOrThrow: jest.fn().mockReturnValue('test-tenant-123'),
    } as unknown as jest.Mocked<TenantContextService>;

    mockPlantMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<PlantMongoDBMapper>;

    repository = new PlantMongoRepository(
      mockMongoMasterService,
      mockTenantContextService,
      mockPlantMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return plant view model when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');
      const mongoDoc: PlantMongoDbDto = {
        id: plantId,
        tenantId: 'test-tenant-123',
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      };

      const viewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockPlantMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(plantId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'plants',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: plantId,
        tenantId: 'test-tenant-123',
      });
      expect(mockPlantMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: plantId,
        tenantId: 'test-tenant-123',
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      });
      expect(mockPlantMongoDBMapper.toViewModel).toHaveBeenCalledTimes(1);
    });

    it('should return null when plant does not exist', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(plantId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: plantId,
        tenantId: 'test-tenant-123',
      });
      expect(mockPlantMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });

    it('should handle MongoDB errors correctly', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const mongoError = new Error('Database connection error');

      mockCollection.findOne.mockRejectedValue(mongoError);

      await expect(repository.findById(plantId)).rejects.toThrow(mongoError);
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: plantId,
        tenantId: 'test-tenant-123',
      });
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with plants when criteria matches', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: PlantMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: 'test-tenant-123',
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: plantedDate,
          notes: 'Keep in indirect sunlight',
          status: PlantStatusEnum.PLANTED,
          createdAt,
          updatedAt,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          tenantId: 'test-tenant-123',
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Basil',
          species: 'Ocimum basilicum',
          plantedDate: null,
          notes: null,
          status: PlantStatusEnum.GROWING,
          createdAt,
          updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new PlantViewModel({
            id: doc.id,
            tenantId: doc.tenantId,
            containerId: doc.containerId,
            name: doc.name,
            species: doc.species,
            plantedDate: doc.plantedDate,
            notes: doc.notes,
            status: doc.status,
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
        mockPlantMongoDBMapper.toViewModel.mockReturnValueOnce(
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

    it('should return empty paginated result when no plants match criteria', async () => {
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
      expect(mockPlantMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });

    it('should handle criteria with filters', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria(
        [
          {
            field: 'status',
            operator: FilterOperator.EQUALS,
            value: PlantStatusEnum.PLANTED,
          },
        ],
        [],
        { page: 1, perPage: 10 },
      );

      const mongoDocs: PlantMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: 'test-tenant-123',
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: new Date('2024-01-15'),
          notes: null,
          status: PlantStatusEnum.PLANTED,
          createdAt,
          updatedAt,
        },
      ];

      const viewModel = new PlantViewModel({
        id: mongoDocs[0].id,
        tenantId: mongoDocs[0].tenantId,
        containerId: mongoDocs[0].containerId,
        name: mongoDocs[0].name,
        species: mongoDocs[0].species,
        plantedDate: mongoDocs[0].plantedDate,
        notes: mongoDocs[0].notes,
        status: mongoDocs[0].status,
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
      mockPlantMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockCollection.find).toHaveBeenCalled();
    });

    it('should handle criteria with sorting', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria(
        [],
        [{ field: 'name', direction: SortDirection.ASC }],
        { page: 1, perPage: 10 },
      );

      const mongoDocs: PlantMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: 'test-tenant-123',
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: null,
          notes: null,
          status: PlantStatusEnum.PLANTED,
          createdAt,
          updatedAt,
        },
      ];

      const viewModel = new PlantViewModel({
        id: mongoDocs[0].id,
        tenantId: mongoDocs[0].tenantId,
        containerId: mongoDocs[0].containerId,
        name: mongoDocs[0].name,
        species: mongoDocs[0].species,
        plantedDate: mongoDocs[0].plantedDate,
        notes: mongoDocs[0].notes,
        status: mongoDocs[0].status,
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
      mockPlantMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      await repository.findByCriteria(criteria);

      expect(mockCursor.sort).toHaveBeenCalled();
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
    it('should save plant view model successfully', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');

      const viewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      });

      const mongoData: PlantMongoDbDto = {
        id: plantId,
        tenantId: 'test-tenant-123',
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      };

      mockPlantMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      } as any);

      await repository.save(viewModel);

      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'plants',
      );
      expect(mockPlantMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: plantId, tenantId: 'test-tenant-123' },
        { ...mongoData, tenantId: 'test-tenant-123' },
        { upsert: true },
      );
    });

    it('should handle MongoDB errors correctly', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      });

      const mongoData: PlantMongoDbDto = {
        id: plantId,
        tenantId: 'test-tenant-123',
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      };

      const mongoError = new Error('Database connection error');

      mockPlantMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockRejectedValue(mongoError);

      await expect(repository.save(viewModel)).rejects.toThrow(mongoError);
      expect(mockPlantMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
    });
  });

  describe('delete', () => {
    it('should delete plant view model successfully', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      } as any);

      await repository.delete(plantId);

      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'plants',
      );
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: plantId,
        tenantId: 'test-tenant-123',
      });
      expect(mockCollection.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should handle MongoDB errors correctly', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const mongoError = new Error('Database connection error');

      mockCollection.deleteOne.mockRejectedValue(mongoError);

      await expect(repository.delete(plantId)).rejects.toThrow(mongoError);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: plantId,
        tenantId: 'test-tenant-123',
      });
    });
  });
});
