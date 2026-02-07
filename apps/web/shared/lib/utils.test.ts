import { calculateOccupancyPercentage, paginate } from './utils';

describe('calculateOccupancyPercentage', () => {
	it('should calculate percentage correctly', () => {
		expect(calculateOccupancyPercentage(5, 10)).toBe(50);
		expect(calculateOccupancyPercentage(7, 10)).toBe(70);
		expect(calculateOccupancyPercentage(1, 4)).toBe(25);
	});

	it('should round the percentage', () => {
		expect(calculateOccupancyPercentage(1, 3)).toBe(33); // 33.333... rounds to 33
		expect(calculateOccupancyPercentage(2, 3)).toBe(67); // 66.666... rounds to 67
	});

	it('should handle 0% occupancy', () => {
		expect(calculateOccupancyPercentage(0, 10)).toBe(0);
	});

	it('should handle 100% occupancy', () => {
		expect(calculateOccupancyPercentage(10, 10)).toBe(100);
	});

	it('should handle 0 capacity', () => {
		expect(calculateOccupancyPercentage(5, 0)).toBe(0);
	});

	it('should handle over-capacity scenarios', () => {
		expect(calculateOccupancyPercentage(15, 10)).toBe(150);
	});
});

describe('paginate', () => {
	const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	it('should paginate items correctly on first page', () => {
		const result = paginate(items, 1, 5);
		expect(result.items).toEqual([1, 2, 3, 4, 5]);
		expect(result.totalPages).toBe(2);
		expect(result.startIndex).toBe(0);
		expect(result.endIndex).toBe(5);
	});

	it('should paginate items correctly on second page', () => {
		const result = paginate(items, 2, 5);
		expect(result.items).toEqual([6, 7, 8, 9, 10]);
		expect(result.totalPages).toBe(2);
		expect(result.startIndex).toBe(5);
		expect(result.endIndex).toBe(10);
	});

	it('should handle empty arrays', () => {
		const result = paginate([], 1, 5);
		expect(result.items).toEqual([]);
		expect(result.totalPages).toBe(0);
	});
});
