import { Repository } from "typeorm";
import { GrowingUnitAggregate } from "@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate";
import { GrowingUnitTypeEnum } from "@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum";
import { GrowingUnitAggregateFactory } from "@/core/plant-context/domain/factories/aggregates/growing-unit/growing-unit-aggregate.factory";
import { PlantEntityFactory } from "@/core/plant-context/domain/factories/entities/plant/plant-entity.factory";
import { GrowingUnitCapacityValueObject } from "@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo";
import { GrowingUnitNameValueObject } from "@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo";
import { GrowingUnitTypeValueObject } from "@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo";
import { GrowingUnitTypeormEntity } from "@/core/plant-context/infrastructure/database/typeorm/entities/growing-unit-typeorm.entity";
import { GrowingUnitTypeormMapper } from "@/core/plant-context/infrastructure/database/typeorm/mappers/growing-unit/growing-unit-typeorm.mapper";
import { GrowingUnitTypeormRepository } from "@/core/plant-context/infrastructure/database/typeorm/repositories/growing-unit/growing-unit-typeorm.repository";
import { GrowingUnitUuidValueObject } from "@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo";
import { TypeormMasterService } from "@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service";

describe("GrowingUnitTypeormRepository", () => {
	let repository: GrowingUnitTypeormRepository;
	let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
	let mockGrowingUnitTypeormMapper: jest.Mocked<GrowingUnitTypeormMapper>;
	let mockTypeormRepository: jest.Mocked<Repository<GrowingUnitTypeormEntity>>;
	let mockFindOne: jest.Mock;
	let mockSave: jest.Mock;
	let mockSoftDelete: jest.Mock;
	let growingUnitAggregateFactory: GrowingUnitAggregateFactory;

	beforeEach(() => {
		mockFindOne = jest.fn();
		mockSave = jest.fn();
		mockSoftDelete = jest.fn();

		mockTypeormRepository = {
			findOne: mockFindOne,
			save: mockSave,
			softDelete: mockSoftDelete,
		} as unknown as jest.Mocked<Repository<GrowingUnitTypeormEntity>>;

		mockTypeormMasterService = {
			getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
		} as unknown as jest.Mocked<TypeormMasterService>;

		mockGrowingUnitTypeormMapper = {
			toDomainEntity: jest.fn(),
			toTypeormEntity: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitTypeormMapper>;

		const plantEntityFactory = new PlantEntityFactory();
		growingUnitAggregateFactory = new GrowingUnitAggregateFactory(
			plantEntityFactory,
		);

		repository = new GrowingUnitTypeormRepository(
			mockTypeormMasterService,
			mockGrowingUnitTypeormMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("findById", () => {
		it("should return growing unit aggregate when growing unit exists", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const now = new Date();

			const typeormEntity = new GrowingUnitTypeormEntity();
			typeormEntity.id = growingUnitId;
			typeormEntity.name = "Garden Bed 1";
			typeormEntity.type = GrowingUnitTypeEnum.GARDEN_BED;
			typeormEntity.capacity = 10;
			typeormEntity.length = null;
			typeormEntity.width = null;
			typeormEntity.height = null;
			typeormEntity.unit = null;
			typeormEntity.plants = [];
			typeormEntity.createdAt = now;
			typeormEntity.updatedAt = now;
			typeormEntity.deletedAt = null;

			const growingUnitAggregate = growingUnitAggregateFactory.create({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockFindOne.mockResolvedValue(typeormEntity);
			mockGrowingUnitTypeormMapper.toDomainEntity.mockReturnValue(
				growingUnitAggregate,
			);

			const result = await repository.findById(growingUnitId);

			expect(result).toBe(growingUnitAggregate);
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { id: growingUnitId },
				relations: {
					plants: true,
				},
			});
			expect(mockGrowingUnitTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				typeormEntity,
			);
			expect(mockGrowingUnitTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(
				1,
			);
		});

		it("should return null when growing unit does not exist", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";

			mockFindOne.mockResolvedValue(null);

			const result = await repository.findById(growingUnitId);

			expect(result).toBeNull();
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { id: growingUnitId },
				relations: {
					plants: true,
				},
			});
			expect(
				mockGrowingUnitTypeormMapper.toDomainEntity,
			).not.toHaveBeenCalled();
		});
	});

	describe("save", () => {
		it("should save growing unit aggregate and return it", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const now = new Date();

			const growingUnitAggregate = growingUnitAggregateFactory.create({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			const typeormEntity = new GrowingUnitTypeormEntity();
			typeormEntity.id = growingUnitId;
			typeormEntity.name = "Garden Bed 1";
			typeormEntity.type = GrowingUnitTypeEnum.GARDEN_BED;
			typeormEntity.capacity = 10;
			typeormEntity.length = null;
			typeormEntity.width = null;
			typeormEntity.height = null;
			typeormEntity.unit = null;
			typeormEntity.plants = [];
			typeormEntity.createdAt = now;
			typeormEntity.updatedAt = now;
			typeormEntity.deletedAt = null;

			const savedEntity = new GrowingUnitTypeormEntity();
			Object.assign(savedEntity, typeormEntity);

			mockGrowingUnitTypeormMapper.toTypeormEntity.mockReturnValue(
				typeormEntity,
			);
			mockSave.mockResolvedValue(savedEntity);
			mockGrowingUnitTypeormMapper.toDomainEntity.mockReturnValue(
				growingUnitAggregate,
			);

			const result = await repository.save(growingUnitAggregate);

			expect(result).toBe(growingUnitAggregate);
			expect(mockGrowingUnitTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
				growingUnitAggregate,
			);
			expect(mockSave).toHaveBeenCalledWith(typeormEntity);
			expect(mockGrowingUnitTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				savedEntity,
			);
		});
	});

	describe("delete", () => {
		it("should soft delete growing unit by id", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";

			mockSoftDelete.mockResolvedValue(undefined);

			await repository.delete(growingUnitId);

			expect(mockSoftDelete).toHaveBeenCalledWith(growingUnitId);
			expect(mockSoftDelete).toHaveBeenCalledTimes(1);
		});
	});
});
