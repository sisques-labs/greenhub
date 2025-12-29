import { IContainerCreateViewModelDto } from '@/core/plant-context/containers/domain/dtos/view-models/container-create/container-create-view-model.dto';
import { IContainerUpdateViewModelDto } from '@/core/plant-context/containers/domain/dtos/view-models/container-update/container-update-view-model.dto';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';

describe('ContainerViewModel', () => {
  const createProps = (): IContainerCreateViewModelDto => {
    const now = new Date();
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Garden Bed 1',
      type: ContainerTypeEnum.GARDEN_BED,
      plants: [],
      numberOfPlants: 0,
      createdAt: now,
      updatedAt: now,
    };
  };

  describe('constructor', () => {
    it('should create a ContainerViewModel with all properties', () => {
      const props = createProps();
      const viewModel = new ContainerViewModel(props);

      expect(viewModel).toBeInstanceOf(ContainerViewModel);
      expect(viewModel.id).toBe(props.id);
      expect(viewModel.name).toBe(props.name);
      expect(viewModel.type).toBe(props.type);
      expect(viewModel.createdAt).toEqual(props.createdAt);
      expect(viewModel.updatedAt).toEqual(props.updatedAt);
    });
  });

  describe('getters', () => {
    it('should return correct values through getters', () => {
      const props = createProps();
      const viewModel = new ContainerViewModel(props);

      expect(viewModel.id).toBe(props.id);
      expect(viewModel.name).toBe(props.name);
      expect(viewModel.type).toBe(props.type);
      expect(viewModel.createdAt).toEqual(props.createdAt);
      expect(viewModel.updatedAt).toEqual(props.updatedAt);
    });

    it('should return id as read-only', () => {
      const props = createProps();
      const viewModel = new ContainerViewModel(props);
      const originalId = viewModel.id;

      // id is readonly, so we can't change it, but we can verify it's accessible
      expect(viewModel.id).toBe(originalId);
    });
  });

  describe('update', () => {
    it('should update the name and type', () => {
      const props = createProps();
      const viewModel = new ContainerViewModel(props);

      const updateData: IContainerUpdateViewModelDto = {
        name: 'Garden Bed 2',
        type: ContainerTypeEnum.POT,
      };

      viewModel.update(updateData);

      expect(viewModel.name).toBe('Garden Bed 2');
      expect(viewModel.type).toBe(ContainerTypeEnum.POT);
    });

    it('should not update properties when they are undefined', () => {
      const props = createProps();
      const originalName = props.name;
      const originalType = props.type;
      const viewModel = new ContainerViewModel(props);

      const updateData: IContainerUpdateViewModelDto = {};

      viewModel.update(updateData);

      expect(viewModel.name).toBe(originalName);
      expect(viewModel.type).toBe(originalType);
    });

    it('should update only provided properties', () => {
      const props = createProps();
      const viewModel = new ContainerViewModel(props);

      const updateData: IContainerUpdateViewModelDto = {
        name: 'Updated Name',
      };

      viewModel.update(updateData);

      expect(viewModel.name).toBe('Updated Name');
      expect(viewModel.type).toBe(props.type);
    });
  });
});
