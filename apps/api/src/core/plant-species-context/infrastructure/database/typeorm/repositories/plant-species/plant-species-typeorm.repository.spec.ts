import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesCommonNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-common-name/plant-species-common-name.vo';
import { PlantSpeciesScientificNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-scientific-name/plant-species-scientific-name.vo';
import { PlantSpeciesTypeormEntity } from '@/core/plant-species-context/infrastructure/database/typeorm/entities/plant-species-typeorm.entity';
import { PlantSpeciesTypeormMapper } from '@/core/plant-species-context/infrastructure/database/typeorm/mappers/plant-species/plant-species-typeorm.mapper';
import { PlantSpeciesTypeormRepository } from '@/core/plant-species-context/infrastructure/database/typeorm/repositories/plant-species/plant-species-typeorm.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Repository } from 'typeorm';

describe('PlantSpeciesTypeormRepository', () => {
	let repository: PlantSpeciesTypeormRepository;
	let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
	let mockPlantSpeciesTypeormMapper: jest.Mocked<PlantSpeciesTypeormMapper>;
	let mockTypeormRepository: jest.Mocked<
		Repository<PlantSpeciesTypeormEntity>
	>;
	let mockFindOne: jest.Mock;
	let mockSave: jest.Mock;
	let mockSoftDelete: jest.Mock;

	const speciesId = '123e4567-e89b-12d3-a456-426614174000';
	const now = new Date();

	const buildTypeormEntity = (): PlantSpeciesTypeormEntity => {
		const entity = new PlantSpeciesTypeormEntity();
		entity.id = speciesId;
		entity.commonName = 'Tomato';
		entity.scientificName = 'Solanum lycopersicum';
		entity.family = 'Solanaceae';
		entity.description = 'A common garden vegetable';
		entity.category = PlantSpeciesCategoryEnum.VEGETABLE;
		entity.difficulty = PlantSpeciesDifficultyEnum.EASY;
		entity.growthRate = PlantSpeciesGrowthRateEnum.FAST;
		entity.lightRequirements = PlantSpeciesLightRequirementsEnum.FULL_SUN;
		entity.waterRequirements = PlantSpeciesWaterRequirementsEnum.MEDIUM;
		entity.temperatureRange = { min: 15, max: 30 };
		entity.humidityRequirements = PlantSpeciesHumidityRequirementsEnum.MEDIUM;
		entity.soilType = PlantSpeciesSoilTypeEnum.LOAMY;
		entity.phRange = { min: 6.0, max: 7.0 };
		entity.matureSize = { height: 150, width: 50 };
		entity.growthTime = 80;
		entity.tags = ['vegetable', 'summer'];
		entity.isVerified = true;
		entity.contributorId = null;
		entity.createdAt = now;
		entity.updatedAt = now;
		entity.deletedAt = null;
		return entity;
	};

	const buildMockAggregate = () => ({
		id: { value: speciesId },
		toPrimitives: jest.fn(),
	});

	beforeEach(() => {
		mockFindOne = jest.fn();
		mockSave = jest.fn();
		mockSoftDelete = jest.fn();

		mockTypeormRepository = {
			findOne: mockFindOne,
			save: mockSave,
			softDelete: mockSoftDelete,
		} as unknown as jest.Mocked<Repository<PlantSpeciesTypeormEntity>>;

		mockTypeormMasterService = {
			getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
		} as unknown as jest.Mocked<TypeormMasterService>;

		mockPlantSpeciesTypeormMapper = {
			toDomainEntity: jest.fn(),
			toTypeormEntity: jest.fn(),
		} as unknown as jest.Mocked<PlantSpeciesTypeormMapper>;

		repository = new PlantSpeciesTypeormRepository(
			mockTypeormMasterService,
			mockPlantSpeciesTypeormMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findById', () => {
		it('should return plant species aggregate when found', async () => {
			const typeormEntity = buildTypeormEntity();
			const mockAggregate = buildMockAggregate();

			mockFindOne.mockResolvedValue(typeormEntity);
			mockPlantSpeciesTypeormMapper.toDomainEntity.mockReturnValue(
				mockAggregate as any,
			);

			const result = await repository.findById(speciesId);

			expect(result).toBe(mockAggregate);
			expect(mockFindOne).toHaveBeenCalledWith({ where: { id: speciesId } });
			expect(mockPlantSpeciesTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				typeormEntity,
			);
			expect(mockPlantSpeciesTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(
				1,
			);
		});

		it('should return null when plant species is not found', async () => {
			mockFindOne.mockResolvedValue(null);

			const result = await repository.findById(speciesId);

			expect(result).toBeNull();
			expect(mockFindOne).toHaveBeenCalledWith({ where: { id: speciesId } });
			expect(
				mockPlantSpeciesTypeormMapper.toDomainEntity,
			).not.toHaveBeenCalled();
		});
	});

	describe('save', () => {
		it('should save plant species aggregate and return it', async () => {
			const mockAggregate = buildMockAggregate();
			const typeormEntity = buildTypeormEntity();
			const savedEntity = Object.assign(
				new PlantSpeciesTypeormEntity(),
				typeormEntity,
			);

			mockPlantSpeciesTypeormMapper.toTypeormEntity.mockReturnValue(
				typeormEntity,
			);
			mockSave.mockResolvedValue(savedEntity);
			mockPlantSpeciesTypeormMapper.toDomainEntity.mockReturnValue(
				mockAggregate as any,
			);

			const result = await repository.save(mockAggregate as any);

			expect(result).toBe(mockAggregate);
			expect(
				mockPlantSpeciesTypeormMapper.toTypeormEntity,
			).toHaveBeenCalledWith(mockAggregate);
			expect(mockSave).toHaveBeenCalledWith(typeormEntity);
			expect(mockPlantSpeciesTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				savedEntity,
			);
		});
	});

	describe('delete', () => {
		it('should soft delete plant species by id', async () => {
			mockSoftDelete.mockResolvedValue(undefined);

			await repository.delete(speciesId);

			expect(mockSoftDelete).toHaveBeenCalledWith(speciesId);
			expect(mockSoftDelete).toHaveBeenCalledTimes(1);
		});
	});

	describe('findByScientificName', () => {
		it('should return plant species aggregate when found by scientific name', async () => {
			const scientificName = new PlantSpeciesScientificNameValueObject(
				'Solanum lycopersicum',
			);
			const typeormEntity = buildTypeormEntity();
			const mockAggregate = buildMockAggregate();

			mockFindOne.mockResolvedValue(typeormEntity);
			mockPlantSpeciesTypeormMapper.toDomainEntity.mockReturnValue(
				mockAggregate as any,
			);

			const result = await repository.findByScientificName(scientificName);

			expect(result).toBe(mockAggregate);
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { scientificName: 'Solanum lycopersicum' },
			});
			expect(mockPlantSpeciesTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				typeormEntity,
			);
		});

		it('should return null when plant species is not found by scientific name', async () => {
			const scientificName = new PlantSpeciesScientificNameValueObject(
				'Unknown species',
			);

			mockFindOne.mockResolvedValue(null);

			const result = await repository.findByScientificName(scientificName);

			expect(result).toBeNull();
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { scientificName: 'Unknown species' },
			});
			expect(
				mockPlantSpeciesTypeormMapper.toDomainEntity,
			).not.toHaveBeenCalled();
		});
	});

	describe('findByCommonName', () => {
		it('should return plant species aggregate when found by common name', async () => {
			const commonName = new PlantSpeciesCommonNameValueObject('Tomato');
			const typeormEntity = buildTypeormEntity();
			const mockAggregate = buildMockAggregate();

			mockFindOne.mockResolvedValue(typeormEntity);
			mockPlantSpeciesTypeormMapper.toDomainEntity.mockReturnValue(
				mockAggregate as any,
			);

			const result = await repository.findByCommonName(commonName);

			expect(result).toBe(mockAggregate);
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { commonName: 'Tomato' },
			});
			expect(mockPlantSpeciesTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				typeormEntity,
			);
		});

		it('should return null when plant species is not found by common name', async () => {
			const commonName = new PlantSpeciesCommonNameValueObject('Unknown plant');

			mockFindOne.mockResolvedValue(null);

			const result = await repository.findByCommonName(commonName);

			expect(result).toBeNull();
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { commonName: 'Unknown plant' },
			});
			expect(
				mockPlantSpeciesTypeormMapper.toDomainEntity,
			).not.toHaveBeenCalled();
		});
	});
});
