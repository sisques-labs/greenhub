import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { IContainerCreateViewModelDto } from '@/core/plant-context/containers/domain/dtos/view-models/container-create/container-create-view-model.dto';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerViewModelFactory } from '@/core/plant-context/containers/domain/factories/container-view-model/container-view-model.factory';
import { ContainerPrimitives } from '@/core/plant-context/containers/domain/primitives/container.primitives';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

describe('ContainerViewModelFactory', () => {
  let factory: ContainerViewModelFactory;

  beforeEach(() => {
    factory = new ContainerViewModelFactory();
  });

  describe('create', () => {
    it('should create a ContainerViewModel from DTO', () => {
      const now = new Date();
      const dto: IContainerCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Garden Bed 1',
        plants: [],
        numberOfPlants: 0,
        type: ContainerTypeEnum.GARDEN_BED,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(ContainerViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.type).toBe(dto.type);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a ContainerViewModel from primitives with all fields', () => {
      const now = new Date();
      const primitives: ContainerPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(ContainerViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.type).toBe(primitives.type);
      expect(viewModel.createdAt).toEqual(primitives.createdAt);
      expect(viewModel.updatedAt).toEqual(primitives.updatedAt);
    });
  });

  describe('fromAggregate', () => {
    it('should create a ContainerViewModel from ContainerAggregate with all fields', () => {
      const now = new Date();
      const aggregate = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(ContainerViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.name).toBe(aggregate.name.value);
      expect(viewModel.type).toBe(aggregate.type.value);
      expect(viewModel.createdAt).toEqual(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toEqual(aggregate.updatedAt.value);
    });
  });
});
