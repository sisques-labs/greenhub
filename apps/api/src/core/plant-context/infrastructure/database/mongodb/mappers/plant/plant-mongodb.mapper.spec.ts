import { PlantViewModelFactory } from '@/core/plant-context/domain/factories/view-models/plant-view-model/plant-view-model.factory';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';
import { PlantMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/plant/plant-mongodb.dto';

describe('PlantMongoDBMapper', () => {
  let mapper: PlantMongoDBMapper;
  let mockPlantViewModelFactory: jest.Mocked<PlantViewModelFactory>;
  let plantViewModelFactory: PlantViewModelFactory;

  beforeEach(() => {
    plantViewModelFactory = new PlantViewModelFactory();

    mockPlantViewModelFactory = {
      create: jest.fn(),
      fromEntity: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<PlantViewModelFactory>;

    mapper = new PlantMongoDBMapper(mockPlantViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');

      const mongoDoc: PlantMongoDbDto = {
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: 'PLANTED',
        createdAt,
        updatedAt,
      };

      const viewModel = new PlantViewModel({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: 'PLANTED',
        createdAt,
        updatedAt,
      });

      mockPlantViewModelFactory.create.mockReturnValue(viewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(viewModel);
      expect(mockPlantViewModelFactory.create).toHaveBeenCalledWith({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: 'PLANTED',
        createdAt,
        updatedAt,
      });
      expect(mockPlantViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const mongoDoc: PlantMongoDbDto = {
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: 'GROWING',
        createdAt,
        updatedAt,
      };

      const viewModel = new PlantViewModel({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: 'GROWING',
        createdAt,
        updatedAt,
      });

      mockPlantViewModelFactory.create.mockReturnValue(viewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(viewModel);
      expect(mockPlantViewModelFactory.create).toHaveBeenCalledWith({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: 'GROWING',
        createdAt,
        updatedAt,
      });
    });

    it('should handle date conversion when createdAt/updatedAt are strings', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const createdAt = '2024-01-01T00:00:00.000Z';
      const updatedAt = '2024-01-02T00:00:00.000Z';

      const mongoDoc: any = {
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: 'PLANTED',
        createdAt,
        updatedAt,
      };

      const viewModel = new PlantViewModel({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: 'PLANTED',
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      });

      mockPlantViewModelFactory.create.mockReturnValue(viewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(viewModel);
      expect(mockPlantViewModelFactory.create).toHaveBeenCalledWith({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: 'PLANTED',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB document with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');

      const viewModel = new PlantViewModel({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: 'PLANTED',
        createdAt,
        updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: 'PLANTED',
        createdAt,
        updatedAt,
      });
    });

    it('should convert view model with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new PlantViewModel({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: 'GROWING',
        createdAt,
        updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: 'GROWING',
        createdAt,
        updatedAt,
      });
    });
  });
});
