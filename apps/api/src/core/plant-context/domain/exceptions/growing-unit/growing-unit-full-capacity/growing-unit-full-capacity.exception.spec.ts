import { GrowingUnitFullCapacityException } from '@/core/plant-context/domain/exceptions/growing-unit/growing-unit-full-capacity/growing-unit-full-capacity.exception';
import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

describe('GrowingUnitFullCapacityException', () => {
	it('should be an instance of BaseDomainException', () => {
		const exception = new GrowingUnitFullCapacityException(
			'123e4567-e89b-12d3-a456-426614174000',
		);

		expect(exception).toBeInstanceOf(BaseDomainException);
	});

	it('should create exception with correct message', () => {
		const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';
		const exception = new GrowingUnitFullCapacityException(growingUnitId);

		expect(exception.message).toBe(
			`Growing unit ${growingUnitId} is at full capacity`,
		);
	});

	it('should create exception with different growing unit IDs', () => {
		const growingUnitIds = [
			'123e4567-e89b-12d3-a456-426614174000',
			'223e4567-e89b-12d3-a456-426614174000',
			'323e4567-e89b-12d3-a456-426614174000',
		];

		growingUnitIds.forEach((id) => {
			const exception = new GrowingUnitFullCapacityException(id);

			expect(exception.message).toBe(`Growing unit ${id} is at full capacity`);
		});
	});

	it('should be throwable and catchable', () => {
		const growingUnitId = '123e4567-e89b-12d3-a456-426614174000';

		expect(() => {
			throw new GrowingUnitFullCapacityException(growingUnitId);
		}).toThrow(GrowingUnitFullCapacityException);

		expect(() => {
			throw new GrowingUnitFullCapacityException(growingUnitId);
		}).toThrow(`Growing unit ${growingUnitId} is at full capacity`);
	});
});
