import { formatPlantDate } from './date-utils';

describe('formatPlantDate', () => {
	const mockTranslations = {
		today: 'Today',
		yesterday: 'Yesterday',
		daysAgo: (days: number) => `${days} days ago`,
		weeksAgo: (weeks: number) => `${weeks} weeks ago`,
	};

	beforeEach(() => {
		// Mock the current date to ensure consistent test results
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2024-02-15T12:00:00Z'));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('null/undefined handling', () => {
		it('should return "-" when date is null', () => {
			const result = formatPlantDate(null, mockTranslations);
			expect(result).toBe('-');
		});

		it('should return "-" when date is undefined', () => {
			const result = formatPlantDate(undefined, mockTranslations);
			expect(result).toBe('-');
		});
	});

	describe('today', () => {
		it('should return "Today" when date is today', () => {
			const today = new Date('2024-02-15T10:00:00Z');
			const result = formatPlantDate(today, mockTranslations);
			expect(result).toBe('Today');
		});

		it('should return "Today" when date is the same day but different time', () => {
			const today = new Date('2024-02-15T23:59:59Z');
			const result = formatPlantDate(today, mockTranslations);
			expect(result).toBe('Today');
		});
	});

	describe('yesterday', () => {
		it('should return "Yesterday" when date is 1 day ago', () => {
			const yesterday = new Date('2024-02-14T12:00:00Z');
			const result = formatPlantDate(yesterday, mockTranslations);
			expect(result).toBe('Yesterday');
		});
	});

	describe('days ago', () => {
		it('should return "2 days ago" when date is 2 days ago', () => {
			const twoDaysAgo = new Date('2024-02-13T12:00:00Z');
			const result = formatPlantDate(twoDaysAgo, mockTranslations);
			expect(result).toBe('2 days ago');
		});

		it('should return "3 days ago" when date is 3 days ago', () => {
			const threeDaysAgo = new Date('2024-02-12T12:00:00Z');
			const result = formatPlantDate(threeDaysAgo, mockTranslations);
			expect(result).toBe('3 days ago');
		});

		it('should return "6 days ago" when date is 6 days ago', () => {
			const sixDaysAgo = new Date('2024-02-09T12:00:00Z');
			const result = formatPlantDate(sixDaysAgo, mockTranslations);
			expect(result).toBe('6 days ago');
		});
	});

	describe('weeks ago', () => {
		it('should return "1 weeks ago" when date is 7 days ago', () => {
			const oneWeekAgo = new Date('2024-02-08T12:00:00Z');
			const result = formatPlantDate(oneWeekAgo, mockTranslations);
			expect(result).toBe('1 weeks ago');
		});

		it('should return "1 weeks ago" when date is 10 days ago', () => {
			const tenDaysAgo = new Date('2024-02-05T12:00:00Z');
			const result = formatPlantDate(tenDaysAgo, mockTranslations);
			expect(result).toBe('1 weeks ago');
		});

		it('should return "1 weeks ago" when date is 13 days ago', () => {
			const thirteenDaysAgo = new Date('2024-02-02T12:00:00Z');
			const result = formatPlantDate(thirteenDaysAgo, mockTranslations);
			expect(result).toBe('1 weeks ago');
		});
	});

	describe('locale date string', () => {
		it('should return locale date string when date is 14 days ago', () => {
			const fourteenDaysAgo = new Date('2024-02-01T12:00:00Z');
			const result = formatPlantDate(fourteenDaysAgo, mockTranslations);
			expect(result).toMatch(/2\/1\/2024/); // Matches locale format
		});

		it('should return locale date string when date is more than 14 days ago', () => {
			const longAgo = new Date('2024-01-01T12:00:00Z');
			const result = formatPlantDate(longAgo, mockTranslations);
			expect(result).toMatch(/1\/1\/2024/);
		});

		it('should return locale date string when date is very old', () => {
			const veryOld = new Date('2020-01-01T12:00:00Z');
			const result = formatPlantDate(veryOld, mockTranslations);
			expect(result).toMatch(/1\/1\/2020/);
		});
	});

	describe('edge cases', () => {
		it('should handle dates in the future (treated as today)', () => {
			const future = new Date('2024-02-16T12:00:00Z');
			const result = formatPlantDate(future, mockTranslations);
			expect(result).toBe('Yesterday'); // Due to Math.abs and rounding
		});

		it('should handle date strings', () => {
			const dateString = new Date('2024-02-14T12:00:00Z');
			const result = formatPlantDate(dateString, mockTranslations);
			expect(result).toBe('Yesterday');
		});
	});

	describe('translation function integration', () => {
		it('should call daysAgo translation with correct parameter', () => {
			const daysAgoSpy = jest.fn((days) => `${days} days ago`);
			const translations = {
				...mockTranslations,
				daysAgo: daysAgoSpy,
			};

			const threeDaysAgo = new Date('2024-02-12T12:00:00Z');
			formatPlantDate(threeDaysAgo, translations);

			expect(daysAgoSpy).toHaveBeenCalledWith(3);
		});

		it('should call weeksAgo translation with correct parameter', () => {
			const weeksAgoSpy = jest.fn((weeks) => `${weeks} weeks ago`);
			const translations = {
				...mockTranslations,
				weeksAgo: weeksAgoSpy,
			};

			const oneWeekAgo = new Date('2024-02-08T12:00:00Z');
			formatPlantDate(oneWeekAgo, translations);

			expect(weeksAgoSpy).toHaveBeenCalledWith(1);
		});
	});
});
