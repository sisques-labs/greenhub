import { CalculatePercentageService } from './calculate-percentage.service';

describe('CalculatePercentageService', () => {
	let service: CalculatePercentageService;

	beforeEach(() => {
		service = new CalculatePercentageService();
	});

	describe('execute', () => {
		it('should calculate percentage correctly', () => {
			const result = service.execute(25, 100);
			expect(result).toBe(25.0);
		});

		it('should calculate percentage with decimals', () => {
			const result = service.execute(1, 3, 2);
			expect(result).toBe(33.33);
		});

		it('should return 0 when total is zero', () => {
			const result = service.execute(10, 0);
			expect(result).toBe(0);
		});

		it('should return 0 for negative values', () => {
			const result = service.execute(-10, 100);
			expect(result).toBe(0);
		});

		it('should return 0 for negative total', () => {
			const result = service.execute(10, -100);
			expect(result).toBe(0);
		});

		it('should handle 100% correctly', () => {
			const result = service.execute(100, 100);
			expect(result).toBe(100.0);
		});

		it('should handle 0% correctly', () => {
			const result = service.execute(0, 100);
			expect(result).toBe(0.0);
		});
	});

	describe('calculateOccupancy', () => {
		it('should calculate occupancy percentage', () => {
			const result = service.calculateOccupancy(8, 10);
			expect(result).toBe(80.0);
		});

		it('should calculate occupancy with custom decimals', () => {
			const result = service.calculateOccupancy(8, 10, 1);
			expect(result).toBe(80.0);
		});
	});

	describe('calculateRemaining', () => {
		it('should calculate remaining percentage', () => {
			const result = service.calculateRemaining(2, 10);
			expect(result).toBe(20.0);
		});

		it('should calculate remaining with custom decimals', () => {
			const result = service.calculateRemaining(2, 10, 1);
			expect(result).toBe(20.0);
		});
	});
});

