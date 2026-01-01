import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { GrowingUnitMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/growing-unit/growing-unit-mongodb.dto';
import { PlantMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/plant/plant-mongodb.dto';
import { GrowingUnitMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/growing-unit/growing-unit-mongodb.mapper';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';

describe('GrowingUnitMongoDBMapper', () => {
	let mapper: GrowingUnitMongoDBMapper;
	let mockGrowingUnitViewModelFactory: jest.Mocked<GrowingUnitViewModelFactory>;
	let mockPlantMongoDBMapper: jest.Mocked<PlantMongoDBMapper>;

	beforeEach(() => {
		mockGrowingUnitViewModelFactory = {
			create: jest.fn(),
			fromAggregate: jest.fn(),
			fromPrimitives: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitViewModelFactory>;

		mockPlantMongoDBMapper = {
			toViewModel: jest.fn(),
			toMongoData: jest.fn(),
		} as unknown as jest.Mocked<PlantMongoDBMapper>;

		mapper = new GrowingUnitMongoDBMapper(
			mockGrowingUnitViewModelFactory,
			mockPlantMongoDBMapper,
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
			const mongoDoc: GrowingUnitMongoDbDto = {
				id: growingUnitId,
				locationId,
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
				locationId,
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

			mockPlantMongoDBMapper.toViewModel.mockReturnValue(plantViewModel);
			mockGrowingUnitViewModelFactory.create.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockPlantMongoDBMapper.toViewModel).toHaveBeenCalledWith(
				plantMongoDoc,
			);
			expect(mockGrowingUnitViewModelFactory.create).toHaveBeenCalledWith({
				id: growingUnitId,
				locationId,
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
		});

		it('should convert MongoDB document with null dimensions and no plants', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const mongoDoc: GrowingUnitMongoDbDto = {
				id: growingUnitId,
				locationId,
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
				locationId,
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

			mockGrowingUnitViewModelFactory.create.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockPlantMongoDBMapper.toViewModel).not.toHaveBeenCalled();
			expect(mockGrowingUnitViewModelFactory.create).toHaveBeenCalledWith({
				id: growingUnitId,
				locationId,
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
		});

		it('should handle date conversion when createdAt/updatedAt are strings', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = '2024-01-01T00:00:00.000Z';
			const updatedAt = '2024-01-02T00:00:00.000Z';

			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const mongoDoc: any = {
				id: growingUnitId,
				locationId,
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
				locationId,
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

			mockGrowingUnitViewModelFactory.create.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockGrowingUnitViewModelFactory.create).toHaveBeenCalledWith({
				id: growingUnitId,
				locationId,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			});
		});
	});

	describe('toMongoData', () => {
		it('should convert view model to MongoDB document with all properties', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

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
				locationId,
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

			mockPlantMongoDBMapper.toMongoData.mockReturnValue(plantMongoData);

			const result = mapper.toMongoData(viewModel);

			expect(result).toEqual({
				id: growingUnitId,
				locationId,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: {
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: LengthUnitEnum.METER,
				},
				plants: [plantMongoData],
				remainingCapacity: 9,
				numberOfPlants: 1,
				volume: 1.0,
				createdAt,
				updatedAt,
			});
			expect(mockPlantMongoDBMapper.toMongoData).toHaveBeenCalledWith(
				plantViewModel,
			);
		});

		it('should convert view model with null dimensions and no plants', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new GrowingUnitViewModel({
				id: growingUnitId,
				locationId,
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

			const result = mapper.toMongoData(viewModel);

			expect(result).toEqual({
				id: growingUnitId,
				locationId,
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
			expect(mockPlantMongoDBMapper.toMongoData).not.toHaveBeenCalled();
		});
	});
});
