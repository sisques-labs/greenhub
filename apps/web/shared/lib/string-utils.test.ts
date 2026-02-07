import { getInitials, getPlantInitials } from './string-utils';

describe('string-utils', () => {
	describe('getInitials', () => {
		describe('single word names', () => {
			it('should return first two letters for single word', () => {
				expect(getInitials('Alice')).toBe('AL');
			});

			it('should uppercase single word', () => {
				expect(getInitials('john')).toBe('JO');
			});

			it('should handle short single word (one character)', () => {
				expect(getInitials('A')).toBe('A');
			});
		});

		describe('multiple word names', () => {
			it('should return initials from two words', () => {
				expect(getInitials('John Doe')).toBe('JD');
			});

			it('should return initials from three words (limited to 2)', () => {
				expect(getInitials('John Michael Doe')).toBe('JM');
			});

			it('should return initials from four words (limited to 2)', () => {
				expect(getInitials('John Michael Robert Doe')).toBe('JM');
			});

			it('should handle mixed case names', () => {
				expect(getInitials('john doe')).toBe('JD');
			});
		});

		describe('null/undefined handling', () => {
			it('should return default fallback "P" for null', () => {
				expect(getInitials(null)).toBe('P');
			});

			it('should return default fallback "P" for undefined', () => {
				expect(getInitials(undefined)).toBe('P');
			});

			it('should return custom fallback for null', () => {
				expect(getInitials(null, 'X')).toBe('X');
			});

			it('should return custom fallback for undefined', () => {
				expect(getInitials(undefined, 'AB')).toBe('AB');
			});

			it('should return custom fallback for empty string', () => {
				expect(getInitials('', 'Z')).toBe('Z');
			});
		});

		describe('edge cases', () => {
			it('should handle names with extra spaces', () => {
				expect(getInitials('John  Doe')).toBe('JD');
			});

			it('should handle names with leading/trailing spaces', () => {
				expect(getInitials('  John Doe  ')).toBe('JD');
			});

			it('should handle special characters in names', () => {
				expect(getInitials('Jean-Pierre')).toBe('JP');
			});

			it('should handle names with numbers', () => {
				expect(getInitials('Unit 123')).toBe('U1');
			});

			it('should uppercase all initials', () => {
				expect(getInitials('alice bob')).toBe('AB');
			});
		});

		describe('fallback behavior', () => {
			it('should use fallback with default value', () => {
				expect(getInitials('')).toBe('P');
			});

			it('should use custom fallback correctly', () => {
				expect(getInitials('', 'Plant')).toBe('PL');
			});

			it('should slice fallback to 2 characters', () => {
				expect(getInitials('', 'ABCD')).toBe('AB');
			});
		});
	});

	describe('getPlantInitials', () => {
		describe('name priority', () => {
			it('should prefer name over species', () => {
				expect(getPlantInitials('Monstera Deliciosa', 'Monstera')).toBe('MD');
			});

			it('should use species when name is null', () => {
				expect(getPlantInitials(null, 'Ficus Benjamina')).toBe('FB');
			});

			it('should use species when name is undefined', () => {
				expect(getPlantInitials(undefined, 'Pothos')).toBe('PO');
			});

			it('should use species when name is empty string', () => {
				expect(getPlantInitials('', 'Sansevieria')).toBe('SA');
			});
		});

		describe('fallback to "P"', () => {
			it('should return "P" when both name and species are null', () => {
				expect(getPlantInitials(null, null)).toBe('P');
			});

			it('should return "P" when both name and species are undefined', () => {
				expect(getPlantInitials(undefined, undefined)).toBe('P');
			});

			it('should return "P" when both name and species are empty', () => {
				expect(getPlantInitials('', '')).toBe('P');
			});

			it('should return "P" when name is null and species is empty', () => {
				expect(getPlantInitials(null, '')).toBe('P');
			});
		});

		describe('real-world plant examples', () => {
			it('should handle common plant name', () => {
				expect(getPlantInitials('Snake Plant', 'Sansevieria')).toBe('SP');
			});

			it('should handle Latin species name', () => {
				expect(getPlantInitials(null, 'Monstera Deliciosa')).toBe('MD');
			});

			it('should handle single word plant name', () => {
				expect(getPlantInitials('Pothos', 'Epipremnum aureum')).toBe('PO');
			});

			it('should handle long scientific names (limited to 2 initials)', () => {
				expect(
					getPlantInitials(null, 'Dracaena fragrans Massangeana'),
				).toBe('DF');
			});
		});

		describe('edge cases', () => {
			it('should handle mixed case inputs', () => {
				expect(getPlantInitials('monstera deliciosa', null)).toBe('MD');
			});

			it('should handle extra spaces in name', () => {
				expect(getPlantInitials('  Rubber  Plant  ', null)).toBe('RP');
			});

			it('should handle special characters', () => {
				expect(getPlantInitials("Mother-in-Law's Tongue", null)).toBe('MT');
			});
		});
	});
});
