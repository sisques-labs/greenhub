import { renderHook } from '@testing-library/react';
import type { PlantResponse } from '../../api/types';
import { PLANT_STATUS } from '../../constants/plant-status';
import { usePlantsFiltering } from './use-plants-filtering';

describe('usePlantsFiltering', () => {
	const mockPlants: PlantResponse[] = [
		{
			id: '1',
			name: 'Tomato Plant',
			species: 'Solanum lycopersicum',
			status: PLANT_STATUS.GROWING,
			growingUnitId: 'unit-1',
			plantedDate: new Date('2024-01-01'),
			notes: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: '2',
			name: 'Basil',
			species: 'Ocimum basilicum',
			status: PLANT_STATUS.PLANTED,
			growingUnitId: 'unit-1',
			plantedDate: new Date('2024-01-02'),
			notes: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: '3',
			name: 'Cherry Tomato',
			species: 'Solanum lycopersicum var. cerasiforme',
			status: PLANT_STATUS.GROWING,
			growingUnitId: 'unit-1',
			plantedDate: new Date('2024-01-03'),
			notes: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: '4',
			name: 'Lettuce',
			species: 'Lactuca sativa',
			status: PLANT_STATUS.HARVESTED,
			growingUnitId: 'unit-1',
			plantedDate: new Date('2024-01-04'),
			notes: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	describe('Initialization', () => {
		it('should return all plants when no filters are applied', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(4);
			expect(result.current.filteredPlants).toEqual(mockPlants);
		});

		it('should handle empty plants array', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: [],
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(0);
		});

		it('should handle undefined plants', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: undefined as unknown as PlantResponse[],
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(0);
		});

		it('should handle null plants', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: null as unknown as PlantResponse[],
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(0);
		});
	});

	describe('Search Filtering', () => {
		it('should filter plants by name (case-insensitive)', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'tomato',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(2);
			expect(result.current.filteredPlants[0].name).toBe('Tomato Plant');
			expect(result.current.filteredPlants[1].name).toBe('Cherry Tomato');
		});

		it('should filter plants by species (case-insensitive)', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'basilicum',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(1);
			expect(result.current.filteredPlants[0].name).toBe('Basil');
		});

		it('should filter plants by growing unit name (case-insensitive)', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'greenhouse',
					growingUnitName: 'Greenhouse 1',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(4);
		});

		it('should be case-insensitive for search', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'TOMATO',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(2);
		});

		it('should return empty array when no plants match search', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'nonexistent',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(0);
		});

		it('should handle partial matches', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'tom',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(2);
		});

		it('should handle empty search query', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: '',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(4);
		});

		it('should handle whitespace in search query', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: '  tomato  ',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(2);
		});
	});

	describe('Status Filtering', () => {
		it('should filter plants with "all" status (no filtering)', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					selectedFilter: 'all',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(4);
		});

		it('should filter plants with "healthy" status (GROWING)', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					selectedFilter: 'healthy',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(2);
			expect(
				result.current.filteredPlants.every(
					(plant) => plant.status === PLANT_STATUS.GROWING,
				),
			).toBe(true);
		});

		it('should handle "needsWater" filter (not yet implemented)', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					selectedFilter: 'needsWater',
				}),
			);

			// Since needsWater is not implemented yet, it should return all plants
			expect(result.current.filteredPlants).toHaveLength(4);
		});
	});

	describe('Combined Filtering', () => {
		it('should apply both search and status filters', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'tomato',
					selectedFilter: 'healthy',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(2);
			expect(result.current.filteredPlants[0].name).toBe('Tomato Plant');
			expect(result.current.filteredPlants[0].status).toBe(PLANT_STATUS.GROWING);
			expect(result.current.filteredPlants[1].name).toBe('Cherry Tomato');
			expect(result.current.filteredPlants[1].status).toBe(PLANT_STATUS.GROWING);
		});

		it('should return empty array when filters exclude all plants', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'basil',
					selectedFilter: 'healthy',
				}),
			);

			// Basil has status PLANTED, not GROWING
			expect(result.current.filteredPlants).toHaveLength(0);
		});

		it('should combine search with growing unit name filter', () => {
			const plantsWithGrowingUnit: PlantResponse[] = [
				...mockPlants,
				{
					id: '5',
					name: 'Pepper',
					species: 'Capsicum annuum',
					status: PLANT_STATUS.GROWING,
					growingUnitId: 'unit-2',
					plantedDate: new Date('2024-01-05'),
					notes: null,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: plantsWithGrowingUnit,
					searchQuery: 'greenhouse',
					growingUnitId: 'unit-1',
					growingUnitName: 'Greenhouse 1',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(4);
		});
	});

	describe('Edge Cases', () => {
		it('should handle plants with null or undefined name', () => {
			const plantsWithNullName: PlantResponse[] = [
				{
					...mockPlants[0],
					name: null as unknown as string,
				},
				mockPlants[1],
			];

			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: plantsWithNullName,
					searchQuery: 'basil',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(1);
			expect(result.current.filteredPlants[0].name).toBe('Basil');
		});

		it('should handle plants with null or undefined species', () => {
			const plantsWithNullSpecies: PlantResponse[] = [
				{
					...mockPlants[0],
					species: null as unknown as string,
				},
				mockPlants[1],
			];

			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: plantsWithNullSpecies,
					searchQuery: 'basilicum',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(1);
			expect(result.current.filteredPlants[0].species).toBe('Ocimum basilicum');
		});

		it('should handle undefined growing unit name', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'greenhouse',
					growingUnitName: undefined,
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(0);
		});

		it('should handle all filters applied together', () => {
			const { result } = renderHook(() =>
				usePlantsFiltering({
					plants: mockPlants,
					searchQuery: 'tomato',
					selectedFilter: 'healthy',
					growingUnitName: 'Greenhouse 1',
				}),
			);

			expect(result.current.filteredPlants).toHaveLength(2);
		});
	});

	describe('Memoization', () => {
		it('should memoize results when inputs do not change', () => {
			const { result, rerender } = renderHook(
				(props) => usePlantsFiltering(props),
				{
					initialProps: {
						plants: mockPlants,
						searchQuery: 'tomato',
						selectedFilter: 'all' as const,
					},
				},
			);

			const firstResult = result.current.filteredPlants;

			rerender({
				plants: mockPlants,
				searchQuery: 'tomato',
				selectedFilter: 'all' as const,
			});

			expect(result.current.filteredPlants).toBe(firstResult);
		});

		it('should recompute when plants change', () => {
			const { result, rerender } = renderHook(
				(props) => usePlantsFiltering(props),
				{
					initialProps: {
						plants: mockPlants,
						searchQuery: 'tomato',
					},
				},
			);

			const firstResult = result.current.filteredPlants;

			rerender({
				plants: [...mockPlants, mockPlants[0]],
				searchQuery: 'tomato',
			});

			expect(result.current.filteredPlants).not.toBe(firstResult);
		});

		it('should recompute when search query changes', () => {
			const { result, rerender } = renderHook(
				(props) => usePlantsFiltering(props),
				{
					initialProps: {
						plants: mockPlants,
						searchQuery: 'tomato',
					},
				},
			);

			const firstResult = result.current.filteredPlants;

			rerender({
				plants: mockPlants,
				searchQuery: 'basil',
			});

			expect(result.current.filteredPlants).not.toBe(firstResult);
		});

		it('should recompute when selected filter changes', () => {
			const { result, rerender } = renderHook(
				(props) => usePlantsFiltering(props),
				{
					initialProps: {
						plants: mockPlants,
						selectedFilter: 'all' as const,
					},
				},
			);

			const firstResult = result.current.filteredPlants;

			rerender({
				plants: mockPlants,
				selectedFilter: 'healthy' as const,
			});

			expect(result.current.filteredPlants).not.toBe(firstResult);
		});

		it('should recompute when growing unit name changes', () => {
			const { result, rerender } = renderHook(
				(props) => usePlantsFiltering(props),
				{
					initialProps: {
						plants: mockPlants,
						searchQuery: 'test',
						growingUnitName: 'Greenhouse 1',
					},
				},
			);

			const firstResult = result.current.filteredPlants;

			rerender({
				plants: mockPlants,
				searchQuery: 'test',
				growingUnitName: 'Greenhouse 2',
			});

			expect(result.current.filteredPlants).not.toBe(firstResult);
		});
	});
});
