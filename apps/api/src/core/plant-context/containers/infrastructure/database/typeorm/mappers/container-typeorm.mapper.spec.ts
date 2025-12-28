import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerAggregateFactory } from '@/core/plant-context/containers/domain/factories/container-aggregate/container-aggregate.factory';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerTypeormEntity } from '@/core/plant-context/containers/infrastructure/database/typeorm/entities/container-typeorm.entity';
import { ContainerTypeormMapper } from '@/core/plant-context/containers/infrastructure/database/typeorm/mappers/container-typeorm.mapper';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

describe('ContainerTypeormMapper', () => {
  let mapper: ContainerTypeormMapper;
  let mockContainerAggregateFactory: jest.Mocked<ContainerAggregateFactory>;

  beforeEach(() => {
    mockContainerAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<ContainerAggregateFactory>;

    mapper = new ContainerTypeormMapper(mockContainerAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new ContainerTypeormEntity();
      typeormEntity.id = containerId;
      typeormEntity.name = 'Garden Bed 1';
      typeormEntity.type = ContainerTypeEnum.GARDEN_BED;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockContainerAggregate = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockContainerAggregateFactory.fromPrimitives.mockReturnValue(
        mockContainerAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockContainerAggregate);
      expect(mockContainerAggregateFactory.fromPrimitives).toHaveBeenCalledWith(
        {
          id: containerId,
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          createdAt: now,
          updatedAt: now,
        },
      );
      expect(
        mockContainerAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
    });

    it('should convert TypeORM entity with different container types', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const testCases = [
        ContainerTypeEnum.POT,
        ContainerTypeEnum.GARDEN_BED,
        ContainerTypeEnum.HANGING_BASKET,
        ContainerTypeEnum.WINDOW_BOX,
      ];

      testCases.forEach((type) => {
        const typeormEntity = new ContainerTypeormEntity();
        typeormEntity.id = containerId;
        typeormEntity.name = 'Container';
        typeormEntity.type = type;
        typeormEntity.createdAt = now;
        typeormEntity.updatedAt = now;
        typeormEntity.deletedAt = null;

        const mockContainerAggregate = new ContainerAggregate(
          {
            id: new ContainerUuidValueObject(containerId),
            name: new ContainerNameValueObject('Container'),
            type: new ContainerTypeValueObject(type),
            createdAt: new DateValueObject(now),
            updatedAt: new DateValueObject(now),
          },
          false,
        );

        mockContainerAggregateFactory.fromPrimitives.mockReturnValue(
          mockContainerAggregate,
        );

        const result = mapper.toDomainEntity(typeormEntity);

        expect(result).toBe(mockContainerAggregate);
        expect(result.type.value).toBe(type);

        jest.clearAllMocks();
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockContainerAggregate = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockContainerAggregate, 'toPrimitives')
        .mockReturnValue({
          id: containerId,
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockContainerAggregate);

      expect(result).toBeInstanceOf(ContainerTypeormEntity);
      expect(result.id).toBe(containerId);
      expect(result.name).toBe('Garden Bed 1');
      expect(result.type).toBe(ContainerTypeEnum.GARDEN_BED);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with different container types', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const testCases = [
        ContainerTypeEnum.POT,
        ContainerTypeEnum.GARDEN_BED,
        ContainerTypeEnum.HANGING_BASKET,
        ContainerTypeEnum.WINDOW_BOX,
      ];

      testCases.forEach((type) => {
        const mockContainerAggregate = new ContainerAggregate(
          {
            id: new ContainerUuidValueObject(containerId),
            name: new ContainerNameValueObject('Container'),
            type: new ContainerTypeValueObject(type),
            createdAt: new DateValueObject(now),
            updatedAt: new DateValueObject(now),
          },
          false,
        );

        const toPrimitivesSpy = jest
          .spyOn(mockContainerAggregate, 'toPrimitives')
          .mockReturnValue({
            id: containerId,
            name: 'Container',
            type,
            createdAt: now,
            updatedAt: now,
          });

        const result = mapper.toTypeormEntity(mockContainerAggregate);

        expect(result).toBeInstanceOf(ContainerTypeormEntity);
        expect(result.type).toBe(type);
        expect(result.deletedAt).toBeNull();

        toPrimitivesSpy.mockRestore();
        jest.clearAllMocks();
      });
    });
  });
});
