import { useFilterOperators } from '@/shared/hooks/use-filter-operators';
import { FilterOperator } from '@/shared/enums/filter-operator.enum';
import { renderHook } from '@testing-library/react';

describe('useFilterOperators', () => {
	it('should return an array of filter operators', () => {
		const { result } = renderHook(() => useFilterOperators());

		expect(Array.isArray(result.current)).toBe(true);
		expect(result.current.length).toBeGreaterThan(0);
	});

	it('should return operators with label and value properties', () => {
		const { result } = renderHook(() => useFilterOperators());

		result.current.forEach((operator) => {
			expect(operator).toHaveProperty('label');
			expect(operator).toHaveProperty('value');
			expect(typeof operator.label).toBe('string');
		});
	});

	it('should include EQUALS operator', () => {
		const { result } = renderHook(() => useFilterOperators());

		const equalsOperator = result.current.find(
			(op) => op.value === FilterOperator.EQUALS,
		);
		expect(equalsOperator).toBeDefined();
		expect(equalsOperator?.label).toBe('Equals');
	});

	it('should include NOT_EQUALS operator', () => {
		const { result } = renderHook(() => useFilterOperators());

		const notEqualsOperator = result.current.find(
			(op) => op.value === FilterOperator.NOT_EQUALS,
		);
		expect(notEqualsOperator).toBeDefined();
		expect(notEqualsOperator?.label).toBe('Not Equals');
	});

	it('should include LIKE operator', () => {
		const { result } = renderHook(() => useFilterOperators());

		const likeOperator = result.current.find(
			(op) => op.value === FilterOperator.LIKE,
		);
		expect(likeOperator).toBeDefined();
		expect(likeOperator?.label).toBe('Contains');
	});

	it('should include IN operator', () => {
		const { result } = renderHook(() => useFilterOperators());

		const inOperator = result.current.find(
			(op) => op.value === FilterOperator.IN,
		);
		expect(inOperator).toBeDefined();
		expect(inOperator?.label).toBe('In');
	});

	it('should include GREATER_THAN operator', () => {
		const { result } = renderHook(() => useFilterOperators());

		const gtOperator = result.current.find(
			(op) => op.value === FilterOperator.GREATER_THAN,
		);
		expect(gtOperator).toBeDefined();
		expect(gtOperator?.label).toBe('Greater Than');
	});

	it('should include LESS_THAN operator', () => {
		const { result } = renderHook(() => useFilterOperators());

		const ltOperator = result.current.find(
			(op) => op.value === FilterOperator.LESS_THAN,
		);
		expect(ltOperator).toBeDefined();
		expect(ltOperator?.label).toBe('Less Than');
	});

	it('should return exactly 6 operators', () => {
		const { result } = renderHook(() => useFilterOperators());

		expect(result.current).toHaveLength(6);
	});
});
