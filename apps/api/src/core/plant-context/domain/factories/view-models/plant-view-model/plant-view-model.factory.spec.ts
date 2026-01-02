import { IPlantDto } from '@/core/plant-context/domain/dtos/entities/plant/plant.dto';
import { IPlantViewModelDto } from '@/core/plant-context/domain/dtos/view-models/plant/plant-view-model.dto';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { PlantViewModelFactory } from '@/core/plant-context/domain/factories/view-models/plant-view-model/plant-view-model.factory';
import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant/plant.primitives';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantViewModelFactory', () => {
	let factory: PlantViewModelFactory;
	let plantEntityFactory: PlantEntityFactory;

	beforeEach(() => {
		factory = new PlantViewModelFactory();
		plantEntityFactory = new PlantEntityFactory();
	});

	describe('create', () => {
		it('should create a PlantViewModel from DTO', () => {
			const dto: IPlantViewModelDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(PlantViewModel);
			expect(viewModel.id).toBe(dto.id);
			expect(viewModel.growingUnitId).toBe(dto.growingUnitId);
			expect(viewModel.name).toBe(dto.name);
			expect(viewModel.species).toBe(dto.species);
			expect(viewModel.plantedDate).toEqual(dto.plantedDate);
			expect(viewModel.notes).toBe(dto.notes);
			expect(viewModel.status).toBe(dto.status);
		});

		it('should create a PlantViewModel from DTO with null plantedDate', () => {
			const dto: IPlantViewModelDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(PlantViewModel);
			expect(viewModel.plantedDate).toBeNull();
		});

		it('should create a PlantViewModel from DTO with null notes', () => {
			const dto: IPlantViewModelDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(PlantViewModel);
			expect(viewModel.notes).toBeNull();
		});
	});

	describe('fromPrimitives', () => {
		it('should create a PlantViewModel from primitives', () => {
			const primitives: PlantPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
			};

			const viewModel = factory.fromPrimitives(primitives);

			expect(viewModel).toBeInstanceOf(PlantViewModel);
			expect(viewModel.id).toBe(primitives.id);
			expect(viewModel.growingUnitId).toBe(primitives.growingUnitId);
			expect(viewModel.name).toBe(primitives.name);
			expect(viewModel.species).toBe(primitives.species);
			expect(viewModel.plantedDate).toEqual(primitives.plantedDate);
			expect(viewModel.notes).toBe(primitives.notes);
			expect(viewModel.status).toBe(primitives.status);
		});

		it('should create a PlantViewModel from primitives with null plantedDate', () => {
			const primitives: PlantPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
			};

			const viewModel = factory.fromPrimitives(primitives);

			expect(viewModel).toBeInstanceOf(PlantViewModel);
			expect(viewModel.plantedDate).toBeNull();
		});

		it('should create a PlantViewModel from primitives with null notes', () => {
			const primitives: PlantPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: new Date('2024-01-15'),
				notes: null,
				status: PlantStatusEnum.PLANTED,
			};

			const viewModel = factory.fromPrimitives(primitives);

			expect(viewModel).toBeInstanceOf(PlantViewModel);
			expect(viewModel.notes).toBeNull();
		});
	});

	describe('fromAggregate', () => {
		it('should create a PlantViewModel from entity', () => {
			const dto: IPlantDto = {
				id: new PlantUuidValueObject(),
				growingUnitId: new GrowingUnitUuidValueObject(),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
				notes: new PlantNotesValueObject('Keep in indirect sunlight'),
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			};

			const entity = plantEntityFactory.create(dto);
			const viewModel = factory.fromAggregate(entity);

			expect(viewModel).toBeInstanceOf(PlantViewModel);
			expect(viewModel.id).toBe(entity.id.value);
			expect(viewModel.growingUnitId).toBe(entity.growingUnitId.value);
			expect(viewModel.name).toBe(entity.name.value);
			expect(viewModel.species).toBe(entity.species.value);
			expect(viewModel.plantedDate).toEqual(entity.plantedDate?.value);
			expect(viewModel.notes).toBe(entity.notes?.value);
			expect(viewModel.status).toBe(entity.status.value);
		});

		it('should create a PlantViewModel from entity with null plantedDate', () => {
			const dto: IPlantDto = {
				id: new PlantUuidValueObject(),
				growingUnitId: new GrowingUnitUuidValueObject(),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: new PlantNotesValueObject('Keep in indirect sunlight'),
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			};

			const entity = plantEntityFactory.create(dto);
			const viewModel = factory.fromAggregate(entity);

			expect(viewModel).toBeInstanceOf(PlantViewModel);
			expect(viewModel.plantedDate).toBeNull();
		});

		it('should create a PlantViewModel from entity with null notes', () => {
			const dto: IPlantDto = {
				id: new PlantUuidValueObject(),
				growingUnitId: new GrowingUnitUuidValueObject(),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			};

			const entity = plantEntityFactory.create(dto);
			const viewModel = factory.fromAggregate(entity);

			expect(viewModel).toBeInstanceOf(PlantViewModel);
			expect(viewModel.notes).toBeNull();
		});
	});
});
