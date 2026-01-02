import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import { LocationViewModelBuilder } from '@/core/plant-context/domain/builders/location/location-view-model.builder';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { LocationMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/location/location-mongodb.dto';
import { GrowingUnitMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/growing-unit/growing-unit-mongodb.dto';
import { PlantMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/plant/plant-mongodb.dto';
import { LocationMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/location/location-mongodb.mapper';
import { GrowingUnitMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/growing-unit/growing-unit-mongodb.mapper';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';

describe('GrowingUnitMongoDBMapper', () => {
	let mapper: GrowingUnitMongoDBMapper;
	let mockPlantMongoDBMapper: jest.Mocked<PlantMongoDBMapper>;
	let mockLocationMongoDBMapper: jest.Mocked<LocationMongoDBMapper>;
	let mockGrowingUnitViewModelBuilder: jest.Mocked<GrowingUnitViewModelBuilder>;
	let mockPlantViewModelBuilder: jest.Mocked<PlantViewModelBuilder>;
	let mockLocationViewModelBuilder: jest.Mocked<LocationViewModelBuilder>;

	beforeEach(() => {
		mockPlantMongoDBMapper = {
			toViewModel: jest.fn(),
			toMongoData: jest.fn(),
		} as unknown as jest.Mocked<PlantMongoDBMapper>;

		mockLocationMongoDBMapper = {
			toViewModel: jest.fn(),
			toMongoData: jest.fn(),
		} as unknown as jest.Mocked<LocationMongoDBMapper>;

		mockGrowingUnitViewModelBuilder = {
			build: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitViewModelBuilder>;

		mockPlantViewModelBuilder = {
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

		mapper = new GrowingUnitMongoDBMapper(
			mockPlantMongoDBMapper,
			mockLocationMongoDBMapper,
			mockGrowingUnitViewModelBuilder,
			mockPlantViewModelBuilder,
			mockLocationViewModelBuilder,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('toViewModel', () => {
		it('should convert MongoDB document to view model with all properties', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const plantMongoDoc: PlantMongoDbDto = {
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt,
				updatedAt,
			};

			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const locationMongoDto: LocationMongoDbDto = {
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt,
				updatedAt,
			};

			const location = new LocationViewModel({
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt,
				updatedAt,
			});

			const mongoDoc: GrowingUnitMongoDbDto = {
				id: growingUnitId,
				location: locationMongoDto,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: {
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: LengthUnitEnum.METER,
				},
				plants: [plantMongoDoc],
				remainingCapacity: 9,
				numberOfPlants: 1,
				volume: 1.0,
				createdAt,
				updatedAt,
			};

			const plantViewModel = new PlantViewModel({
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt,
				updatedAt,
			});

			const viewModel = new GrowingUnitViewModel({
				id: growingUnitId,
				location,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: {
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: LengthUnitEnum.METER,
				},
				plants: [plantViewModel],
				remainingCapacity: 9,
				numberOfPlants: 1,
				volume: 1.0,
				createdAt,
				updatedAt,
			});

			mockLocationMongoDBMapper.toViewModel.mockReturnValue(location);
			mockPlantMongoDBMapper.toViewModel.mockReturnValue(plantViewModel);
			mockGrowingUnitViewModelBuilder.build.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockLocationMongoDBMapper.toViewModel).toHaveBeenCalledWith(
				locationMongoDto,
			);
			expect(mockPlantMongoDBMapper.toViewModel).toHaveBeenCalledWith(
				plantMongoDoc,
			);
			expect(mockGrowingUnitViewModelBuilder.build).toHaveBeenCalled();
		});

		it('should convert MongoDB document with null dimensions and no plants', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const locationMongoDto: LocationMongoDbDto = {
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt,
				updatedAt,
			};

			const location = new LocationViewModel({
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt,
				updatedAt,
			});

			const mongoDoc: GrowingUnitMongoDbDto = {
				id: growingUnitId,
				location: locationMongoDto,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
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
				location,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			});

			mockLocationMongoDBMapper.toViewModel.mockReturnValue(location);
			mockGrowingUnitViewModelBuilder.build.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockPlantMongoDBMapper.toViewModel).not.toHaveBeenCalled();
			expect(mockGrowingUnitViewModelBuilder.build).toHaveBeenCalled();
		});

		it('should handle date conversion when createdAt/updatedAt are strings', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = '2024-01-01T00:00:00.000Z';
			const updatedAt = '2024-01-02T00:00:00.000Z';

			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const locationMongoDto: LocationMongoDbDto = {
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt: new Date(createdAt),
				updatedAt: new Date(updatedAt),
			};

			const location = new LocationViewModel({
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt: new Date(createdAt),
				updatedAt: new Date(updatedAt),
			});

			const mongoDoc: any = {
				id: growingUnitId,
				location: locationMongoDto,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
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
				location,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt: new Date(createdAt),
				updatedAt: new Date(updatedAt),
			});

			mockLocationMongoDBMapper.toViewModel.mockReturnValue(location);
			mockGrowingUnitViewModelBuilder.build.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockGrowingUnitViewModelBuilder.build).toHaveBeenCalled();
		});
	});

	describe('toMongoData', () => {
		it('should convert view model to MongoDB document with all properties', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const locationMongoDto: LocationMongoDbDto = {
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt,
				updatedAt,
			};

			const location = new LocationViewModel({
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt,
				updatedAt,
			});

			const plantViewModel = new PlantViewModel({
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt,
				updatedAt,
			});

			const viewModel = new GrowingUnitViewModel({
				id: growingUnitId,
				location,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: {
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: LengthUnitEnum.METER,
				},
				plants: [plantViewModel],
				remainingCapacity: 9,
				numberOfPlants: 1,
				volume: 1.0,
				createdAt,
				updatedAt,
			});

			const plantMongoData: PlantMongoDbDto = {
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt,
				updatedAt,
			};

			mockLocationMongoDBMapper.toMongoData.mockReturnValue(locationMongoDto);
			mockPlantMongoDBMapper.toMongoData.mockReturnValue(plantMongoData);

			const result = mapper.toMongoData(viewModel);

			const { growingUnitId: _, ...plantMongoDataWithoutGrowingUnitId } =
				plantMongoData;
			expect(result).toEqual({
				id: growingUnitId,
				location: locationMongoDto,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: {
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: LengthUnitEnum.METER,
				},
				plants: [plantMongoDataWithoutGrowingUnitId],
				remainingCapacity: 9,
				numberOfPlants: 1,
				volume: 1.0,
				createdAt,
				updatedAt,
			});
			expect(mockLocationMongoDBMapper.toMongoData).toHaveBeenCalledWith(
				location,
			);
			expect(mockPlantMongoDBMapper.toMongoData).toHaveBeenCalledWith(
				plantViewModel,
			);
		});

		it('should convert view model with null dimensions and no plants', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const locationMongoDto: LocationMongoDbDto = {
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt,
				updatedAt,
			};

			const location = new LocationViewModel({
				id: locationId,
				name: 'Test Location',
				type: 'INDOOR',
				description: null,
				createdAt,
				updatedAt,
			});

			const viewModel = new GrowingUnitViewModel({
				id: growingUnitId,
				location,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			});

			mockLocationMongoDBMapper.toMongoData.mockReturnValue(locationMongoDto);

			const result = mapper.toMongoData(viewModel);

			expect(result).toEqual({
				id: growingUnitId,
				location: locationMongoDto,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt,
				updatedAt,
			});
			expect(mockLocationMongoDBMapper.toMongoData).toHaveBeenCalledWith(
				location,
			);
			expect(mockPlantMongoDBMapper.toMongoData).not.toHaveBeenCalled();
		});
	});
});
