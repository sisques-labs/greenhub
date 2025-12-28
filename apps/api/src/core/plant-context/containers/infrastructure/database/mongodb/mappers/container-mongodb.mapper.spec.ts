import { IContainerCreateViewModelDto } from '@/core/plant-context/containers/domain/dtos/view-models/container-create/container-create-view-model.dto';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerViewModelFactory } from '@/core/plant-context/containers/domain/factories/container-view-model/container-view-model.factory';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerMongoDbDto } from '@/core/plant-context/containers/infrastructure/database/mongodb/dtos/container-mongodb.dto';
import { ContainerMongoDBMapper } from '@/core/plant-context/containers/infrastructure/database/mongodb/mappers/container-mongodb.mapper';

describe('ContainerMongoDBMapper', () => {
  let mapper: ContainerMongoDBMapper;
  let mockContainerViewModelFactory: jest.Mocked<ContainerViewModelFactory>;

  beforeEach(() => {
    mockContainerViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<ContainerViewModelFactory>;

    mapper = new ContainerMongoDBMapper(mockContainerViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: ContainerMongoDbDto = {
        id: containerId,
        tenantId: 'test-tenant-123',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      };

      const mockViewModelDto: IContainerCreateViewModelDto = {
        id: containerId,
        tenantId: 'test-tenant-123',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      };
      const mockViewModel = new ContainerViewModel(mockViewModelDto);

      mockContainerViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockContainerViewModelFactory.create).toHaveBeenCalledWith({
        id: containerId,
        tenantId: 'test-tenant-123',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 5,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      });
      expect(mockContainerViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document with different container types', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const testCases = [
        ContainerTypeEnum.POT,
        ContainerTypeEnum.GARDEN_BED,
        ContainerTypeEnum.HANGING_BASKET,
        ContainerTypeEnum.WINDOW_BOX,
      ];

      testCases.forEach((type) => {
        const mongoDoc: ContainerMongoDbDto = {
          id: containerId,
          tenantId: 'test-tenant-123',
          name: 'Container',
          type,
          numberOfPlants: 0,
          createdAt,
          updatedAt,
        };

        const mockViewModelDto: IContainerCreateViewModelDto = {
          id: containerId,
          tenantId: 'test-tenant-123',
          name: 'Container',
          type,
          plants: [],
          numberOfPlants: 0,
          createdAt,
          updatedAt,
        };
        const mockViewModel = new ContainerViewModel(mockViewModelDto);

        mockContainerViewModelFactory.create.mockReturnValue(mockViewModel);

        const result = mapper.toViewModel(mongoDoc);

        expect(result).toBe(mockViewModel);
        expect(result.type).toBe(type);

        jest.clearAllMocks();
      });
    });

    it('should convert MongoDB document with different numberOfPlants values', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const testCases = [0, 1, 5, 10, 100];

      testCases.forEach((numberOfPlants) => {
        const mongoDoc: ContainerMongoDbDto = {
          id: containerId,
          tenantId: 'test-tenant-123',
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          numberOfPlants,
          createdAt,
          updatedAt,
        };

        const mockViewModelDto: IContainerCreateViewModelDto = {
          id: containerId,
          tenantId: 'test-tenant-123',
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          plants: [],
          numberOfPlants,
          createdAt,
          updatedAt,
        };
        const mockViewModel = new ContainerViewModel(mockViewModelDto);

        mockContainerViewModelFactory.create.mockReturnValue(mockViewModel);

        const result = mapper.toViewModel(mongoDoc);

        expect(result).toBe(mockViewModel);
        expect(result.numberOfPlants).toBe(numberOfPlants);

        jest.clearAllMocks();
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert container view model to MongoDB document with all properties', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new ContainerViewModel({
        id: containerId,
        tenantId: 'test-tenant-123',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: containerId,
        tenantId: 'test-tenant-123',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      });
    });

    it('should convert container view model with different container types', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const testCases = [
        ContainerTypeEnum.POT,
        ContainerTypeEnum.GARDEN_BED,
        ContainerTypeEnum.HANGING_BASKET,
        ContainerTypeEnum.WINDOW_BOX,
      ];

      testCases.forEach((type) => {
        const viewModel = new ContainerViewModel({
          id: containerId,
          tenantId: 'test-tenant-123',
          name: 'Container',
          type,
          plants: [],
          numberOfPlants: 0,
          createdAt,
          updatedAt,
        });

        const result = mapper.toMongoData(viewModel);

        expect(result.type).toBe(type);
        expect(result.numberOfPlants).toBe(0);
      });
    });

    it('should convert container view model with different numberOfPlants values', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const testCases = [0, 1, 5, 10, 100];

      testCases.forEach((numberOfPlants) => {
        const viewModel = new ContainerViewModel({
          id: containerId,
          tenantId: 'test-tenant-123',
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          plants: [],
          numberOfPlants,
          createdAt,
          updatedAt,
        });

        const result = mapper.toMongoData(viewModel);

        expect(result.numberOfPlants).toBe(numberOfPlants);
      });
    });
  });
});
