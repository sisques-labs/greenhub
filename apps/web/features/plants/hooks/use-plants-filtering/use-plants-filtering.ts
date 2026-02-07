import { useMemo } from 'react';
import type { PlantResponse } from '../../api/types';
import { PLANT_STATUS } from '../../constants/plant-status';

export type PlantFilterType = 'all' | 'needsWater' | 'healthy';

export interface UsePlantsFilteringParams {
	plants: PlantResponse[];
	searchQuery?: string;
	selectedFilter?: PlantFilterType;
	growingUnitId?: string;
	growingUnitName?: string;
}

export interface UsePlantsFilteringResult {
	filteredPlants: PlantResponse[];
}

/**
 * Custom hook for filtering plants based on search query and status filters
 *
 * This hook encapsulates the filtering logic for plants, making it reusable
 * across different components and easier to test.
 *
 * @param params - Filtering parameters
 * @param params.plants - Array of plants to filter
 * @param params.searchQuery - Optional search query to filter by name, species, or growing unit name
 * @param params.selectedFilter - Optional filter type ('all', 'needsWater', 'healthy')
 * @param params.growingUnitId - Optional growing unit id to filter plants by unit
 * @param params.growingUnitName - Optional growing unit name for search filtering
 *
 * @returns Object containing filtered plants array
 *
 * @example
 * ```tsx
 * const { filteredPlants } = usePlantsFiltering({
 *   plants: allPlants,
 *   searchQuery: 'tomato',
 *   selectedFilter: 'healthy',
 *   growingUnitId: 'unit-1',
 *   growingUnitName: 'Greenhouse 1'
 * });
 * ```
 */
export function usePlantsFiltering({
	plants,
	searchQuery = '',
	selectedFilter = 'all',
	growingUnitId,
	growingUnitName = '',
}: UsePlantsFilteringParams): UsePlantsFilteringResult {
	const filteredPlants = useMemo(() => {
		let result = plants || [];

		// Filter by growing unit when specified
		if (growingUnitId) {
			result = result.filter(
				(plant) => plant.growingUnitId === growingUnitId,
			);
		}

		// Apply search filter
		const trimmedQuery = searchQuery?.trim();
		if (trimmedQuery) {
			const query = trimmedQuery.toLowerCase();
			result = result.filter(
				(plant) =>
					plant.name?.toLowerCase().includes(query) ||
					plant.species?.toLowerCase().includes(query) ||
					growingUnitName?.toLowerCase().includes(query),
			);
		}

		// Apply status filter
		if (selectedFilter !== 'all') {
			switch (selectedFilter) {
				case 'needsWater':
					// TODO: Implement needs water filter when status logic is available
					break;
				case 'healthy':
					// TODO: Implement healthy filter when health status logic is available
					result = result.filter(
						(plant) => plant.status === PLANT_STATUS.GROWING,
					);
					break;
				default:
					break;
			}
		}

		return result;
	}, [plants, searchQuery, selectedFilter, growingUnitId, growingUnitName]);

	return { filteredPlants };
}
