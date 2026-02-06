import type { LocationResponse } from '../api/types';
import { create } from 'zustand';

interface LocationsPageStore {
	// Dialog states
	createDialogOpen: boolean;
	setCreateDialogOpen: (open: boolean) => void;
	updateDialogOpen: boolean;
	setUpdateDialogOpen: (open: boolean) => void;
	deleteDialogOpen: boolean;
	setDeleteDialogOpen: (open: boolean) => void;

	// Selected location for editing/deleting
	selectedLocation: LocationResponse | null;
	setSelectedLocation: (location: LocationResponse | null) => void;

	// Search and filters
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	selectedFilter: string;
	setSelectedFilter: (filter: string) => void;

	// Pagination
	currentPage: number;
	setCurrentPage: (page: number) => void;
}

/**
 * Store for managing the locations page state
 * Centralizes all UI state management for the locations page
 */
export const useLocationsPageStore = create<LocationsPageStore>((set) => ({
	// Dialog states
	createDialogOpen: false,
	setCreateDialogOpen: (open) => set({ createDialogOpen: open }),
	updateDialogOpen: false,
	setUpdateDialogOpen: (open) => set({ updateDialogOpen: open }),
	deleteDialogOpen: false,
	setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),

	// Selected location
	selectedLocation: null,
	setSelectedLocation: (location) => set({ selectedLocation: location }),

	// Search and filters
	searchQuery: '',
	setSearchQuery: (query) => set({ searchQuery: query }),
	selectedFilter: 'all',
	setSelectedFilter: (filter) => set({ selectedFilter: filter }),

	// Pagination
	currentPage: 1,
	setCurrentPage: (page) => set({ currentPage: page }),
}));
