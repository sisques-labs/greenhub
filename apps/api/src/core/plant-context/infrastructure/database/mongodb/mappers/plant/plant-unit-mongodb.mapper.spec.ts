import { IPlantCreateViewModelDto } from '@/core/plant-context/plants/domain/dtos/view-models/plant-create/plant-create-view-model.dto';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantViewModelFactory } from '@/core/plant-context/plants/domain/factories/plant-view-model/plant-view-model.factory';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { PlantMongoDbDto } from '@/core/plant-context/plants/infrastructure/database/mongodb/dtos/plant-mongodb.dto';
import { PlantMongoDBMapper } from '@/core/plant-context/plants/infrastructure/database/mongodb/mappers/plant-mongodb.mapper';

describe('PlantMongoDBMapper', () => {
  let mapper: PlantMongoDBMapper;
  let mockPlantViewModelFactory: jest.Mocked<PlantViewModelFactory>;

  beforeEach(() => {
    mockPlantViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<PlantViewModelFactory>;

    mapper = new PlantMongoDBMapper(mockPlantViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');
      const mongoDoc: PlantMongoDbDto = {
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      };

      const mockViewModelDto: IPlantCreateViewModelDto = {
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      };
      const mockViewModel = new PlantViewModel(mockViewModelDto);

      mockPlantViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockPlantViewModelFactory.create).toHaveBeenCalledWith({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      });
      expect(mockPlantViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document to view model with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: PlantMongoDbDto = {
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      };

      const mockViewModelDto: IPlantCreateViewModelDto = {
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      };
      const mockViewModel = new PlantViewModel(mockViewModelDto);

      mockPlantViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockPlantViewModelFactory.create).toHaveBeenCalledWith({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.PLANTED,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      });
    });

    it('should convert MongoDB document with different statuses', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const testCases = [
        PlantStatusEnum.PLANTED,
        PlantStatusEnum.GROWING,
        PlantStatusEnum.HARVESTED,
        PlantStatusEnum.DEAD,
      ];

      testCases.forEach((status) => {
        const mongoDoc: PlantMongoDbDto = {
          id: plantId,
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: null,
          notes: null,
          status,
          createdAt,
          updatedAt,
        };

        const mockViewModelDto: IPlantCreateViewModelDto = {
          id: plantId,
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: null,
          notes: null,
          status,
          createdAt,
          updatedAt,
        };
        const mockViewModel = new PlantViewModel(mockViewModelDto);

        mockPlantViewModelFactory.create.mockReturnValue(mockViewModel);

        const result = mapper.toViewModel(mongoDoc);

        expect(result).toBe(mockViewModel);
        expect(result.status).toBe(status);

        jest.clearAllMocks();
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert plant view model to MongoDB document with all properties', () => {
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

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
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
    });

    it('should convert plant view model to MongoDB document with null optional properties', () => {
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

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
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
    });
  });
});
