import { IPlantDto } from '@/core/plant-context/domain/dtos/entities/plant/plant.dto';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant/plant.primitives';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantEntityFactory', () => {
	let factory: PlantEntityFactory;

	beforeEach(() => {
		factory = new PlantEntityFactory();
	});

	describe('create', () => {
		it('should create a PlantEntity from DTO with all fields', () => {
			const dto: IPlantDto = {
				id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
				growingUnitId: new GrowingUnitUuidValueObject(
					'223e4567-e89b-12d3-a456-426614174000',
				),
				name: new PlantNameValueObject('Aloe Vera'),
				species: new PlantSpeciesValueObject('Aloe barbadensis'),
				plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
				notes: new PlantNotesValueObject('Keep in indirect sunlight'),
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			};

			const entity = factory.create(dto);

			expect(entity).toBeInstanceOf(PlantEntity);
			expect(entity.id.value).toBe(dto.id.value);
			expect(entity.growingUnitId.value).toBe(dto.growingUnitId.value);
			expect(entity.name.value).toBe(dto.name.value);
			expect(entity.species.value).toBe(dto.species.value);
			expect(entity.plantedDate?.value).toEqual(dto.plantedDate?.value);
			expect(entity.notes?.value).toBe(dto.notes?.value);
			expect(entity.status.value).toBe(dto.status.value);
		});

		it('should create a PlantEntity from DTO with null plantedDate', () => {
			const dto: IPlantDto = {
				id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
				growingUnitId: new GrowingUnitUuidValueObject(
					'223e4567-e89b-12d3-a456-426614174000',
				),
				name: new PlantNameValueObject('Aloe Vera'),
				species: new PlantSpeciesValueObject('Aloe barbadensis'),
				plantedDate: null,
				notes: new PlantNotesValueObject('Keep in indirect sunlight'),
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			};

			const entity = factory.create(dto);

			expect(entity).toBeInstanceOf(PlantEntity);
			expect(entity.id.value).toBe(dto.id.value);
			expect(entity.plantedDate).toBeNull();
		});

		it('should create a PlantEntity from DTO with null notes', () => {
			const dto: IPlantDto = {
				id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
				growingUnitId: new GrowingUnitUuidValueObject(
					'223e4567-e89b-12d3-a456-426614174000',
				),
				name: new PlantNameValueObject('Aloe Vera'),
				species: new PlantSpeciesValueObject('Aloe barbadensis'),
				plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			};

			const entity = factory.create(dto);

			expect(entity).toBeInstanceOf(PlantEntity);
			expect(entity.id.value).toBe(dto.id.value);
			expect(entity.notes).toBeNull();
		});

		it('should create a PlantEntity from DTO with different status values', () => {
			const statuses = [
				PlantStatusEnum.PLANTED,
				PlantStatusEnum.GROWING,
				PlantStatusEnum.HARVESTED,
				PlantStatusEnum.DEAD,
				PlantStatusEnum.ARCHIVED,
			];

			statuses.forEach((status) => {
				const dto: IPlantDto = {
					id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
					growingUnitId: new GrowingUnitUuidValueObject(
						'223e4567-e89b-12d3-a456-426614174000',
					),
					name: new PlantNameValueObject('Test Plant'),
					species: new PlantSpeciesValueObject('Test Species'),
					plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
					notes: new PlantNotesValueObject('Test notes'),
					status: new PlantStatusValueObject(status),
				};

				const entity = factory.create(dto);

				expect(entity.status.value).toBe(status);
			});
		});
	});

	describe('fromPrimitives', () => {
		it('should create a PlantEntity from primitives with all fields', () => {
			const primitives: PlantPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Aloe Vera',
				species: 'Aloe barbadensis',
				plantedDate: new Date('2024-01-15'),
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
			};

			const entity = factory.fromPrimitives(primitives);

			expect(entity).toBeInstanceOf(PlantEntity);
			expect(entity.id.value).toBe(primitives.id);
			expect(entity.growingUnitId.value).toBe(primitives.growingUnitId);
			expect(entity.name.value).toBe(primitives.name);
			expect(entity.species.value).toBe(primitives.species);
			expect(entity.plantedDate?.value).toEqual(primitives.plantedDate);
			expect(entity.notes?.value).toBe(primitives.notes);
			expect(entity.status.value).toBe(primitives.status);
		});

		it('should create a PlantEntity from primitives with null plantedDate', () => {
			const primitives: PlantPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Aloe Vera',
				species: 'Aloe barbadensis',
				plantedDate: null,
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
			};

			const entity = factory.fromPrimitives(primitives);

			expect(entity).toBeInstanceOf(PlantEntity);
			expect(entity.id.value).toBe(primitives.id);
			expect(entity.plantedDate).toBeNull();
		});

		it('should create a PlantEntity from primitives with null notes', () => {
			const primitives: PlantPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Aloe Vera',
				species: 'Aloe barbadensis',
				plantedDate: new Date('2024-01-15'),
				notes: null,
				status: PlantStatusEnum.PLANTED,
			};

			const entity = factory.fromPrimitives(primitives);

			expect(entity).toBeInstanceOf(PlantEntity);
			expect(entity.id.value).toBe(primitives.id);
			expect(entity.notes).toBeNull();
		});

		it('should create a PlantEntity from primitives with empty notes string', () => {
			const primitives: PlantPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Aloe Vera',
				species: 'Aloe barbadensis',
				plantedDate: new Date('2024-01-15'),
				notes: '',
				status: PlantStatusEnum.PLANTED,
			};

			const entity = factory.fromPrimitives(primitives);

			expect(entity).toBeInstanceOf(PlantEntity);
			// Empty string is falsy, so it becomes null
			expect(entity.notes).toBeNull();
		});

		it('should create value objects correctly from primitives', () => {
			const primitives: PlantPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Aloe Vera',
				species: 'Aloe barbadensis',
				plantedDate: new Date('2024-01-15'),
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
			};

			const entity = factory.fromPrimitives(primitives);

			expect(entity.id).toBeInstanceOf(PlantUuidValueObject);
			expect(entity.growingUnitId).toBeInstanceOf(GrowingUnitUuidValueObject);
			expect(entity.name).toBeInstanceOf(PlantNameValueObject);
			expect(entity.species).toBeInstanceOf(PlantSpeciesValueObject);
			expect(entity.plantedDate).toBeInstanceOf(PlantPlantedDateValueObject);
			expect(entity.notes).toBeInstanceOf(PlantNotesValueObject);
			expect(entity.status).toBeInstanceOf(PlantStatusValueObject);
		});

		it('should create a PlantEntity from primitives with different status values', () => {
			const statuses = [
				PlantStatusEnum.PLANTED,
				PlantStatusEnum.GROWING,
				PlantStatusEnum.HARVESTED,
				PlantStatusEnum.DEAD,
				PlantStatusEnum.ARCHIVED,
			];

			statuses.forEach((status) => {
				const primitives: PlantPrimitives = {
					id: '123e4567-e89b-12d3-a456-426614174000',
					growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
					name: 'Test Plant',
					species: 'Test Species',
					plantedDate: new Date('2024-01-15'),
					notes: 'Test notes',
					status,
				};

				const entity = factory.fromPrimitives(primitives);

				expect(entity.status.value).toBe(status);
			});
		});

		it('should handle different date formats in primitives', () => {
			const dates = [
				new Date('2024-01-15'),
				new Date('2024-12-31T23:59:59Z'),
				new Date('2023-06-15T12:30:45.123Z'),
			];

			dates.forEach((date) => {
				const primitives: PlantPrimitives = {
					id: '123e4567-e89b-12d3-a456-426614174000',
					growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
					name: 'Test Plant',
					species: 'Test Species',
					plantedDate: date,
					notes: 'Test notes',
					status: PlantStatusEnum.PLANTED,
				};

				const entity = factory.fromPrimitives(primitives);

				expect(entity.plantedDate?.value).toEqual(date);
			});
		});
	});
});
