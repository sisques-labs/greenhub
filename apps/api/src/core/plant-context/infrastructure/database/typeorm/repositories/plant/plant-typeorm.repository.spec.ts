import { Repository } from "typeorm";
import { PlantEntity } from "@/core/plant-context/domain/entities/plant/plant.entity";
import { PlantStatusEnum } from "@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum";
import { PlantEntityFactory } from "@/core/plant-context/domain/factories/entities/plant/plant-entity.factory";
import { PlantNameValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo";
import { PlantSpeciesValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo";
import { PlantStatusValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo";
import { PlantTypeormEntity } from "@/core/plant-context/infrastructure/database/typeorm/entities/plant-typeorm.entity";
import { PlantTypeormMapper } from "@/core/plant-context/infrastructure/database/typeorm/mappers/plant/plant-typeorm.mapper";
import { PlantTypeormRepository } from "@/core/plant-context/infrastructure/database/typeorm/repositories/plant/plant-typeorm.repository";
import { GrowingUnitUuidValueObject } from "@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo";
import { PlantUuidValueObject } from "@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo";
import { TypeormMasterService } from "@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service";

describe("PlantTypeormRepository", () => {
	let repository: PlantTypeormRepository;
	let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
	let mockPlantTypeormMapper: jest.Mocked<PlantTypeormMapper>;
	let mockTypeormRepository: jest.Mocked<Repository<PlantTypeormEntity>>;
	let mockFindOne: jest.Mock;
	let mockFind: jest.Mock;
	let mockSave: jest.Mock;
	let mockSoftDelete: jest.Mock;
	let plantEntityFactory: PlantEntityFactory;

	beforeEach(() => {
		mockFindOne = jest.fn();
		mockFind = jest.fn();
		mockSave = jest.fn();
		mockSoftDelete = jest.fn();

		mockTypeormRepository = {
			findOne: mockFindOne,
			find: mockFind,
			save: mockSave,
			softDelete: mockSoftDelete,
		} as unknown as jest.Mocked<Repository<PlantTypeormEntity>>;

		mockTypeormMasterService = {
			getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
		} as unknown as jest.Mocked<TypeormMasterService>;

		mockPlantTypeormMapper = {
			toDomainEntity: jest.fn(),
			toTypeormEntity: jest.fn(),
		} as unknown as jest.Mocked<PlantTypeormMapper>;

		plantEntityFactory = new PlantEntityFactory();

		repository = new PlantTypeormRepository(
			mockTypeormMasterService,
			mockPlantTypeormMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("findById", () => {
		it("should return plant entity when plant exists", async () => {
			const plantId = "123e4567-e89b-12d3-a456-426614174000";
			const growingUnitId = "223e4567-e89b-12d3-a456-426614174000";
			const now = new Date();

			const typeormEntity = new PlantTypeormEntity();
			typeormEntity.id = plantId;
			typeormEntity.growingUnitId = growingUnitId;
			typeormEntity.name = "Basil";
			typeormEntity.species = "Ocimum basilicum";
			typeormEntity.plantedDate = null;
			typeormEntity.notes = null;
			typeormEntity.status = PlantStatusEnum.PLANTED;
			typeormEntity.createdAt = now;
			typeormEntity.updatedAt = now;
			typeormEntity.deletedAt = null;

			const plantEntity = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject("Basil"),
				species: new PlantSpeciesValueObject("Ocimum basilicum"),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			mockFindOne.mockResolvedValue(typeormEntity);
			mockPlantTypeormMapper.toDomainEntity.mockReturnValue(plantEntity);

			const result = await repository.findById(plantId);

			expect(result).toBe(plantEntity);
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { id: plantId },
			});
			expect(mockPlantTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				typeormEntity,
			);
			expect(mockPlantTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
		});

		it("should return null when plant does not exist", async () => {
			const plantId = "123e4567-e89b-12d3-a456-426614174000";

			mockFindOne.mockResolvedValue(null);

			const result = await repository.findById(plantId);

			expect(result).toBeNull();
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { id: plantId },
			});
			expect(mockPlantTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
		});
	});

	describe("save", () => {
		it("should save plant entity and return it", async () => {
			const plantId = "123e4567-e89b-12d3-a456-426614174000";
			const growingUnitId = "223e4567-e89b-12d3-a456-426614174000";
			const now = new Date();

			const plantEntity = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject("Basil"),
				species: new PlantSpeciesValueObject("Ocimum basilicum"),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const typeormEntity = new PlantTypeormEntity();
			typeormEntity.id = plantId;
			typeormEntity.growingUnitId = growingUnitId;
			typeormEntity.name = "Basil";
			typeormEntity.species = "Ocimum basilicum";
			typeormEntity.plantedDate = null;
			typeormEntity.notes = null;
			typeormEntity.status = PlantStatusEnum.PLANTED;
			typeormEntity.createdAt = now;
			typeormEntity.updatedAt = now;
			typeormEntity.deletedAt = null;

			const savedEntity = new PlantTypeormEntity();
			Object.assign(savedEntity, typeormEntity);

			mockPlantTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
			mockSave.mockResolvedValue(savedEntity);
			mockPlantTypeormMapper.toDomainEntity.mockReturnValue(plantEntity);

			const result = await repository.save(plantEntity);

			expect(result).toBe(plantEntity);
			expect(mockPlantTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
				plantEntity,
			);
			expect(mockSave).toHaveBeenCalledWith(typeormEntity);
			expect(mockPlantTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				savedEntity,
			);
		});
	});

	describe("delete", () => {
		it("should soft delete plant by id", async () => {
			const plantId = "123e4567-e89b-12d3-a456-426614174000";

			mockSoftDelete.mockResolvedValue(undefined);

			await repository.delete(plantId);

			expect(mockSoftDelete).toHaveBeenCalledWith(plantId);
			expect(mockSoftDelete).toHaveBeenCalledTimes(1);
		});
	});

	describe("findByGrowingUnitId", () => {
		it("should return array of plant entities when plants exist", async () => {
			const growingUnitId = "223e4567-e89b-12d3-a456-426614174000";
			const plantId1 = "123e4567-e89b-12d3-a456-426614174000";
			const plantId2 = "323e4567-e89b-12d3-a456-426614174000";
			const now = new Date();

			const typeormEntity1 = new PlantTypeormEntity();
			typeormEntity1.id = plantId1;
			typeormEntity1.growingUnitId = growingUnitId;
			typeormEntity1.name = "Basil";
			typeormEntity1.species = "Ocimum basilicum";
			typeormEntity1.plantedDate = null;
			typeormEntity1.notes = null;
			typeormEntity1.status = PlantStatusEnum.PLANTED;
			typeormEntity1.createdAt = now;
			typeormEntity1.updatedAt = now;
			typeormEntity1.deletedAt = null;

			const typeormEntity2 = new PlantTypeormEntity();
			typeormEntity2.id = plantId2;
			typeormEntity2.growingUnitId = growingUnitId;
			typeormEntity2.name = "Tomato";
			typeormEntity2.species = "Solanum lycopersicum";
			typeormEntity2.plantedDate = null;
			typeormEntity2.notes = null;
			typeormEntity2.status = PlantStatusEnum.PLANTED;
			typeormEntity2.createdAt = now;
			typeormEntity2.updatedAt = now;
			typeormEntity2.deletedAt = null;

			const plantEntity1 = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId1),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject("Basil"),
				species: new PlantSpeciesValueObject("Ocimum basilicum"),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const plantEntity2 = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId2),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject("Tomato"),
				species: new PlantSpeciesValueObject("Solanum lycopersicum"),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			mockFind.mockResolvedValue([typeormEntity1, typeormEntity2]);
			mockPlantTypeormMapper.toDomainEntity
				.mockReturnValueOnce(plantEntity1)
				.mockReturnValueOnce(plantEntity2);

			const result = await repository.findByGrowingUnitId(growingUnitId);

			expect(result).toHaveLength(2);
			expect(result[0]).toBe(plantEntity1);
			expect(result[1]).toBe(plantEntity2);
			expect(mockFind).toHaveBeenCalledWith({
				where: { growingUnitId: growingUnitId },
			});
			expect(mockPlantTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(2);
		});

		it("should return empty array when no plants exist", async () => {
			const growingUnitId = "223e4567-e89b-12d3-a456-426614174000";

			mockFind.mockResolvedValue([]);

			const result = await repository.findByGrowingUnitId(growingUnitId);

			expect(result).toHaveLength(0);
			expect(mockFind).toHaveBeenCalledWith({
				where: { growingUnitId: growingUnitId },
			});
			expect(mockPlantTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
		});
	});
});
