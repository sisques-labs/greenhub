import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string/invalid-string.exception';

describe('LocationNameValueObject', () => {
	describe('constructor', () => {
		it('should create a name value object with valid string', () => {
			const name = new LocationNameValueObject('Living Room');

			expect(name.value).toBe('Living Room');
		});

		it('should create a name value object with minimum length', () => {
			const name = new LocationNameValueObject('A');

			expect(name.value).toBe('A');
		});

		it('should create a name value object with maximum length', () => {
			const longName = 'A'.repeat(100);
			const name = new LocationNameValueObject(longName);

			expect(name.value).toBe(longName);
		});

		it('should throw InvalidStringException for empty string', () => {
			expect(() => new LocationNameValueObject('')).toThrow(
				InvalidStringException,
			);
		});

		it('should throw InvalidStringException for string exceeding max length', () => {
			const tooLongName = 'A'.repeat(101);
			expect(() => new LocationNameValueObject(tooLongName)).toThrow(
				InvalidStringException,
			);
		});

		it('should trim whitespace from value', () => {
			const name = new LocationNameValueObject('  Living Room  ');

			expect(name.value).toBe('Living Room');
		});
	});

	describe('value getter', () => {
		it('should return the name string', () => {
			const name = new LocationNameValueObject('Living Room');

			expect(name.value).toBe('Living Room');
		});
	});
});

