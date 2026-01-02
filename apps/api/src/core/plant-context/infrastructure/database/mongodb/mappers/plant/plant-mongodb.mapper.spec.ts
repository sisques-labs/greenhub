import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import { LocationViewModelBuilder } from '@/core/plant-context/domain/builders/location/location-view-model.builder';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { PlantMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/plant/plant-mongodb.dto';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';

describe('PlantMongoDBMapper', () => {
	let mapper: PlantMongoDBMapper;
	let mockPlantViewModelBuilder: jest.Mocked<PlantViewModelBuilder>;
	let mockLocationViewModelBuilder: jest.Mocked<LocationViewModelBuilder>;

	beforeEach(() => {
		mockPlantViewModelBuilder = {
			reset: jest.fn().mockReturnThis(),
			withId: jest.fn().mockReturnThis(),
			withGrowingUnitId: jest.fn().mockReturnThis(),
			withName: jest.fn().mockReturnThis(),
			withSpecies: jest.fn().mockReturnThis(),
			withPlantedDate: jest.fn().mockReturnThis(),
			withNotes: jest.fn().mockReturnThis(),
			withStatus: jest.fn().mockReturnThis(),
			withCreatedAt: jest.fn().mockReturnThis(),
			withUpdatedAt: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<PlantViewModelBuilder>;

		mockLocationViewModelBuilder = {
			reset: jest.fn().mockReturnThis(),
			withId: jest.fn().mockReturnThis(),
			withName: jest.fn().mockReturnThis(),
			withType: jest.fn().mockReturnThis(),
			withDescription: jest.fn().mockReturnThis(),
			withCreatedAt: jest.fn().mockReturnThis(),
			withUpdatedAt: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<LocationViewModelBuilder>;

		mapper = new PlantMongoDBMapper(
			mockPlantViewModelBuilder,
			mockLocationViewModelBuilder,
		);
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

			mockPlantViewModelBuilder.build.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockPlantViewModelBuilder.build).toHaveBeenCalledWith({
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
			expect(mockPlantViewModelBuilder.build).toHaveBeenCalledTimes(1);
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

			mockPlantViewModelBuilder.build.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockPlantViewModelBuilder.build).toHaveBeenCalledWith({
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

			mockPlantViewModelBuilder.build.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockPlantViewModelBuilder.build).toHaveBeenCalledWith({
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
