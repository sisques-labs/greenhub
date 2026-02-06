import type { GrowingUnitResponse } from "../api/types";
import { create } from "zustand";

interface GrowingUnitsPageStore {
	// Dialog states
	createDialogOpen: boolean;
	setCreateDialogOpen: (open: boolean) => void;
	updateDialogOpen: boolean;
	setUpdateDialogOpen: (open: boolean) => void;

	// Selected growing unit for editing
	selectedGrowingUnit: GrowingUnitResponse | null;
	setSelectedGrowingUnit: (growingUnit: GrowingUnitResponse | null) => void;

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
 * Store for managing the growing units page state
 * Centralizes all UI state management for the growing units page
 */
export const useGrowingUnitsPageStore = create<GrowingUnitsPageStore>(
	(set) => ({
		// Dialog states
		createDialogOpen: false,
		setCreateDialogOpen: (open) => set({ createDialogOpen: open }),
		updateDialogOpen: false,
		setUpdateDialogOpen: (open) => set({ updateDialogOpen: open }),

		// Selected growing unit
		selectedGrowingUnit: null,
		setSelectedGrowingUnit: (growingUnit) =>
			set({ selectedGrowingUnit: growingUnit }),

		// Search and filters
		searchQuery: "",
		setSearchQuery: (query) => set({ searchQuery: query }),
		selectedFilter: "all",
		setSelectedFilter: (filter) => set({ selectedFilter: filter }),

		// Pagination
		currentPage: 1,
		setCurrentPage: (page) => set({ currentPage: page }),
	}),
);
