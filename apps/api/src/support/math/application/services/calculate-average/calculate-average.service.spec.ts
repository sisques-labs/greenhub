import { CalculateAverageService } from './calculate-average.service';

describe('CalculateAverageService', () => {
	let service: CalculateAverageService;

	beforeEach(() => {
		service = new CalculateAverageService();
	});

	describe('execute', () => {
		it('should calculate average correctly', () => {
			const result = service.execute([10, 20, 30]);
			expect(result).toBe(20.0);
		});

		it('should calculate average with decimals', () => {
			const result = service.execute([1, 2, 3], 2);
			expect(result).toBe(2.0);
		});

		it('should return 0 for empty array', () => {
			const result = service.execute([]);
			expect(result).toBe(0);
		});

		it('should handle single value', () => {
			const result = service.execute([42]);
			expect(result).toBe(42.0);
		});

		it('should handle negative numbers', () => {
			const result = service.execute([-10, 10, 20]);
			expect(result).toBe(6.67);
		});
	});
});

