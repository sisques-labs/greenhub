import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitAggregateFactory } from '@/core/plant-context/domain/factories/aggregates/growing-unit/growing-unit-aggregate.factory';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitTypeormEntity } from '@/core/plant-context/infrastructure/database/typeorm/entities/growing-unit-typeorm.entity';
import { PlantTypeormEntity } from '@/core/plant-context/infrastructure/database/typeorm/entities/plant-typeorm.entity';
import { GrowingUnitTypeormMapper } from '@/core/plant-context/infrastructure/database/typeorm/mappers/growing-unit/growing-unit-typeorm.mapper';
import { PlantTypeormMapper } from '@/core/plant-context/infrastructure/database/typeorm/mappers/plant/plant-typeorm.mapper';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('GrowingUnitTypeormMapper', () => {
	let mapper: GrowingUnitTypeormMapper;
	let mockGrowingUnitAggregateFactory: jest.Mocked<GrowingUnitAggregateFactory>;
	let mockPlantTypeormMapper: jest.Mocked<PlantTypeormMapper>;
	let plantEntityFactory: PlantEntityFactory;

	beforeEach(() => {
		plantEntityFactory = new PlantEntityFactory();

		mockGrowingUnitAggregateFactory = {
			create: jest.fn(),
			fromPrimitives: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitAggregateFactory>;

		mockPlantTypeormMapper = {
			toDomainEntity: jest.fn(),
			toTypeormEntity: jest.fn(),
			toTypeormEntityFromPrimitives: jest.fn(),
		} as unknown as jest.Mocked<PlantTypeormMapper>;

		mapper = new GrowingUnitTypeormMapper(
			mockGrowingUnitAggregateFactory,
			mockPlantTypeormMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('toDomainEntity', () => {
		it('should convert TypeORM entity to domain aggregate with all properties', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';
			const now = new Date();

			const plantTypeormEntity = new PlantTypeormEntity();
			plantTypeormEntity.id = plantId;
			plantTypeormEntity.growingUnitId = growingUnitId;
			plantTypeormEntity.name = 'Basil';
			plantTypeormEntity.species = 'Ocimum basilicum';
			plantTypeormEntity.plantedDate = null;
			plantTypeormEntity.notes = null;
			plantTypeormEntity.status = PlantStatusEnum.PLANTED;
			plantTypeormEntity.createdAt = now;
			plantTypeormEntity.updatedAt = now;
			plantTypeormEntity.deletedAt = null;

			const typeormEntity = new GrowingUnitTypeormEntity();
			typeormEntity.id = growingUnitId;
			typeormEntity.name = 'Garden Bed 1';
			typeormEntity.type = GrowingUnitTypeEnum.GARDEN_BED;
			typeormEntity.capacity = 10;
			typeormEntity.length = 2.0;
			typeormEntity.width = 1.0;
			typeormEntity.height = 0.5;
			typeormEntity.unit = LengthUnitEnum.METER;
			typeormEntity.plants = [plantTypeormEntity];
			typeormEntity.createdAt = now;
			typeormEntity.updatedAt = now;
			typeormEntity.deletedAt = null;

			const plantEntity = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const growingUnitAggregate = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				locationId: new LocationUuidValueObject(locationId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: new DimensionsValueObject({
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: LengthUnitEnum.METER,
				}),
				plants: [plantEntity],
			});

			mockPlantTypeormMapper.toDomainEntity.mockReturnValue(plantEntity);
			mockGrowingUnitAggregateFactory.fromPrimitives.mockReturnValue(
				growingUnitAggregate,
			);

			const result = mapper.toDomainEntity(typeormEntity);

			expect(result).toBe(growingUnitAggregate);
			expect(mockPlantTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				plantTypeormEntity,
			);
			expect(
				mockGrowingUnitAggregateFactory.fromPrimitives,
			).toHaveBeenCalledWith({
				id: growingUnitId,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: {
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: LengthUnitEnum.METER,
				},
				plants: [plantEntity.toPrimitives()],
			});
		});

		it('should convert TypeORM entity with null dimensions and no plants', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const now = new Date();

			const typeormEntity = new GrowingUnitTypeormEntity();
			typeormEntity.id = growingUnitId;
			typeormEntity.name = 'Garden Bed 1';
			typeormEntity.type = GrowingUnitTypeEnum.GARDEN_BED;
			typeormEntity.capacity = 10;
			typeormEntity.length = null;
			typeormEntity.width = null;
			typeormEntity.height = null;
			typeormEntity.unit = null;
			typeormEntity.plants = [];
			typeormEntity.createdAt = now;
			typeormEntity.updatedAt = now;
			typeormEntity.deletedAt = null;

			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const growingUnitAggregate = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				locationId: new LocationUuidValueObject(locationId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnitAggregateFactory.fromPrimitives.mockReturnValue(
				growingUnitAggregate,
			);

			const result = mapper.toDomainEntity(typeormEntity);

			expect(result).toBe(growingUnitAggregate);
			expect(mockPlantTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
			expect(
				mockGrowingUnitAggregateFactory.fromPrimitives,
			).toHaveBeenCalledWith({
				id: growingUnitId,
				name: 'Garden Bed 1',
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				dimensions: null,
				plants: [],
			});
		});
	});

	describe('toTypeormEntity', () => {
		it('should convert domain aggregate to TypeORM entity with all properties', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const plantId = '223e4567-e89b-12d3-a456-426614174000';

			const plantEntity = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const locationId = '323e4567-e89b-12d3-a456-426614174000';
			const growingUnitAggregate = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				locationId: new LocationUuidValueObject(locationId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: new DimensionsValueObject({
					length: 2.0,
					width: 1.0,
					height: 0.5,
					unit: LengthUnitEnum.METER,
				}),
				plants: [plantEntity],
			});

			const plantTypeormEntity = new PlantTypeormEntity();
			plantTypeormEntity.id = plantId;
			plantTypeormEntity.growingUnitId = growingUnitId;
			plantTypeormEntity.name = 'Basil';
			plantTypeormEntity.species = 'Ocimum basilicum';
			plantTypeormEntity.plantedDate = null;
			plantTypeormEntity.notes = null;
			plantTypeormEntity.status = PlantStatusEnum.PLANTED;

			const toPrimitivesSpy = jest
				.spyOn(growingUnitAggregate, 'toPrimitives')
				.mockReturnValue({
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
					plants: [plantEntity.toPrimitives()],
				});

			mockPlantTypeormMapper.toTypeormEntityFromPrimitives.mockReturnValue(
				plantTypeormEntity,
			);

			const result = mapper.toTypeormEntity(growingUnitAggregate);

			expect(result).toBeInstanceOf(GrowingUnitTypeormEntity);
			expect(result.id).toBe(growingUnitId);
			expect(result.name).toBe('Garden Bed 1');
			expect(result.type).toBe(GrowingUnitTypeEnum.GARDEN_BED);
			expect(result.capacity).toBe(10);
			expect(result.length).toBe(2.0);
			expect(result.width).toBe(1.0);
			expect(result.height).toBe(0.5);
			expect(result.unit).toBe(LengthUnitEnum.METER);
			expect(result.plants).toHaveLength(1);
			expect(result.plants[0]).toBe(plantTypeormEntity);
			expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);
			expect(
				mockPlantTypeormMapper.toTypeormEntityFromPrimitives,
			).toHaveBeenCalledWith(plantEntity.toPrimitives(), growingUnitId);

			toPrimitivesSpy.mockRestore();
		});

		it('should convert domain aggregate with null dimensions', () => {
			const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
			const locationId = '323e4567-e89b-12d3-a456-426614174000';

			const growingUnitAggregate = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				locationId: new LocationUuidValueObject(locationId),
				name: new GrowingUnitNameValueObject('Garden Bed 1'),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			const toPrimitivesSpy = jest
				.spyOn(growingUnitAggregate, 'toPrimitives')
				.mockReturnValue({
					id: growingUnitId,
					locationId,
					name: 'Garden Bed 1',
					type: GrowingUnitTypeEnum.GARDEN_BED,
					capacity: 10,
					dimensions: null,
					plants: [],
				});

			const result = mapper.toTypeormEntity(growingUnitAggregate);

			expect(result).toBeInstanceOf(GrowingUnitTypeormEntity);
			expect(result.id).toBe(growingUnitId);
			expect(result.name).toBe('Garden Bed 1');
			expect(result.type).toBe(GrowingUnitTypeEnum.GARDEN_BED);
			expect(result.capacity).toBe(10);
			expect(result.length).toBeNull();
			expect(result.width).toBeNull();
			expect(result.height).toBeNull();
			expect(result.unit).toBeNull();
			expect(result.plants).toHaveLength(0);

			toPrimitivesSpy.mockRestore();
		});
	});
});
