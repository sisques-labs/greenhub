import { CalculateMedianService } from './calculate-median.service';

describe('CalculateMedianService', () => {
	let service: CalculateMedianService;

	beforeEach(() => {
		service = new CalculateMedianService();
	});

	describe('execute', () => {
		it('should calculate median for odd number of values', () => {
			const result = service.execute([10, 20, 30]);
			expect(result).toBe(20.0);
		});

		it('should calculate median for even number of values', () => {
			const result = service.execute([10, 20, 30, 40]);
			expect(result).toBe(25.0);
		});

		it('should return 0 for empty array', () => {
			const result = service.execute([]);
			expect(result).toBe(0);
		});

		it('should handle single value', () => {
			const result = service.execute([42]);
			expect(result).toBe(42.0);
		});

		it('should handle unsorted array', () => {
			const result = service.execute([30, 10, 20]);
			expect(result).toBe(20.0);
		});

		it('should handle negative numbers', () => {
			const result = service.execute([-10, 0, 10]);
			expect(result).toBe(0.0);
		});
	});
});

