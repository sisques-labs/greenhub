import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';
import { OverviewUuidValueObject } from '@/shared/domain/value-objects/identifiers/overview-uuid/overview-uuid.vo';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid/uuid.vo';

describe('OverviewUuidValueObject', () => {
	const validUuid = '123e4567-e89b-12d3-a456-426614174000';

	it('should be an instance of UuidValueObject', () => {
		const overviewUuid = new OverviewUuidValueObject(validUuid);

		expect(overviewUuid).toBeInstanceOf(UuidValueObject);
	});

	it('should create an overview UUID value object with valid UUID', () => {
		const overviewUuid = new OverviewUuidValueObject(validUuid);

		expect(overviewUuid.value).toBe(validUuid);
	});

	it('should generate a random UUID when no value is provided', () => {
		const overviewUuid = new OverviewUuidValueObject();

		expect(overviewUuid.value).toBeDefined();
		expect(overviewUuid.value).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
	});

	it('should throw InvalidUuidException for invalid UUID', () => {
		expect(() => new OverviewUuidValueObject('invalid')).toThrow(
			InvalidUuidException,
		);
	});

	it('should support equals method from UuidValueObject', () => {
		const overviewUuid1 = new OverviewUuidValueObject(validUuid);
		const overviewUuid2 = new OverviewUuidValueObject(validUuid);

		expect(overviewUuid1.equals(overviewUuid2)).toBe(true);
	});

	it('should support all UuidValueObject methods', () => {
		const overviewUuid = new OverviewUuidValueObject(validUuid);

		expect(overviewUuid.getVersion()).toBeDefined();
		expect(typeof overviewUuid.isNil()).toBe('boolean');
	});
});



