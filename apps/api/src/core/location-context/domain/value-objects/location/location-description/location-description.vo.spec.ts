import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string/invalid-string.exception';

describe('LocationDescriptionValueObject', () => {
	describe('constructor', () => {
		it('should create a description value object with valid string', () => {
			const description = new LocationDescriptionValueObject(
				'North-facing room with good sunlight',
			);

			expect(description.value).toBe('North-facing room with good sunlight');
		});

		it('should create a description value object with empty string', () => {
			const description = new LocationDescriptionValueObject('');

			expect(description.value).toBe('');
		});

		it('should create a description value object with null', () => {
			const description = new LocationDescriptionValueObject(null);

			expect(description.value).toBe('');
		});

		it('should create a description value object with undefined', () => {
			const description = new LocationDescriptionValueObject(undefined);

			expect(description.value).toBe('');
		});

		it('should create a description value object with maximum length', () => {
			const longDescription = 'A'.repeat(500);
			const description = new LocationDescriptionValueObject(longDescription);

			expect(description.value).toBe(longDescription);
		});

		it('should throw InvalidStringException for string exceeding max length', () => {
			const tooLongDescription = 'A'.repeat(501);
			expect(
				() => new LocationDescriptionValueObject(tooLongDescription),
			).toThrow(InvalidStringException);
		});

		it('should trim whitespace from value', () => {
			const description = new LocationDescriptionValueObject(
				'  North-facing room  ',
			);

			expect(description.value).toBe('North-facing room');
		});
	});

	describe('value getter', () => {
		it('should return the description string', () => {
			const description = new LocationDescriptionValueObject(
				'North-facing room',
			);

			expect(description.value).toBe('North-facing room');
		});
	});
});

