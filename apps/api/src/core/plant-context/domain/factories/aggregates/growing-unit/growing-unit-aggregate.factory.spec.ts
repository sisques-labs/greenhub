import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { IGrowingUnitDto } from '@/core/plant-context/domain/dtos/entities/growing-unit/growing-unit.dto';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitAggregateFactory } from '@/core/plant-context/domain/factories/aggregates/growing-unit/growing-unit-aggregate.factory';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { GrowingUnitPrimitives } from '@/core/plant-context/domain/primitives/growing-unit.primitives';
import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant.primitives';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

describe('GrowingUnitAggregateFactory', () => {
  let factory: GrowingUnitAggregateFactory;
  let plantEntityFactory: PlantEntityFactory;

  beforeEach(() => {
    plantEntityFactory = new PlantEntityFactory();
    factory = new GrowingUnitAggregateFactory(plantEntityFactory);
  });

  describe('create', () => {
    it('should create a GrowingUnitAggregate from DTO', () => {
      const dto: IGrowingUnitDto = {
        id: new GrowingUnitUuidValueObject(),
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

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(GrowingUnitAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe('Garden Bed 1');
      expect(aggregate.type.value).toBe(GrowingUnitTypeEnum.GARDEN_BED);
      expect(aggregate.capacity.value).toBe(10);
    });

    it('should create a GrowingUnitAggregate from DTO without dimensions', () => {
      const dto: IGrowingUnitDto = {
        id: new GrowingUnitUuidValueObject(),
        name: new GrowingUnitNameValueObject('Garden Bed 1'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(GrowingUnitAggregate);
      expect(aggregate.dimensions).toBeNull();
    });

    it('should generate event by default', () => {
      const dto: IGrowingUnitDto = {
        id: new GrowingUnitUuidValueObject(),
        name: new GrowingUnitNameValueObject('Garden Bed 1'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      };

      const aggregate = factory.create(dto);

      const events = aggregate.getUncommittedEvents();
      expect(events.length).toBeGreaterThan(0);
    });

    it('should not generate event when generateEvent is false', () => {
      const dto: IGrowingUnitDto = {
        id: new GrowingUnitUuidValueObject(),
        name: new GrowingUnitNameValueObject('Garden Bed 1'),
        type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
        capacity: new GrowingUnitCapacityValueObject(10),
        dimensions: null,
        plants: [],
      };

      const aggregate = factory.create(dto, false);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a GrowingUnitAggregate from primitives', () => {
      const primitives: GrowingUnitPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(GrowingUnitAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.type.value).toBe(primitives.type);
      expect(aggregate.capacity.value).toBe(primitives.capacity);
    });

    it('should create a GrowingUnitAggregate from primitives without dimensions', () => {
      const primitives: GrowingUnitPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Garden Bed 1',
        type: GrowingUnitTypeEnum.GARDEN_BED,
        capacity: 10,
        dimensions: null,
        plants: [],
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(GrowingUnitAggregate);
      expect(aggregate.dimensions).toBeNull();
    });

    it('should create a GrowingUnitAggregate from primitives with plants', () => {
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
        name: 'Garden Bed 1',
        type: GrowingUnitTypeEnum.GARDEN_BED,
        capacity: 10,
        dimensions: null,
        plants: [plantPrimitives],
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(GrowingUnitAggregate);
      expect(aggregate.plants).toHaveLength(1);
      expect(aggregate.plants[0].id.value).toBe(plantPrimitives.id);
    });

    it('should not generate event when creating from primitives', () => {
      const primitives: GrowingUnitPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Garden Bed 1',
        type: GrowingUnitTypeEnum.GARDEN_BED,
        capacity: 10,
        dimensions: null,
        plants: [],
      };

      const aggregate = factory.fromPrimitives(primitives);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });
  });
});
