import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { PlantSpeciesMongoDbDto } from '@/core/plant-species-context/infrastructure/database/mongodb/dtos/plant-species/plant-species-mongodb.dto';
import { PlantSpeciesMongoDBMapper } from '@/core/plant-species-context/infrastructure/database/mongodb/mappers/plant-species/plant-species-mongodb.mapper';

const makeViewModelProps = (overrides: Partial<ConstructorParameters<typeof PlantSpeciesViewModel>[0]> = {}) => ({
	id: '123e4567-e89b-12d3-a456-426614174000',
	commonName: 'Tomato',
	scientificName: 'Solanum lycopersicum',
	family: 'Solanaceae',
	description: 'A common garden vegetable',
	category: 'VEGETABLE',
	difficulty: 'EASY',
	growthRate: 'FAST',
	lightRequirements: 'FULL_SUN',
	waterRequirements: 'MODERATE',
	temperatureRange: { min: 15, max: 30 },
	humidityRequirements: 'MODERATE',
	soilType: 'LOAMY',
	phRange: { min: 6.0, max: 6.8 },
	matureSize: { height: 150, width: 60 },
	growthTime: 90,
	tags: ['vegetable', 'annual'],
	isVerified: true,
	contributorId: null,
	createdAt: new Date('2024-01-01'),
	updatedAt: new Date('2024-01-02'),
	...overrides,
});

const makeMongoDto = (overrides: Partial<PlantSpeciesMongoDbDto> = {}): PlantSpeciesMongoDbDto => ({
	id: '123e4567-e89b-12d3-a456-426614174000',
	commonName: 'Tomato',
	scientificName: 'Solanum lycopersicum',
	family: 'Solanaceae',
	description: 'A common garden vegetable',
	category: 'VEGETABLE',
	difficulty: 'EASY',
	growthRate: 'FAST',
	lightRequirements: 'FULL_SUN',
	waterRequirements: 'MODERATE',
	temperatureRange: { min: 15, max: 30 },
	humidityRequirements: 'MODERATE',
	soilType: 'LOAMY',
	phRange: { min: 6.0, max: 6.8 },
	matureSize: { height: 150, width: 60 },
	growthTime: 90,
	tags: ['vegetable', 'annual'],
	isVerified: true,
	contributorId: null,
	createdAt: new Date('2024-01-01'),
	updatedAt: new Date('2024-01-02'),
	deletedAt: null,
	...overrides,
});

describe('PlantSpeciesMongoDBMapper', () => {
	let mapper: PlantSpeciesMongoDBMapper;

	beforeEach(() => {
		mapper = new PlantSpeciesMongoDBMapper();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('toViewModel', () => {
		it('should convert MongoDB document to view model with all properties', () => {
			const doc = makeMongoDto();

			const result = mapper.toViewModel(doc);

			expect(result).toBeInstanceOf(PlantSpeciesViewModel);
			expect(result.id).toBe(doc.id);
			expect(result.commonName).toBe(doc.commonName);
			expect(result.scientificName).toBe(doc.scientificName);
			expect(result.family).toBe(doc.family);
			expect(result.description).toBe(doc.description);
			expect(result.category).toBe(doc.category);
			expect(result.difficulty).toBe(doc.difficulty);
			expect(result.growthRate).toBe(doc.growthRate);
			expect(result.lightRequirements).toBe(doc.lightRequirements);
			expect(result.waterRequirements).toBe(doc.waterRequirements);
			expect(result.temperatureRange).toEqual(doc.temperatureRange);
			expect(result.humidityRequirements).toBe(doc.humidityRequirements);
			expect(result.soilType).toBe(doc.soilType);
			expect(result.phRange).toEqual(doc.phRange);
			expect(result.matureSize).toEqual(doc.matureSize);
			expect(result.growthTime).toBe(doc.growthTime);
			expect(result.tags).toEqual(doc.tags);
			expect(result.isVerified).toBe(doc.isVerified);
			expect(result.contributorId).toBeNull();
			expect(result.createdAt).toEqual(doc.createdAt);
			expect(result.updatedAt).toEqual(doc.updatedAt);
		});

		it('should convert MongoDB document with non-null contributorId', () => {
			const contributorId = '999e4567-e89b-12d3-a456-426614174000';
			const doc = makeMongoDto({ contributorId });

			const result = mapper.toViewModel(doc);

			expect(result.contributorId).toBe(contributorId);
		});

		it('should handle date conversion when createdAt/updatedAt are strings', () => {
			const createdAtStr = '2024-01-01T00:00:00.000Z';
			const updatedAtStr = '2024-01-02T00:00:00.000Z';
			const doc = makeMongoDto({
				createdAt: createdAtStr as unknown as Date,
				updatedAt: updatedAtStr as unknown as Date,
			});

			const result = mapper.toViewModel(doc);

			expect(result.createdAt).toBeInstanceOf(Date);
			expect(result.updatedAt).toBeInstanceOf(Date);
			expect(result.createdAt.toISOString()).toBe(createdAtStr);
			expect(result.updatedAt.toISOString()).toBe(updatedAtStr);
		});

		it('should preserve Date objects without conversion', () => {
			const createdAt = new Date('2024-03-15');
			const updatedAt = new Date('2024-03-16');
			const doc = makeMongoDto({ createdAt, updatedAt });

			const result = mapper.toViewModel(doc);

			expect(result.createdAt).toBe(createdAt);
			expect(result.updatedAt).toBe(updatedAt);
		});
	});

	describe('toMongoData', () => {
		it('should convert view model to MongoDB document with all properties', () => {
			const props = makeViewModelProps();
			const viewModel = new PlantSpeciesViewModel(props);

			const result = mapper.toMongoData(viewModel);

			expect(result.id).toBe(props.id);
			expect(result.commonName).toBe(props.commonName);
			expect(result.scientificName).toBe(props.scientificName);
			expect(result.family).toBe(props.family);
			expect(result.description).toBe(props.description);
			expect(result.category).toBe(props.category);
			expect(result.difficulty).toBe(props.difficulty);
			expect(result.growthRate).toBe(props.growthRate);
			expect(result.lightRequirements).toBe(props.lightRequirements);
			expect(result.waterRequirements).toBe(props.waterRequirements);
			expect(result.temperatureRange).toEqual(props.temperatureRange);
			expect(result.humidityRequirements).toBe(props.humidityRequirements);
			expect(result.soilType).toBe(props.soilType);
			expect(result.phRange).toEqual(props.phRange);
			expect(result.matureSize).toEqual(props.matureSize);
			expect(result.growthTime).toBe(props.growthTime);
			expect(result.tags).toEqual(props.tags);
			expect(result.isVerified).toBe(props.isVerified);
			expect(result.contributorId).toBeNull();
			expect(result.createdAt).toEqual(props.createdAt);
			expect(result.updatedAt).toEqual(props.updatedAt);
			expect(result.deletedAt).toBeNull();
		});

		it('should convert view model with non-null contributorId', () => {
			const contributorId = '999e4567-e89b-12d3-a456-426614174000';
			const viewModel = new PlantSpeciesViewModel(
				makeViewModelProps({ contributorId }),
			);

			const result = mapper.toMongoData(viewModel);

			expect(result.contributorId).toBe(contributorId);
		});

		it('should always set deletedAt to null', () => {
			const viewModel = new PlantSpeciesViewModel(makeViewModelProps());

			const result = mapper.toMongoData(viewModel);

			expect(result.deletedAt).toBeNull();
		});
	});
});
