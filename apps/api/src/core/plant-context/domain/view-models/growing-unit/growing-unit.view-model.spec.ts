import { IGrowingUnitViewModelDto } from '@/core/plant-context/domain/dtos/view-models/growing-unit/growing-unit-view-model.dto';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';

describe('GrowingUnitViewModel', () => {
	let viewModelDto: IGrowingUnitViewModelDto;

	beforeEach(() => {
		const location = new LocationViewModel({
			id: '323e4567-e89b-12d3-a456-426614174000',
			name: 'Test Location',
			type: 'INDOOR',
			description: null,
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15'),
		});
		viewModelDto = {
			id: '123e4567-e89b-12d3-a456-426614174000',
			location,
			name: 'Garden Bed 1',
			type: GrowingUnitTypeEnum.GARDEN_BED,
			capacity: 10,
			dimensions: {
				length: 100,
				width: 50,
				height: 30,
				unit: LengthUnitEnum.CENTIMETER,
			},
			plants: [],
			remainingCapacity: 10,
			numberOfPlants: 0,
			volume: 150000,
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15'),
		};
	});

	describe('constructor', () => {
		it('should create a view model with all properties', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);

			expect(viewModel.id).toBe(viewModelDto.id);
			expect(viewModel.name).toBe(viewModelDto.name);
			expect(viewModel.type).toBe(viewModelDto.type);
			expect(viewModel.capacity).toBe(viewModelDto.capacity);
			expect(viewModel.dimensions).toEqual(viewModelDto.dimensions);
			expect(viewModel.plants).toEqual(viewModelDto.plants);
			expect(viewModel.remainingCapacity).toBe(viewModelDto.remainingCapacity);
			expect(viewModel.numberOfPlants).toBe(viewModelDto.numberOfPlants);
			expect(viewModel.volume).toBe(viewModelDto.volume);
		});

		it('should create a view model without dimensions', () => {
			const dtoWithoutDimensions: IGrowingUnitViewModelDto = {
				...viewModelDto,
				dimensions: null,
				volume: 0,
			};

			const viewModel = new GrowingUnitViewModel(dtoWithoutDimensions);

			expect(viewModel.dimensions).toBeNull();
			expect(viewModel.volume).toBe(0);
		});

		it('should compute calculated properties correctly', () => {
			const plantViewModel = new PlantViewModel({
				id: '223e4567-e89b-12d3-a456-426614174000',
				growingUnitId: viewModelDto.id,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			const dtoWithPlants: IGrowingUnitViewModelDto = {
				...viewModelDto,
				plants: [plantViewModel],
				numberOfPlants: 1,
				remainingCapacity: 9,
			};

			const viewModel = new GrowingUnitViewModel(dtoWithPlants);

			expect(viewModel.numberOfPlants).toBe(1);
			expect(viewModel.remainingCapacity).toBe(9);
		});
	});

	describe('getters', () => {
		it('should return correct name', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);

			expect(viewModel.name).toBe('Garden Bed 1');
		});

		it('should return correct type', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);

			expect(viewModel.type).toBe(GrowingUnitTypeEnum.GARDEN_BED);
		});

		it('should return correct capacity', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);

			expect(viewModel.capacity).toBe(10);
		});

		it('should return correct dimensions', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);

			expect(viewModel.dimensions).toEqual({
				length: 100,
				width: 50,
				height: 30,
				unit: LengthUnitEnum.CENTIMETER,
			});
		});

		it('should return correct plants', () => {
			const plantViewModel = new PlantViewModel({
				id: '223e4567-e89b-12d3-a456-426614174000',
				growingUnitId: viewModelDto.id,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			const dtoWithPlants: IGrowingUnitViewModelDto = {
				...viewModelDto,
				plants: [plantViewModel],
				numberOfPlants: 1,
				remainingCapacity: 9,
			};

			const viewModel = new GrowingUnitViewModel(dtoWithPlants);

			expect(viewModel.plants).toHaveLength(1);
			expect(viewModel.plants[0].id).toBe(plantViewModel.id);
		});

		it('should return correct numberOfPlants', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);

			expect(viewModel.numberOfPlants).toBe(0);
		});

		it('should return correct volume', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);

			expect(viewModel.volume).toBe(150000);
		});

		it('should return correct remainingCapacity', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);

			expect(viewModel.remainingCapacity).toBe(10);
		});
	});

	describe('update', () => {
		it('should update view model properties', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);
			const updateData: IGrowingUnitViewModelDto = {
				...viewModelDto,
				name: 'Garden Bed 2',
				type: GrowingUnitTypeEnum.POT,
				capacity: 20,
			};

			viewModel.update(updateData);

			expect(viewModel.name).toBe('Garden Bed 2');
			expect(viewModel.type).toBe(GrowingUnitTypeEnum.POT);
			expect(viewModel.capacity).toBe(20);
		});

		it('should update dimensions', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);
			const updateData: IGrowingUnitViewModelDto = {
				...viewModelDto,
				dimensions: {
					length: 200,
					width: 100,
					height: 50,
					unit: LengthUnitEnum.CENTIMETER,
				},
				volume: 1000000,
			};

			viewModel.update(updateData);

			expect(viewModel.dimensions).toEqual(updateData.dimensions);
			expect(viewModel.volume).toBe(1000000);
		});

		it('should update plants', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);
			const plantViewModel = new PlantViewModel({
				id: '223e4567-e89b-12d3-a456-426614174000',
				growingUnitId: viewModelDto.id,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			const updateData: IGrowingUnitViewModelDto = {
				...viewModelDto,
				plants: [plantViewModel],
				numberOfPlants: 1,
				remainingCapacity: 9,
			};

			viewModel.update(updateData);

			expect(viewModel.plants).toHaveLength(1);
			expect(viewModel.numberOfPlants).toBe(1);
			expect(viewModel.remainingCapacity).toBe(9);
		});

		it('should update updatedAt timestamp', () => {
			const viewModel = new GrowingUnitViewModel(viewModelDto);
			const beforeUpdate = viewModel.updatedAt;
			const updateData: IGrowingUnitViewModelDto = {
				...viewModelDto,
				name: 'Garden Bed 2',
			};

			// Wait a bit to ensure timestamp difference
			setTimeout(() => {
				viewModel.update(updateData);
				expect(viewModel.updatedAt.getTime()).toBeGreaterThan(
					beforeUpdate.getTime(),
				);
			}, 10);
		});
	});
});
