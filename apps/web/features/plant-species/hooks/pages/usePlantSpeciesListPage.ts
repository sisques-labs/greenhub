'use client';

import type {
	PlantSpeciesCategory,
	PlantSpeciesDifficulty,
} from '@/features/plant-species/api/types/plant-species.types';
import { usePlantSpeciesFindByCriteria } from '@/features/plant-species/hooks/use-plant-species-find-by-criteria/use-plant-species-find-by-criteria';
import { useCallback, useMemo, useState } from 'react';

interface PlantSpeciesFilters {
	category: PlantSpeciesCategory | undefined;
	difficulty: PlantSpeciesDifficulty | undefined;
	search: string;
	verifiedOnly: boolean;
}

/**
 * Hook that provides all the logic for the plant species list page
 * Centralizes state management, data fetching, filtering, and event handlers
 */
export function usePlantSpeciesListPage() {
	const [filters, setFilters] = useState<PlantSpeciesFilters>({
		category: undefined,
		difficulty: undefined,
		search: '',
		verifiedOnly: false,
	});

	const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

	const { plantSpecies, isLoading, error } = usePlantSpeciesFindByCriteria();

	const filteredSpecies = useMemo(() => {
		if (!plantSpecies) return [];

		return plantSpecies.items.filter((s) => {
			if (filters.category && s.category !== filters.category) return false;
			if (filters.difficulty && s.difficulty !== filters.difficulty)
				return false;
			if (filters.verifiedOnly && !s.isVerified) return false;
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				return (
					s.commonName.toLowerCase().includes(searchLower) ||
					s.scientificName.toLowerCase().includes(searchLower) ||
					(s.family?.toLowerCase().includes(searchLower) ?? false)
				);
			}
			return true;
		});
	}, [plantSpecies, filters]);

	const handleFilterChange = useCallback(
		<K extends keyof PlantSpeciesFilters>(
			key: K,
			value: PlantSpeciesFilters[K],
		) => {
			setFilters((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const handleClearFilters = useCallback(() => {
		setFilters({
			category: undefined,
			difficulty: undefined,
			search: '',
			verifiedOnly: false,
		});
	}, []);

	return {
		species: filteredSpecies,
		isLoading,
		error,
		filters,
		setFilters,
		handleFilterChange,
		handleClearFilters,
		viewMode,
		setViewMode,
	};
}
