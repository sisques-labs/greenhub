import { GrowingUnitDeletedEvent } from '@/core/plant-context/application/events/growing-unit/growing-unit-deleted/growing-unit-deleted.event';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import type { IGrowingUnitDto } from '@/core/plant-context/domain/dtos/entities/growing-unit/growing-unit.dto';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitCapacityChangedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/field-changed/growing-unit-capacity-changed/growing-unit-capacity-changed.event';
import { GrowingUnitDimensionsChangedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/field-changed/growing-unit-dimensions-changed/growing-unit-dimensions-changed.event';
import { GrowingUnitNameChangedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/field-changed/growing-unit-name-changed/growing-unit-name-changed.event';
import { GrowingUnitTypeChangedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/field-changed/growing-unit-type-changed/growing-unit-type-changed.event';
import { GrowingUnitPlantAddedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/growing-unit-plant-added/growing-unit-plant-added.event';
import { GrowingUnitPlantRemovedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/growing-unit-plant-removed/growing-unit-plant-removed.event';
import { PlantGrowingUnitChangedEvent } from '@/core/plant-context/domain/events/plant/field-changed/plant-growing-unit-changed/plant-growing-unit-changed.event';
import { PlantNameChangedEvent } from '@/core/plant-context/domain/events/plant/field-changed/plant-name-changed/plant-name-changed.event';
import { PlantNotesChangedEvent } from '@/core/plant-context/domain/events/plant/field-changed/plant-notes-changed/plant-notes-changed.event';
import { PlantPlantedDateChangedEvent } from '@/core/plant-context/domain/events/plant/field-changed/plant-planted-date-changed/plant-planted-date-changed.event';
import { PlantSpeciesChangedEvent } from '@/core/plant-context/domain/events/plant/field-changed/plant-species-changed/plant-species-changed.event';
import { PlantStatusChangedEvent } from '@/core/plant-context/domain/events/plant/field-changed/plant-status-changed/plant-status-changed.event';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('GrowingUnitAggregate', () => {
	let plantEntityFactory: PlantEntityFactory;
	let growingUnitId: GrowingUnitUuidValueObject;
	let growingUnitDto: IGrowingUnitDto;

	beforeEach(() => {
		plantEntityFactory = new PlantEntityFactory();
		growingUnitId = new GrowingUnitUuidValueObject();

		growingUnitDto = {
			id: growingUnitId,
			locationId: new LocationUuidValueObject(),
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
	});

	describe('constructor', () => {
		it('should create a growing unit aggregate with all properties', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			expect(aggregate.id).toBe(growingUnitId);
			expect(aggregate.name.value).toBe('Garden Bed 1');
			expect(aggregate.type.value).toBe(GrowingUnitTypeEnum.GARDEN_BED);
			expect(aggregate.capacity.value).toBe(10);
			expect(aggregate.dimensions).not.toBeNull();
			expect(aggregate.plants).toEqual([]);
		});

		it('should create a growing unit aggregate without dimensions', () => {
			const dtoWithoutDimensions: IGrowingUnitDto = {
				...growingUnitDto,
				dimensions: null,
			};

			const aggregate = new GrowingUnitAggregate(dtoWithoutDimensions);

			expect(aggregate.dimensions).toBeNull();
		});

		it('should not generate GrowingUnitCreatedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const events = aggregate.getUncommittedEvents();

			// Note: GrowingUnitAggregate constructor does not generate events
			expect(events).toHaveLength(0);
		});

		it('should not generate event (constructor does not support generateEvent parameter)', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const events = aggregate.getUncommittedEvents();

			expect(events).toHaveLength(0);
		});
	});

	describe('addPlant', () => {
		it('should add a plant to the growing unit', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);

			expect(aggregate.plants).toHaveLength(1);
			expect(aggregate.plants[0].id.value).toBe(plant.id.value);
		});

		it('should generate GrowingUnitPlantAddedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(GrowingUnitPlantAddedEvent);
		});

		it('should not generate event when generateEvent is false', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(0);
		});
	});

	describe('removePlant', () => {
		it('should remove a plant from the growing unit', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant1 = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});
			const plant2 = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Tomato'),
				species: new PlantSpeciesValueObject('Solanum lycopersicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant1, false);
			aggregate.addPlant(plant2, false);
			aggregate.removePlant(plant1, false);

			expect(aggregate.plants).toHaveLength(1);
			expect(aggregate.plants[0].id.value).toBe(plant2.id.value);
		});

		it('should generate GrowingUnitPlantRemovedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.removePlant(plant);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(GrowingUnitPlantRemovedEvent);
		});

		it('should not remove plant if it does not exist', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.removePlant(plant, false);

			expect(aggregate.plants).toHaveLength(0);
		});
	});

	describe('changePlantStatus', () => {
		it('should change plant status', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantStatus(
				plant.id.value,
				new PlantStatusValueObject(PlantStatusEnum.GROWING),
				false,
			);

			const updatedPlant = aggregate.getPlantById(plant.id.value);
			expect(updatedPlant?.status.value).toBe(PlantStatusEnum.GROWING);
		});

		it('should generate PlantStatusChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantStatus(
				plant.id.value,
				new PlantStatusValueObject(PlantStatusEnum.GROWING),
			);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(PlantStatusChangedEvent);
		});

		it('should not change status if plant does not exist', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			aggregate.changePlantStatus(
				'non-existent-id',
				new PlantStatusValueObject(PlantStatusEnum.GROWING),
				false,
			);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(0);
		});
	});

	describe('changePlantName', () => {
		it('should change plant name', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantName(
				plant.id.value,
				new PlantNameValueObject('Sweet Basil'),
				false,
			);

			const updatedPlant = aggregate.getPlantById(plant.id.value);
			expect(updatedPlant?.name.value).toBe('Sweet Basil');
		});

		it('should generate PlantNameChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantName(
				plant.id.value,
				new PlantNameValueObject('Sweet Basil'),
			);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(PlantNameChangedEvent);
		});
	});

	describe('changePlantSpecies', () => {
		it('should change plant species', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantSpecies(
				plant.id.value,
				new PlantSpeciesValueObject('Ocimum tenuiflorum'),
				false,
			);

			const updatedPlant = aggregate.getPlantById(plant.id.value);
			expect(updatedPlant?.species.value).toBe('Ocimum tenuiflorum');
		});

		it('should generate PlantSpeciesChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantSpecies(
				plant.id.value,
				new PlantSpeciesValueObject('Ocimum tenuiflorum'),
			);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(PlantSpeciesChangedEvent);
		});
	});

	describe('changePlantPlantedDate', () => {
		it('should change plant planted date', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			const newDate = new Date('2024-01-15');
			aggregate.changePlantPlantedDate(
				plant.id.value,
				new PlantPlantedDateValueObject(newDate),
				false,
			);

			const updatedPlant = aggregate.getPlantById(plant.id.value);
			expect(updatedPlant?.plantedDate?.value).toEqual(newDate);
		});

		it('should generate PlantPlantedDateChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantPlantedDate(
				plant.id.value,
				new PlantPlantedDateValueObject(new Date()),
			);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(PlantPlantedDateChangedEvent);
		});
	});

	describe('changePlantNotes', () => {
		it('should change plant notes', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantNotes(
				plant.id.value,
				new PlantNotesValueObject('Keep in indirect sunlight'),
				false,
			);

			const updatedPlant = aggregate.getPlantById(plant.id.value);
			expect(updatedPlant?.notes?.value).toBe('Keep in indirect sunlight');
		});

		it('should generate PlantNotesChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantNotes(
				plant.id.value,
				new PlantNotesValueObject('Keep in indirect sunlight'),
			);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(PlantNotesChangedEvent);
		});
	});

	describe('changePlantGrowingUnit', () => {
		it('should change plant growing unit', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const newGrowingUnitId = new GrowingUnitUuidValueObject();
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantGrowingUnit(plant.id.value, newGrowingUnitId, false);

			const updatedPlant = aggregate.getPlantById(plant.id.value);
			expect(updatedPlant?.growingUnitId.value).toBe(newGrowingUnitId.value);
		});

		it('should generate PlantGrowingUnitChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const newGrowingUnitId = new GrowingUnitUuidValueObject();
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			aggregate.changePlantGrowingUnit(plant.id.value, newGrowingUnitId);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(PlantGrowingUnitChangedEvent);
		});
	});

	describe('changeName', () => {
		it('should change growing unit name', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			aggregate.changeName(
				new GrowingUnitNameValueObject('Garden Bed 2'),
				false,
			);

			expect(aggregate.name.value).toBe('Garden Bed 2');
		});

		it('should generate GrowingUnitNameChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			aggregate.changeName(new GrowingUnitNameValueObject('Garden Bed 2'));

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(GrowingUnitNameChangedEvent);
		});
	});

	describe('changeType', () => {
		it('should change growing unit type', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			aggregate.changeType(
				new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT),
				false,
			);

			expect(aggregate.type.value).toBe(GrowingUnitTypeEnum.POT);
		});

		it('should generate GrowingUnitTypeChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			aggregate.changeType(
				new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT),
			);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(GrowingUnitTypeChangedEvent);
		});
	});

	describe('changeCapacity', () => {
		it('should change growing unit capacity', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			aggregate.changeCapacity(new GrowingUnitCapacityValueObject(20), false);

			expect(aggregate.capacity.value).toBe(20);
		});

		it('should generate GrowingUnitCapacityChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			aggregate.changeCapacity(new GrowingUnitCapacityValueObject(20));

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(GrowingUnitCapacityChangedEvent);
		});
	});

	describe('changeDimensions', () => {
		it('should change growing unit dimensions', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const newDimensions = new DimensionsValueObject({
				length: 200,
				width: 100,
				height: 50,
				unit: LengthUnitEnum.CENTIMETER,
			});

			aggregate.changeDimensions(newDimensions, false);

			expect(aggregate.dimensions?.toPrimitives()).toEqual(
				newDimensions.toPrimitives(),
			);
		});

		it('should generate GrowingUnitDimensionsChangedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const newDimensions = new DimensionsValueObject({
				length: 200,
				width: 100,
				height: 50,
				unit: LengthUnitEnum.CENTIMETER,
			});

			aggregate.changeDimensions(newDimensions);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(GrowingUnitDimensionsChangedEvent);
		});
	});

	describe('delete', () => {
		it('should generate GrowingUnitDeletedEvent by default', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			aggregate.delete();

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(1);
			expect(events[0]).toBeInstanceOf(GrowingUnitDeletedEvent);
		});

		it('should not generate event when generateEvent is false', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			aggregate.delete(false);

			const events = aggregate.getUncommittedEvents();
			expect(events).toHaveLength(0);
		});
	});

	describe('getPlantById', () => {
		it('should return plant when found', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);

			const foundPlant = aggregate.getPlantById(plant.id.value);
			expect(foundPlant).not.toBeNull();
			expect(foundPlant?.id.value).toBe(plant.id.value);
		});

		it('should return null when plant not found', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			const foundPlant = aggregate.getPlantById('non-existent-id');
			expect(foundPlant).toBeNull();
		});
	});

	describe('hasCapacity', () => {
		it('should return true when there is capacity', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			expect(aggregate.hasCapacity()).toBe(true);
		});

		it('should return false when at capacity', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			// Add 10 plants to reach capacity
			for (let i = 0; i < 10; i++) {
				const plant = plantEntityFactory.create({
					id: new PlantUuidValueObject(),
					growingUnitId: growingUnitId,
					name: new PlantNameValueObject(`Plant ${i}`),
					species: new PlantSpeciesValueObject('Test species'),
					plantedDate: new PlantPlantedDateValueObject(new Date()),
					notes: null,
					status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
				});
				aggregate.addPlant(plant, false);
			}

			expect(aggregate.hasCapacity()).toBe(false);
		});
	});

	describe('getRemainingCapacity', () => {
		it('should return correct remaining capacity', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			expect(aggregate.getRemainingCapacity()).toBe(10);

			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			expect(aggregate.getRemainingCapacity()).toBe(9);
		});

		it('should return 0 when at capacity', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);

			// Add 10 plants to reach capacity
			for (let i = 0; i < 10; i++) {
				const plant = plantEntityFactory.create({
					id: new PlantUuidValueObject(),
					growingUnitId: growingUnitId,
					name: new PlantNameValueObject(`Plant ${i}`),
					species: new PlantSpeciesValueObject('Test species'),
					plantedDate: new PlantPlantedDateValueObject(new Date()),
					notes: null,
					status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
				});
				aggregate.addPlant(plant, false);
			}

			expect(aggregate.getRemainingCapacity()).toBe(0);
		});
	});

	describe('toPrimitives', () => {
		it('should convert aggregate to primitives', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const primitives = aggregate.toPrimitives();

			expect(primitives.id).toBe(growingUnitId.value);
			expect(primitives.name).toBe('Garden Bed 1');
			expect(primitives.type).toBe(GrowingUnitTypeEnum.GARDEN_BED);
			expect(primitives.capacity).toBe(10);
			expect(primitives.dimensions).not.toBeNull();
			expect(primitives.plants).toEqual([]);
		});

		it('should include plants in primitives', () => {
			const aggregate = new GrowingUnitAggregate(growingUnitDto);
			const plant = plantEntityFactory.create({
				id: new PlantUuidValueObject(),
				growingUnitId: growingUnitId,
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: new PlantPlantedDateValueObject(new Date()),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			aggregate.addPlant(plant, false);
			const primitives = aggregate.toPrimitives();

			expect(primitives.plants).toHaveLength(1);
			expect(primitives.plants[0].id).toBe(plant.id.value);
		});
	});
});
