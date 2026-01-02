import { IGrowingUnitDto } from '@/core/plant-context/domain/dtos/entities/growing-unit/growing-unit.dto';
import { IGrowingUnitViewModelDto } from '@/core/plant-context/domain/dtos/view-models/growing-unit/growing-unit-view-model.dto';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitAggregateFactory } from '@/core/plant-context/domain/factories/aggregates/growing-unit/growing-unit-aggregate.factory';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import { PlantViewModelFactory } from '@/core/plant-context/domain/factories/view-models/plant-view-model/plant-view-model.factory';
import { GrowingUnitPrimitives } from '@/core/plant-context/domain/primitives/growing-unit/growing-unit.primitives';
import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant/plant.primitives';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('GrowingUnitViewModelFactory', () => {
	let factory: GrowingUnitViewModelFactory;
	let plantViewModelFactory: PlantViewModelFactory;
	let plantEntityFactory: PlantEntityFactory;
	let growingUnitAggregateFactory: GrowingUnitAggregateFactory;

	beforeEach(() => {
		plantViewModelFactory = new PlantViewModelFactory();
		plantEntityFactory = new PlantEntityFactory();
		growingUnitAggregateFactory = new GrowingUnitAggregateFactory(
			plantEntityFactory,
		);
		factory = new GrowingUnitViewModelFactory(plantViewModelFactory);
	});

	describe('create', () => {
		it('should create a GrowingUnitViewModel from DTO', () => {
			const dto: IGrowingUnitViewModelDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				locationId: '323e4567-e89b-12d3-a456-426614174000',
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
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(GrowingUnitViewModel);
			expect(viewModel.id).toBe(dto.id);
			expect(viewModel.name).toBe(dto.name);
			expect(viewModel.type).toBe(dto.type);
			expect(viewModel.capacity).toBe(dto.capacity);
		});

		it('should create a GrowingUnitViewModel from DTO without dimensions', () => {
			const dto: IGrowingUnitViewModelDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				locationId: '323e4567-e89b-12d3-a456-426614174000',
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
				remainingCapacity: 10,
				numberOfPlants: 0,
				volume: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(GrowingUnitViewModel);
			expect(viewModel.dimensions).toBeNull();
		});
	});

	describe('fromPrimitives', () => {
		it('should create a GrowingUnitViewModel from primitives', () => {
			const primitives: GrowingUnitPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				locationId: '323e4567-e89b-12d3-a456-426614174000',
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
			};

			const viewModel = factory.fromPrimitives(primitives);

			expect(viewModel).toBeInstanceOf(GrowingUnitViewModel);
			expect(viewModel.id).toBe(primitives.id);
			expect(viewModel.name).toBe(primitives.name);
			expect(viewModel.type).toBe(primitives.type);
			expect(viewModel.capacity).toBe(primitives.capacity);
		});

		it('should create a GrowingUnitViewModel from primitives without dimensions', () => {
			const primitives: GrowingUnitPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				locationId: '323e4567-e89b-12d3-a456-426614174000',
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
			};

			const viewModel = factory.fromPrimitives(primitives);

			expect(viewModel).toBeInstanceOf(GrowingUnitViewModel);
			expect(viewModel.dimensions).toBeNull();
			expect(viewModel.volume).toBe(0);
		});

		it('should create a GrowingUnitViewModel from primitives with plants', () => {
			const plantPrimitives: PlantPrimitives = {
				id: '223e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
			};

			const primitives: GrowingUnitPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				locationId: '323e4567-e89b-12d3-a456-426614174000',
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [plantPrimitives],
			};

			const viewModel = factory.fromPrimitives(primitives);

			expect(viewModel).toBeInstanceOf(GrowingUnitViewModel);
			expect(viewModel.plants).toHaveLength(1);
			expect(viewModel.numberOfPlants).toBe(1);
		});
	});

	describe('fromAggregate', () => {
		it('should create a GrowingUnitViewModel from aggregate', () => {
			const dto: IGrowingUnitDto = {
				id: new GrowingUnitUuidValueObject(),
				locationId: new LocationUuidValueObject(),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: new DimensionsValueObject({
					length: 100,
					width: 50,
					height: 30,
					unit: LengthUnitEnum.CENTIMETER,
				}),
				plants: [],
			};

			const aggregate = growingUnitAggregateFactory.create(dto);
			const viewModel = factory.fromAggregate(aggregate);

			expect(viewModel).toBeInstanceOf(GrowingUnitViewModel);
			expect(viewModel.id).toBe(aggregate.id.value);
			expect(viewModel.name).toBe(aggregate.name.value);
			expect(viewModel.type).toBe(aggregate.type.value);
			expect(viewModel.capacity).toBe(aggregate.capacity.value);
		});

		it('should create a GrowingUnitViewModel from aggregate without dimensions', () => {
			const dto: IGrowingUnitDto = {
				id: new GrowingUnitUuidValueObject(),
				locationId: new LocationUuidValueObject(),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			};

			const aggregate = growingUnitAggregateFactory.create(dto);
			const viewModel = factory.fromAggregate(aggregate);

			expect(viewModel).toBeInstanceOf(GrowingUnitViewModel);
			expect(viewModel.dimensions).toBeNull();
			expect(viewModel.volume).toBe(0);
		});

		it('should calculate remaining capacity correctly', () => {
			const dto: IGrowingUnitDto = {
				id: new GrowingUnitUuidValueObject(),
				locationId: new LocationUuidValueObject(),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			};

			const aggregate = growingUnitAggregateFactory.create(dto);
			const viewModel = factory.fromAggregate(aggregate);

			expect(viewModel.remainingCapacity).toBe(10);
			expect(viewModel.numberOfPlants).toBe(0);
		});
	});
});
