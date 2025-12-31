import { IPlantDto } from '@/core/plant-context/domain/dtos/entities/plant/plant.dto';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantPlantedDateMissingException } from '@/core/plant-context/domain/exceptions/growing-unit-plant-planted-date-missing/growing-unit-plant-planted-date-missing.exception';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantEntity', () => {
	let plantId: PlantUuidValueObject;
	let growingUnitId: GrowingUnitUuidValueObject;
	let plantDto: IPlantDto;

	beforeEach(() => {
		plantId = new PlantUuidValueObject();
		growingUnitId = new GrowingUnitUuidValueObject();

		plantDto = {
			id: plantId,
			growingUnitId: growingUnitId,
			name: new PlantNameValueObject('Basil'),
			species: new PlantSpeciesValueObject('Ocimum basilicum'),
			plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
			notes: new PlantNotesValueObject('Keep in indirect sunlight'),
			status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
		};
	});

	describe('constructor', () => {
		it('should create a plant entity with all properties', () => {
			const plant = new PlantEntity(plantDto);

			expect(plant.id).toBe(plantId);
			expect(plant.growingUnitId).toBe(growingUnitId);
			expect(plant.name.value).toBe('Basil');
			expect(plant.species.value).toBe('Ocimum basilicum');
			expect(plant.plantedDate?.value).toEqual(new Date('2024-01-15'));
			expect(plant.notes?.value).toBe('Keep in indirect sunlight');
			expect(plant.status.value).toBe(PlantStatusEnum.PLANTED);
		});

		it('should create a plant entity with null plantedDate', () => {
			const dtoWithNullDate: IPlantDto = {
				...plantDto,
				plantedDate: null,
			};

			const plant = new PlantEntity(dtoWithNullDate);

			expect(plant.plantedDate).toBeNull();
		});

		it('should create a plant entity with null notes', () => {
			const dtoWithNullNotes: IPlantDto = {
				...plantDto,
				notes: null,
			};

			const plant = new PlantEntity(dtoWithNullNotes);

			expect(plant.notes).toBeNull();
		});
	});

	describe('changeStatus', () => {
		it('should change plant status', () => {
			const plant = new PlantEntity(plantDto);

			plant.changeStatus(new PlantStatusValueObject(PlantStatusEnum.GROWING));

			expect(plant.status.value).toBe(PlantStatusEnum.GROWING);
		});

		it('should change status to all valid enum values', () => {
			const statuses = [
				PlantStatusEnum.PLANTED,
				PlantStatusEnum.GROWING,
				PlantStatusEnum.HARVESTED,
				PlantStatusEnum.DEAD,
				PlantStatusEnum.ARCHIVED,
			];

			statuses.forEach((status) => {
				const plant = new PlantEntity(plantDto);
				plant.changeStatus(new PlantStatusValueObject(status));
				expect(plant.status.value).toBe(status);
			});
		});
	});

	describe('changeGrowingUnit', () => {
		it('should change growing unit id', () => {
			const plant = new PlantEntity(plantDto);
			const newGrowingUnitId = new GrowingUnitUuidValueObject();

			plant.changeGrowingUnit(newGrowingUnitId);

			expect(plant.growingUnitId.value).toBe(newGrowingUnitId.value);
		});
	});

	describe('changeName', () => {
		it('should change plant name', () => {
			const plant = new PlantEntity(plantDto);

			plant.changeName(new PlantNameValueObject('Sweet Basil'));

			expect(plant.name.value).toBe('Sweet Basil');
		});
	});

	describe('changeSpecies', () => {
		it('should change plant species', () => {
			const plant = new PlantEntity(plantDto);

			plant.changeSpecies(new PlantSpeciesValueObject('Ocimum tenuiflorum'));

			expect(plant.species.value).toBe('Ocimum tenuiflorum');
		});
	});

	describe('changePlantedDate', () => {
		it('should change planted date', () => {
			const plant = new PlantEntity(plantDto);
			const newDate = new Date('2024-02-20');

			plant.changePlantedDate(new PlantPlantedDateValueObject(newDate));

			expect(plant.plantedDate?.value).toEqual(newDate);
		});

		it('should set planted date to null', () => {
			const plant = new PlantEntity(plantDto);

			plant.changePlantedDate(null);

			expect(plant.plantedDate).toBeNull();
		});
	});

	describe('changeNotes', () => {
		it('should change plant notes', () => {
			const plant = new PlantEntity(plantDto);

			plant.changeNotes(new PlantNotesValueObject('Moved to larger pot'));

			expect(plant.notes?.value).toBe('Moved to larger pot');
		});

		it('should set notes to null', () => {
			const plant = new PlantEntity(plantDto);

			plant.changeNotes(null);

			expect(plant.notes).toBeNull();
		});
	});

	describe('getAge', () => {
		it('should return age in milliseconds when planted date is set', () => {
			const plantedDate = new Date('2024-01-15');
			const plant = new PlantEntity({
				...plantDto,
				plantedDate: new PlantPlantedDateValueObject(plantedDate),
			});

			const age = plant.getAge();

			expect(age).toBeGreaterThan(0);
			expect(typeof age).toBe('number');
		});

		it('should throw PlantPlantedDateMissingException when planted date is null', () => {
			const plant = new PlantEntity({
				...plantDto,
				plantedDate: null,
			});

			expect(() => plant.getAge()).toThrow(PlantPlantedDateMissingException);
			expect(() => plant.getAge()).toThrow(
				`Plant ${plantId.value} does not have a planted date`,
			);
		});
	});

	describe('toPrimitives', () => {
		it('should convert entity to primitives with all fields', () => {
			const plant = new PlantEntity(plantDto);
			const primitives = plant.toPrimitives();

			expect(primitives.id).toBe(plantId.value);
			expect(primitives.growingUnitId).toBe(growingUnitId.value);
			expect(primitives.name).toBe('Basil');
			expect(primitives.species).toBe('Ocimum basilicum');
			expect(primitives.plantedDate).toEqual(new Date('2024-01-15'));
			expect(primitives.notes).toBe('Keep in indirect sunlight');
			expect(primitives.status).toBe(PlantStatusEnum.PLANTED);
		});

		it('should convert entity to primitives with null plantedDate', () => {
			const plant = new PlantEntity({
				...plantDto,
				plantedDate: null,
			});
			const primitives = plant.toPrimitives();

			expect(primitives.plantedDate).toBeNull();
		});

		it('should convert entity to primitives with null notes', () => {
			const plant = new PlantEntity({
				...plantDto,
				notes: null,
			});
			const primitives = plant.toPrimitives();

			expect(primitives.notes).toBeNull();
		});
	});

	describe('getters', () => {
		it('should return correct id', () => {
			const plant = new PlantEntity(plantDto);

			expect(plant.id).toBe(plantId);
		});

		it('should return correct growingUnitId', () => {
			const plant = new PlantEntity(plantDto);

			expect(plant.growingUnitId).toBe(growingUnitId);
		});

		it('should return correct name', () => {
			const plant = new PlantEntity(plantDto);

			expect(plant.name.value).toBe('Basil');
		});

		it('should return correct species', () => {
			const plant = new PlantEntity(plantDto);

			expect(plant.species.value).toBe('Ocimum basilicum');
		});

		it('should return correct plantedDate', () => {
			const plant = new PlantEntity(plantDto);

			expect(plant.plantedDate?.value).toEqual(new Date('2024-01-15'));
		});

		it('should return correct notes', () => {
			const plant = new PlantEntity(plantDto);

			expect(plant.notes?.value).toBe('Keep in indirect sunlight');
		});

		it('should return correct status', () => {
			const plant = new PlantEntity(plantDto);

			expect(plant.status.value).toBe(PlantStatusEnum.PLANTED);
		});
	});
});

