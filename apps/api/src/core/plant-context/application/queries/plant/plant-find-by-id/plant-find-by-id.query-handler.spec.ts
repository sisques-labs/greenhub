import { IPlantFindByIdQueryDto } from "@/core/plant-context/application/dtos/queries/plant/plant-find-by-id/growing-unit-find-by-id.dto";
import { PlantFindByIdQuery } from "@/core/plant-context/application/queries/plant/plant-find-by-id/plant-find-by-id.query";
import { PlantFindByIdQueryHandler } from "@/core/plant-context/application/queries/plant/plant-find-by-id/plant-find-by-id.query-handler";
import { AssertPlantExistsService } from "@/core/plant-context/application/services/plant/assert-plant-exists/assert-plant-exists.service";
import { PlantStatusEnum } from "@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum";
import { PlantEntityFactory } from "@/core/plant-context/domain/factories/entities/plant/plant-entity.factory";
import { PlantNameValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo";
import { PlantSpeciesValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo";
import { PlantStatusValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo";
import { GrowingUnitUuidValueObject } from "@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo";
import { PlantUuidValueObject } from "@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo";

describe("PlantFindByIdQueryHandler", () => {
	let handler: PlantFindByIdQueryHandler;
	let mockAssertPlantExistsService: jest.Mocked<AssertPlantExistsService>;
	let plantEntityFactory: PlantEntityFactory;

	beforeEach(() => {
		plantEntityFactory = new PlantEntityFactory();
		mockAssertPlantExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertPlantExistsService>;

		handler = new PlantFindByIdQueryHandler(mockAssertPlantExistsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should return plant entity when found", async () => {
			const plantId = "123e4567-e89b-12d3-a456-426614174000";
			const growingUnitId = "223e4567-e89b-12d3-a456-426614174000";
			const queryDto: IPlantFindByIdQueryDto = {
				id: plantId,
			};

			const query = new PlantFindByIdQuery(queryDto);
			const mockPlant = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject("Basil"),
				species: new PlantSpeciesValueObject("Ocimum basilicum"),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);

			const result = await handler.execute(query);

			expect(result).toBe(mockPlant);
			expect(mockAssertPlantExistsService.execute).toHaveBeenCalledWith(
				plantId,
			);
			expect(mockAssertPlantExistsService.execute).toHaveBeenCalledTimes(1);
		});

		it("should throw exception when plant does not exist", async () => {
			const plantId = "123e4567-e89b-12d3-a456-426614174000";
			const queryDto: IPlantFindByIdQueryDto = {
				id: plantId,
			};

			const query = new PlantFindByIdQuery(queryDto);
			const error = new Error("Plant not found");

			mockAssertPlantExistsService.execute.mockRejectedValue(error);

			await expect(handler.execute(query)).rejects.toThrow(error);
			expect(mockAssertPlantExistsService.execute).toHaveBeenCalledWith(
				plantId,
			);
		});
	});
});
