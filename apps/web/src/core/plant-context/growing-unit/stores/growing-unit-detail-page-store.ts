import { create } from 'zustand';

interface GrowingUnitDetailPageStore {
	// Dialog states
	updateDialogOpen: boolean;
	setUpdateDialogOpen: (open: boolean) => void;
	createPlantDialogOpen: boolean;
	setCreatePlantDialogOpen: (open: boolean) => void;
}

/**
 * Store for managing the growing unit detail page state
 * Centralizes UI state management for the growing unit detail page
 */
export const useGrowingUnitDetailPageStore = create<GrowingUnitDetailPageStore>(
	(set) => ({
		updateDialogOpen: false,
		setUpdateDialogOpen: (open) => set({ updateDialogOpen: open }),
		createPlantDialogOpen: false,
		setCreatePlantDialogOpen: (open) => set({ createPlantDialogOpen: open }),
	}),
);
