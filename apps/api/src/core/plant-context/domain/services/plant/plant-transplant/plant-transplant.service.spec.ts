import { AssertPlantExistsInGrowingUnitService } from '@/core/plant-context/application/services/growing-unit/assert-plant-exists-in-growing-unit/assert-plant-exists-in-growing-unit.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitPlantNotFoundException } from '@/core/plant-context/domain/exceptions/growing-unit-plant-not-found/growing-unit-plant-not-found.exception';
import { GrowingUnitFullCapacityException } from '@/core/plant-context/domain/exceptions/growing-unit/growing-unit-full-capacity/growing-unit-full-capacity.exception';
import { PlantTransplantService } from '@/core/plant-context/domain/services/plant/plant-transplant/plant-transplant.service';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantTransplantService', () => {
	let service: PlantTransplantService;
	let sourceGrowingUnit: GrowingUnitAggregate;
	let targetGrowingUnit: GrowingUnitAggregate;
	let plant: PlantEntity;
	const plantId = '123e4567-e89b-12d3-a456-426614174000';
	const sourceGrowingUnitId = '223e4567-e89b-12d3-a456-426614174000';
	const targetGrowingUnitId = '323e4567-e89b-12d3-a456-426614174000';

	let mockAssertPlantExistsInGrowingUnitService: jest.Mocked<AssertPlantExistsInGrowingUnitService>;

	beforeEach(() => {
		mockAssertPlantExistsInGrowingUnitService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertPlantExistsInGrowingUnitService>;

		service = new PlantTransplantService(
			mockAssertPlantExistsInGrowingUnitService,
		);
		const locationId = '423e4567-e89b-12d3-a456-426614174000';

		// Create source growing unit with capacity for 5 plants
		sourceGrowingUnit = new GrowingUnitAggregate({
			id: new GrowingUnitUuidValueObject(sourceGrowingUnitId),
			locationId: new LocationUuidValueObject(locationId),
			name: new GrowingUnitNameValueObject('Source Unit'),
			type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT),
			capacity: new GrowingUnitCapacityValueObject(5),
			dimensions: null,
			plants: [],
		});

		// Create target growing unit with capacity for 3 plants
		targetGrowingUnit = new GrowingUnitAggregate({
			id: new GrowingUnitUuidValueObject(targetGrowingUnitId),
			locationId: new LocationUuidValueObject(locationId),
			name: new GrowingUnitNameValueObject('Target Unit'),
			type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT),
			capacity: new GrowingUnitCapacityValueObject(3),
			dimensions: null,
			plants: [],
		});

		// Create a plant
		plant = new PlantEntity({
			id: new PlantUuidValueObject(plantId),
			name: new PlantNameValueObject('Aloe Vera'),
			species: new PlantSpeciesValueObject('Aloe barbadensis'),
			plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
			notes: new PlantNotesValueObject('Keep in indirect sunlight'),
			status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
		});

		// Add plant to source growing unit
		sourceGrowingUnit.addPlant(plant, false);
	});

	describe('execute', () => {
		it('should successfully transplant a plant from source to target growing unit', async () => {
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(
				plant,
			);

			const input = {
				sourceGrowingUnit,
				targetGrowingUnit,
				plantId,
			};

			const result = await service.execute(input);

			expect(result).toBeInstanceOf(PlantEntity);
			expect(result.id.value).toBe(plantId);

			// Verify plant was removed from source
			const plantInSource = sourceGrowingUnit.getPlantById(plantId);
			expect(plantInSource).toBeNull();

			// Verify plant was added to target
			const plantInTarget = targetGrowingUnit.getPlantById(plantId);
			expect(plantInTarget).not.toBeNull();
			expect(plantInTarget?.id.value).toBe(plantId);
		});

		it('should update plant growingUnitId after transplant', async () => {
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(
				plant,
			);

			const input = {
				sourceGrowingUnit,
				targetGrowingUnit,
				plantId,
			};

			const result = await service.execute(input);

			expect(result.id.value).toBe(plantId);
			expect(targetGrowingUnit.plants.some((p) => p.id.value === plantId)).toBe(
				true,
			);
			expect(sourceGrowingUnit.plants.some((p) => p.id.value === plantId)).toBe(
				false,
			);
		});

		it('should throw GrowingUnitPlantNotFoundException when plant is not found in source', async () => {
			const nonExistentPlantId = '999e4567-e89b-12d3-a456-426614174000';
			mockAssertPlantExistsInGrowingUnitService.execute.mockRejectedValue(
				new GrowingUnitPlantNotFoundException(
					sourceGrowingUnitId,
					nonExistentPlantId,
				),
			);

			const input = {
				sourceGrowingUnit,
				targetGrowingUnit,
				plantId: nonExistentPlantId,
			};

			await expect(service.execute(input)).rejects.toThrow(
				GrowingUnitPlantNotFoundException,
			);
			await expect(service.execute(input)).rejects.toThrow(
				`Plant ${nonExistentPlantId} not found in growing unit ${sourceGrowingUnitId}`,
			);
		});

		it('should throw GrowingUnitFullCapacityException when target has no capacity', async () => {
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(
				plant,
			);

			// Fill target growing unit to capacity
			for (let i = 0; i < 3; i++) {
				const testPlant = new PlantEntity({
					id: new PlantUuidValueObject(
						`${i}23e4567-e89b-12d3-a456-426614174000`,
					),
					name: new PlantNameValueObject(`Test Plant ${i}`),
					species: new PlantSpeciesValueObject('Test Species'),
					plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
					notes: null,
					status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
				});
				targetGrowingUnit.addPlant(testPlant, false);
			}

			const input = {
				sourceGrowingUnit,
				targetGrowingUnit,
				plantId,
			};

			await expect(service.execute(input)).rejects.toThrow(
				GrowingUnitFullCapacityException,
			);
			await expect(service.execute(input)).rejects.toThrow(
				`Growing unit ${targetGrowingUnitId} is at full capacity`,
			);
		});

		it('should successfully transplant when target has available capacity', async () => {
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(
				plant,
			);

			// Add 2 plants to target (capacity is 3, so 1 slot remains)
			for (let i = 0; i < 2; i++) {
				const testPlant = new PlantEntity({
					id: new PlantUuidValueObject(
						`${i}23e4567-e89b-12d3-a456-426614174000`,
					),
					name: new PlantNameValueObject(`Test Plant ${i}`),
					species: new PlantSpeciesValueObject('Test Species'),
					plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
					notes: null,
					status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
				});
				targetGrowingUnit.addPlant(testPlant, false);
			}

			const input = {
				sourceGrowingUnit,
				targetGrowingUnit,
				plantId,
			};

			const result = await service.execute(input);

			expect(result).toBeInstanceOf(PlantEntity);
			expect(result.id.value).toBe(plantId);

			// Verify plant is in target
			const plantInTarget = targetGrowingUnit.getPlantById(plantId);
			expect(plantInTarget).not.toBeNull();
		});

		it('should preserve plant properties after transplant', async () => {
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(
				plant,
			);

			const input = {
				sourceGrowingUnit,
				targetGrowingUnit,
				plantId,
			};

			const result = await service.execute(input);

			expect(result.name.value).toBe('Aloe Vera');
			expect(result.species.value).toBe('Aloe barbadensis');
			expect(result.status.value).toBe(PlantStatusEnum.PLANTED);
			expect(result.plantedDate?.value).toEqual(new Date('2024-01-15'));
			expect(result.notes?.value).toBe('Keep in indirect sunlight');
		});

		it('should handle transplant when source has multiple plants', async () => {
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(
				plant,
			);

			// Add additional plants to source (using different UUIDs to avoid conflicts)
			const additionalPlantIds = [
				'523e4567-e89b-12d3-a456-426614174000',
				'623e4567-e89b-12d3-a456-426614174000',
			];

			for (let i = 0; i < additionalPlantIds.length; i++) {
				const testPlant = new PlantEntity({
					id: new PlantUuidValueObject(additionalPlantIds[i]),
					name: new PlantNameValueObject(`Test Plant ${i + 1}`),
					species: new PlantSpeciesValueObject('Test Species'),
					plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
					notes: null,
					status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
				});
				sourceGrowingUnit.addPlant(testPlant, false);
			}

			const input = {
				sourceGrowingUnit,
				targetGrowingUnit,
				plantId,
			};

			const result = await service.execute(input);

			expect(result.id.value).toBe(plantId);
			expect(targetGrowingUnit.plants.some((p) => p.id.value === plantId)).toBe(
				true,
			);

			// Verify other plants remain in source
			const remainingPlants = sourceGrowingUnit.plants;
			expect(remainingPlants.length).toBe(2);
			expect(remainingPlants.some((p) => p.id.value === plantId)).toBe(false);
			// Verify the additional plants are still there
			expect(
				remainingPlants.some((p) => p.id.value === additionalPlantIds[0]),
			).toBe(true);
			expect(
				remainingPlants.some((p) => p.id.value === additionalPlantIds[1]),
			).toBe(true);
		});

		it('should handle transplant when target already has plants', async () => {
			mockAssertPlantExistsInGrowingUnitService.execute.mockResolvedValue(
				plant,
			);

			// Add a plant to target
			const existingPlant = new PlantEntity({
				id: new PlantUuidValueObject('423e4567-e89b-12d3-a456-426614174000'),
				name: new PlantNameValueObject('Existing Plant'),
				species: new PlantSpeciesValueObject('Existing Species'),
				plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});
			targetGrowingUnit.addPlant(existingPlant, false);

			const input = {
				sourceGrowingUnit,
				targetGrowingUnit,
				plantId,
			};

			const result = await service.execute(input);

			expect(result.id.value).toBe(plantId);

			// Verify both plants are in target
			const plantsInTarget = targetGrowingUnit.plants;
			expect(plantsInTarget.length).toBe(2);
			expect(plantsInTarget.some((p) => p.id.value === plantId)).toBe(true);
			expect(
				plantsInTarget.some((p) => p.id.value === existingPlant.id.value),
			).toBe(true);
		});
	});
});
