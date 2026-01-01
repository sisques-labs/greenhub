import type { LocationResponse } from "@repo/sdk";
import { create } from "zustand";

interface LocationsPageStore {
	// Dialog states
	createDialogOpen: boolean;
	setCreateDialogOpen: (open: boolean) => void;

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

	// Search and filters
	searchQuery: "",
	setSearchQuery: (query) => set({ searchQuery: query }),
	selectedFilter: "all",
	setSelectedFilter: (filter) => set({ selectedFilter: filter }),

	// Pagination
	currentPage: 1,
	setCurrentPage: (page) => set({ currentPage: page }),
}));

