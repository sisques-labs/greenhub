import { dynamicSortsToApiSortsMapper } from '@/shared/mappers/convert-sorts.mapper';
import { SortDirection } from '@/shared/enums/sort-direction.enum';

describe('dynamicSortsToApiSortsMapper', () => {
	describe('Empty input', () => {
		it('should return empty array for empty sorts', () => {
			const result = dynamicSortsToApiSortsMapper([]);

			expect(result).toEqual([]);
		});

		it('should return empty array for non-array input', () => {
			const result = dynamicSortsToApiSortsMapper(null as any);

			expect(result).toEqual([]);
		});
	});

	describe('Direction mapping', () => {
		it('should map asc to ASC', () => {
			const result = dynamicSortsToApiSortsMapper([
				{ field: 'name', direction: 'asc' },
			]);

			expect(result[0].direction).toBe(SortDirection.ASC);
		});

		it('should map desc to DESC', () => {
			const result = dynamicSortsToApiSortsMapper([
				{ field: 'name', direction: 'desc' },
			]);

			expect(result[0].direction).toBe(SortDirection.DESC);
		});

		it('should map uppercase ASC', () => {
			const result = dynamicSortsToApiSortsMapper([
				{ field: 'name', direction: 'ASC' },
			]);

			expect(result[0].direction).toBe(SortDirection.ASC);
		});

		it('should map uppercase DESC', () => {
			const result = dynamicSortsToApiSortsMapper([
				{ field: 'name', direction: 'DESC' },
			]);

			expect(result[0].direction).toBe(SortDirection.DESC);
		});

		it('should map SortDirection.ASC enum', () => {
			const result = dynamicSortsToApiSortsMapper([
				{ field: 'name', direction: SortDirection.ASC },
			]);

			expect(result[0].direction).toBe(SortDirection.ASC);
		});

		it('should map SortDirection.DESC enum', () => {
			const result = dynamicSortsToApiSortsMapper([
				{ field: 'name', direction: SortDirection.DESC },
			]);

			expect(result[0].direction).toBe(SortDirection.DESC);
		});

		it('should default unknown direction to DESC', () => {
			const result = dynamicSortsToApiSortsMapper([
				{ field: 'name', direction: 'unknown' as any },
			]);

			expect(result[0].direction).toBe(SortDirection.DESC);
		});
	});

	describe('Field mapping', () => {
		it('should preserve field name', () => {
			const result = dynamicSortsToApiSortsMapper([
				{ field: 'createdAt', direction: 'desc' },
			]);

			expect(result[0].field).toBe('createdAt');
		});

		it('should map multiple sorts', () => {
			const result = dynamicSortsToApiSortsMapper([
				{ field: 'name', direction: 'asc' },
				{ field: 'createdAt', direction: 'desc' },
			]);

			expect(result).toHaveLength(2);
			expect(result[0].field).toBe('name');
			expect(result[0].direction).toBe(SortDirection.ASC);
			expect(result[1].field).toBe('createdAt');
			expect(result[1].direction).toBe(SortDirection.DESC);
		});
	});
});
