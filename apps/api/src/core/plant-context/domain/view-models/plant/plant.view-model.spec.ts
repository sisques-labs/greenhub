import { IPlantViewModelDto } from '@/core/plant-context/domain/dtos/view-models/plant/plant-view-model.dto';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';

describe('PlantViewModel', () => {
  let viewModelDto: IPlantViewModelDto;

  beforeEach(() => {
    viewModelDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
      name: 'Basil',
      species: 'Ocimum basilicum',
      plantedDate: new Date('2024-01-15'),
      notes: 'Keep in indirect sunlight',
      status: PlantStatusEnum.PLANTED,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    };
  });

  describe('constructor', () => {
    it('should create a view model with all properties', () => {
      const viewModel = new PlantViewModel(viewModelDto);

      expect(viewModel.id).toBe(viewModelDto.id);
      expect(viewModel.growingUnitId).toBe(viewModelDto.growingUnitId);
      expect(viewModel.name).toBe(viewModelDto.name);
      expect(viewModel.species).toBe(viewModelDto.species);
      expect(viewModel.plantedDate).toEqual(viewModelDto.plantedDate);
      expect(viewModel.notes).toBe(viewModelDto.notes);
      expect(viewModel.status).toBe(viewModelDto.status);
    });

    it('should create a view model with null plantedDate', () => {
      const dtoWithNullDate: IPlantViewModelDto = {
        ...viewModelDto,
        plantedDate: null,
      };

      const viewModel = new PlantViewModel(dtoWithNullDate);

      expect(viewModel.plantedDate).toBeNull();
    });

    it('should create a view model with null notes', () => {
      const dtoWithNullNotes: IPlantViewModelDto = {
        ...viewModelDto,
        notes: null,
      };

      const viewModel = new PlantViewModel(dtoWithNullNotes);

      expect(viewModel.notes).toBeNull();
    });
  });

  describe('getters', () => {
    it('should return correct growingUnitId', () => {
      const viewModel = new PlantViewModel(viewModelDto);

      expect(viewModel.growingUnitId).toBe(
        '223e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should return correct name', () => {
      const viewModel = new PlantViewModel(viewModelDto);

      expect(viewModel.name).toBe('Basil');
    });

    it('should return correct species', () => {
      const viewModel = new PlantViewModel(viewModelDto);

      expect(viewModel.species).toBe('Ocimum basilicum');
    });

    it('should return correct plantedDate', () => {
      const viewModel = new PlantViewModel(viewModelDto);

      expect(viewModel.plantedDate).toEqual(new Date('2024-01-15'));
    });

    it('should return correct notes', () => {
      const viewModel = new PlantViewModel(viewModelDto);

      expect(viewModel.notes).toBe('Keep in indirect sunlight');
    });

    it('should return correct status', () => {
      const viewModel = new PlantViewModel(viewModelDto);

      expect(viewModel.status).toBe(PlantStatusEnum.PLANTED);
    });
  });

  describe('update', () => {
    it('should update view model properties', () => {
      const viewModel = new PlantViewModel(viewModelDto);
      const updateData: IPlantViewModelDto = {
        ...viewModelDto,
        name: 'Sweet Basil',
        species: 'Ocimum tenuiflorum',
        status: PlantStatusEnum.GROWING,
      };

      viewModel.update(updateData);

      expect(viewModel.name).toBe('Sweet Basil');
      expect(viewModel.species).toBe('Ocimum tenuiflorum');
      expect(viewModel.status).toBe(PlantStatusEnum.GROWING);
    });

    it('should update growingUnitId', () => {
      const viewModel = new PlantViewModel(viewModelDto);
      const updateData: IPlantViewModelDto = {
        ...viewModelDto,
        growingUnitId: '323e4567-e89b-12d3-a456-426614174000',
      };

      viewModel.update(updateData);

      expect(viewModel.growingUnitId).toBe(
        '323e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should update plantedDate', () => {
      const viewModel = new PlantViewModel(viewModelDto);
      const newDate = new Date('2024-02-20');
      const updateData: IPlantViewModelDto = {
        ...viewModelDto,
        plantedDate: newDate,
      };

      viewModel.update(updateData);

      expect(viewModel.plantedDate).toEqual(newDate);
    });

    it('should update notes', () => {
      const viewModel = new PlantViewModel(viewModelDto);
      const updateData: IPlantViewModelDto = {
        ...viewModelDto,
        notes: 'Moved to larger pot',
      };

      viewModel.update(updateData);

      expect(viewModel.notes).toBe('Moved to larger pot');
    });

    it('should set plantedDate to null', () => {
      const viewModel = new PlantViewModel(viewModelDto);
      const updateData: IPlantViewModelDto = {
        ...viewModelDto,
        plantedDate: null,
      };

      viewModel.update(updateData);

      expect(viewModel.plantedDate).toBeNull();
    });

    it('should set notes to null', () => {
      const viewModel = new PlantViewModel(viewModelDto);
      const updateData: IPlantViewModelDto = {
        ...viewModelDto,
        notes: null,
      };

      viewModel.update(updateData);

      expect(viewModel.notes).toBeNull();
    });

    it('should update updatedAt timestamp', () => {
      const viewModel = new PlantViewModel(viewModelDto);
      const beforeUpdate = viewModel.updatedAt;
      const updateData: IPlantViewModelDto = {
        ...viewModelDto,
        name: 'Sweet Basil',
      };

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        viewModel.update(updateData);
        expect(viewModel.updatedAt.getTime()).toBeGreaterThan(
          beforeUpdate.getTime(),
        );
      }, 10);
    });

    it('should update all status values', () => {
      const statuses = [
        PlantStatusEnum.PLANTED,
        PlantStatusEnum.GROWING,
        PlantStatusEnum.HARVESTED,
        PlantStatusEnum.DEAD,
        PlantStatusEnum.ARCHIVED,
      ];

      statuses.forEach((status) => {
        const viewModel = new PlantViewModel(viewModelDto);
        const updateData: IPlantViewModelDto = {
          ...viewModelDto,
          status,
        };

        viewModel.update(updateData);

        expect(viewModel.status).toBe(status);
      });
    });
  });
});
