import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationViewModelBuilder } from '@/core/location-context/domain/builders/view-models/location-view-model/location-view-model.builder';
import type { LocationPrimitives } from '@/core/location-context/domain/primitives/location.primitives';
import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('LocationViewModelBuilder', () => {
	let builder: LocationViewModelBuilder;

	beforeEach(() => {
		builder = new LocationViewModelBuilder();
	});

	describe('build', () => {
		it('should build a LocationViewModel with all required fields', () => {
			// Arrange
			const id = '123e4567-e89b-12d3-a456-426614174000';
			const name = 'Greenhouse 1';
			const type = 'GREENHOUSE';
			const createdAt = new Date();
			const updatedAt = new Date();

			// Act
			const viewModel = builder
				.withId(id)
				.withName(name)
				.withType(type)
				.withCreatedAt(createdAt)
				.withUpdatedAt(updatedAt)
				.build();

			// Assert
			expect(viewModel).toBeInstanceOf(LocationViewModel);
			expect(viewModel.id).toBe(id);
			expect(viewModel.name).toBe(name);
			expect(viewModel.type).toBe(type);
			expect(viewModel.description).toBeNull();
			expect(viewModel.createdAt).toBe(createdAt);
			expect(viewModel.updatedAt).toBe(updatedAt);
		});

		it('should build a LocationViewModel with optional description', () => {
			// Arrange
			const id = '123e4567-e89b-12d3-a456-426614174000';
			const name = 'Greenhouse 1';
			const type = 'GREENHOUSE';
			const description = 'Main greenhouse for tomatoes';
			const createdAt = new Date();
			const updatedAt = new Date();

			// Act
			const viewModel = builder
				.withId(id)
				.withName(name)
				.withType(type)
				.withDescription(description)
				.withCreatedAt(createdAt)
				.withUpdatedAt(updatedAt)
				.build();

			// Assert
			expect(viewModel.description).toBe(description);
		});

		it('should throw error when building without required id', () => {
			// Arrange
			const name = 'Greenhouse 1';
			const type = 'GREENHOUSE';
			const createdAt = new Date();
			const updatedAt = new Date();

			// Act & Assert
			expect(() => {
				builder
					.withName(name)
					.withType(type)
					.withCreatedAt(createdAt)
					.withUpdatedAt(updatedAt)
					.build();
			}).toThrow(
				'Cannot build LocationViewModel: missing required fields: id',
			);
		});

		it('should throw error when building without timestamps', () => {
			// Arrange
			const id = '123e4567-e89b-12d3-a456-426614174000';
			const name = 'Greenhouse 1';
			const type = 'GREENHOUSE';

			// Act & Assert
			expect(() => {
				builder.withId(id).withName(name).withType(type).build();
			}).toThrow(
				'Cannot build LocationViewModel: missing required fields: createdAt, updatedAt',
			);
		});
	});

	describe('fromPrimitives', () => {
		it('should initialize builder from primitives and build view model', () => {
			// Arrange
			const primitives: LocationPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Greenhouse 1',
				type: 'GREENHOUSE',
				description: 'Main greenhouse',
			};

			// Act
			const viewModel = builder.fromPrimitives(primitives).build();

			// Assert
			expect(viewModel).toBeInstanceOf(LocationViewModel);
			expect(viewModel.id).toBe(primitives.id);
			expect(viewModel.name).toBe(primitives.name);
			expect(viewModel.type).toBe(primitives.type);
			expect(viewModel.description).toBe(primitives.description);
			expect(viewModel.createdAt).toBeInstanceOf(Date);
			expect(viewModel.updatedAt).toBeInstanceOf(Date);
		});

		it('should handle null description when building from primitives', () => {
			// Arrange
			const primitives: LocationPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				name: 'Greenhouse 1',
				type: 'GREENHOUSE',
				description: null,
			};

			// Act
			const viewModel = builder.fromPrimitives(primitives).build();

			// Assert
			expect(viewModel.description).toBeNull();
		});
	});

	describe('fromAggregate', () => {
		it('should initialize builder from aggregate and build view model', () => {
			// Arrange
			const aggregate = new LocationAggregate({
				id: new LocationUuidValueObject(),
				name: new LocationNameValueObject('Greenhouse 1'),
				type: new LocationTypeValueObject('GREENHOUSE'),
				description: new LocationDescriptionValueObject('Main greenhouse'),
			});

			// Act
			const viewModel = builder.fromAggregate(aggregate).build();

			// Assert
			expect(viewModel).toBeInstanceOf(LocationViewModel);
			expect(viewModel.id).toBe(aggregate.id.value);
			expect(viewModel.name).toBe(aggregate.name.value);
			expect(viewModel.type).toBe(aggregate.type.value);
			expect(viewModel.description).toBe(aggregate.description!.value);
			expect(viewModel.createdAt).toBeInstanceOf(Date);
			expect(viewModel.updatedAt).toBeInstanceOf(Date);
		});

		it('should handle null description when building from aggregate', () => {
			// Arrange
			const aggregate = new LocationAggregate({
				id: new LocationUuidValueObject(),
				name: new LocationNameValueObject('Greenhouse 1'),
				type: new LocationTypeValueObject('GREENHOUSE'),
				description: null,
			});

			// Act
			const viewModel = builder.fromAggregate(aggregate).build();

			// Assert
			expect(viewModel.description).toBeNull();
		});
	});

	describe('reset', () => {
		it('should reset builder state and allow building a new view model', () => {
			// Arrange
			const id1 = '123e4567-e89b-12d3-a456-426614174000';
			const name1 = 'Greenhouse 1';
			const type1 = 'GREENHOUSE';
			const createdAt1 = new Date();
			const updatedAt1 = new Date();

			const id2 = '223e4567-e89b-12d3-a456-426614174000';
			const name2 = 'Greenhouse 2';
			const type2 = 'INDOOR_SPACE';
			const createdAt2 = new Date();
			const updatedAt2 = new Date();

			// Act
			const viewModel1 = builder
				.withId(id1)
				.withName(name1)
				.withType(type1)
				.withCreatedAt(createdAt1)
				.withUpdatedAt(updatedAt1)
				.build();

			builder.reset();

			const viewModel2 = builder
				.withId(id2)
				.withName(name2)
				.withType(type2)
				.withCreatedAt(createdAt2)
				.withUpdatedAt(updatedAt2)
				.build();

			// Assert
			expect(viewModel1.id).toBe(id1);
			expect(viewModel1.name).toBe(name1);
			expect(viewModel2.id).toBe(id2);
			expect(viewModel2.name).toBe(name2);
		});
	});

	describe('fluent API', () => {
		it('should support method chaining', () => {
			// Arrange
			const id = '123e4567-e89b-12d3-a456-426614174000';
			const name = 'Greenhouse 1';
			const type = 'GREENHOUSE';
			const description = 'Description';
			const createdAt = new Date();
			const updatedAt = new Date();

			// Act
			const viewModel = builder
				.withId(id)
				.withName(name)
				.withType(type)
				.withDescription(description)
				.withCreatedAt(createdAt)
				.withUpdatedAt(updatedAt)
				.build();

			// Assert
			expect(viewModel).toBeInstanceOf(LocationViewModel);
		});

		it('should allow overwriting values before build', () => {
			// Arrange
			const id = '123e4567-e89b-12d3-a456-426614174000';
			const firstName = 'Old Name';
			const secondName = 'New Name';
			const type = 'GREENHOUSE';
			const createdAt = new Date();
			const updatedAt = new Date();

			// Act
			const viewModel = builder
				.withId(id)
				.withName(firstName)
				.withName(secondName) // Overwrite
				.withType(type)
				.withCreatedAt(createdAt)
				.withUpdatedAt(updatedAt)
				.build();

			// Assert
			expect(viewModel.name).toBe(secondName);
		});
	});
});
