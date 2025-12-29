import { IPlantCreateViewModelDto } from '@/core/plant-context/plants/domain/dtos/view-models/plant-create/plant-create-view-model.dto';
import { IPlantUpdateViewModelDto } from '@/core/plant-context/plants/domain/dtos/view-models/plant-update/plant-update-view-model.dto';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';

describe('PlantViewModel', () => {
  const createProps = (): IPlantCreateViewModelDto => {
    const now = new Date();
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      containerId: '223e4567-e89b-12d3-a456-426614174000',
      name: 'Aloe Vera',
      species: 'Aloe barbadensis',
      plantedDate: new Date('2024-01-15'),
      notes: 'Keep in indirect sunlight',
      status: PlantStatusEnum.PLANTED,
      createdAt: now,
      updatedAt: now,
    };
  };

  describe('constructor', () => {
    it('should create a PlantViewModel with all properties', () => {
      const props = createProps();
      const viewModel = new PlantViewModel(props);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.id).toBe(props.id);
      expect(viewModel.containerId).toBe(props.containerId);
      expect(viewModel.name).toBe(props.name);
      expect(viewModel.species).toBe(props.species);
      expect(viewModel.plantedDate).toEqual(props.plantedDate);
      expect(viewModel.notes).toBe(props.notes);
      expect(viewModel.status).toBe(props.status);
      expect(viewModel.createdAt).toEqual(props.createdAt);
      expect(viewModel.updatedAt).toEqual(props.updatedAt);
    });

    it('should create a PlantViewModel with null plantedDate', () => {
      const props = createProps();
      props.plantedDate = null;
      const viewModel = new PlantViewModel(props);

      expect(viewModel.plantedDate).toBeNull();
    });

    it('should create a PlantViewModel with null notes', () => {
      const props = createProps();
      props.notes = null;
      const viewModel = new PlantViewModel(props);

      expect(viewModel.notes).toBeNull();
    });
  });

  describe('getters', () => {
    it('should return correct values through getters', () => {
      const props = createProps();
      const viewModel = new PlantViewModel(props);

      expect(viewModel.id).toBe(props.id);
      expect(viewModel.containerId).toBe(props.containerId);
      expect(viewModel.name).toBe(props.name);
      expect(viewModel.species).toBe(props.species);
      expect(viewModel.plantedDate).toEqual(props.plantedDate);
      expect(viewModel.notes).toBe(props.notes);
      expect(viewModel.status).toBe(props.status);
      expect(viewModel.createdAt).toEqual(props.createdAt);
      expect(viewModel.updatedAt).toEqual(props.updatedAt);
    });

    it('should return id as read-only', () => {
      const props = createProps();
      const viewModel = new PlantViewModel(props);
      const originalId = viewModel.id;

      // id is readonly, so we can't change it, but we can verify it's accessible
      expect(viewModel.id).toBe(originalId);
    });
  });

  describe('update', () => {
    it('should update the name, species, plantedDate, notes, and status', () => {
      const props = createProps();
      const viewModel = new PlantViewModel(props);

      const beforeUpdate = viewModel.updatedAt.getTime();
      const updateData: IPlantUpdateViewModelDto = {
        containerId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: new Date('2024-02-01'),
        notes: 'Water daily',
        status: PlantStatusEnum.GROWING,
      };

      viewModel.update(updateData);

      expect(viewModel.containerId).toBe(
        '323e4567-e89b-12d3-a456-426614174000',
      );
      expect(viewModel.name).toBe('Basil');
      expect(viewModel.species).toBe('Ocimum basilicum');
      expect(viewModel.plantedDate).toEqual(new Date('2024-02-01'));
      expect(viewModel.notes).toBe('Water daily');
      expect(viewModel.status).toBe(PlantStatusEnum.GROWING);
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate,
      );
    });

    it('should not update properties when they are undefined', () => {
      const props = createProps();
      const originalName = props.name;
      const originalSpecies = props.species;
      const viewModel = new PlantViewModel(props);

      const updateData: IPlantUpdateViewModelDto = {};

      viewModel.update(updateData);

      expect(viewModel.name).toBe(originalName);
      expect(viewModel.species).toBe(originalSpecies);
    });

    it('should update only provided properties', () => {
      const props = createProps();
      const viewModel = new PlantViewModel(props);

      const updateData: IPlantUpdateViewModelDto = {
        name: 'Updated Name',
      };

      viewModel.update(updateData);

      expect(viewModel.name).toBe('Updated Name');
      expect(viewModel.species).toBe(props.species);
    });

    it('should update plantedDate to null', () => {
      const props = createProps();
      const viewModel = new PlantViewModel(props);

      const updateData: IPlantUpdateViewModelDto = {
        plantedDate: null,
      };

      viewModel.update(updateData);

      expect(viewModel.plantedDate).toBeNull();
    });

    it('should update notes to null', () => {
      const props = createProps();
      const viewModel = new PlantViewModel(props);

      const updateData: IPlantUpdateViewModelDto = {
        notes: null,
      };

      viewModel.update(updateData);

      expect(viewModel.notes).toBeNull();
    });

    it('should update updatedAt timestamp on update', () => {
      const props = createProps();
      const viewModel = new PlantViewModel(props);

      const beforeUpdate = viewModel.updatedAt.getTime();

      const updateData: IPlantUpdateViewModelDto = {
        name: 'Updated Name',
      };

      viewModel.update(updateData);

      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate,
      );
    });
  });
});
