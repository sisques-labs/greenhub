import { Test } from '@nestjs/testing';
import { PlantNotFoundException } from '@/core/plant-context/application/exceptions/plant/plant-not-found/plant-not-found.exception';
import { AssertPlantExistsService } from '@/core/plant-context/application/services/plant/assert-plant-exists/assert-plant-exists.service';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import {
	IPlantWriteRepository,
	PLANT_WRITE_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-write/plant-write.repository';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('AssertPlantExistsService', () => {
	let service: AssertPlantExistsService;
	let mockPlantWriteRepository: jest.Mocked<IPlantWriteRepository>;
	let plantEntityFactory: PlantEntityFactory;

	beforeEach(async () => {
		plantEntityFactory = new PlantEntityFactory();
		mockPlantWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IPlantWriteRepository>;

		const module = await Test.createTestingModule({
			providers: [
				AssertPlantExistsService,
				{
					provide: PLANT_WRITE_REPOSITORY_TOKEN,
					useValue: mockPlantWriteRepository,
				},
			],
		}).compile();

		service = module.get<AssertPlantExistsService>(AssertPlantExistsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return plant entity when found', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			mockPlantWriteRepository.findById.mockResolvedValue(mockPlant);

			const result = await service.execute(plantId);

			expect(result).toBe(mockPlant);
			expect(mockPlantWriteRepository.findById).toHaveBeenCalledWith(plantId);
			expect(mockPlantWriteRepository.findById).toHaveBeenCalledTimes(1);
		});

		it('should throw PlantNotFoundException when plant does not exist', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';

			mockPlantWriteRepository.findById.mockResolvedValue(null);

			await expect(service.execute(plantId)).rejects.toThrow(
				PlantNotFoundException,
			);
			expect(mockPlantWriteRepository.findById).toHaveBeenCalledWith(plantId);
		});

		it('should throw exception with correct message', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';

			mockPlantWriteRepository.findById.mockResolvedValue(null);

			await expect(service.execute(plantId)).rejects.toThrow(
				`Plant with id ${plantId} not found`,
			);
		});
	});
});
