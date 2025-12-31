import { create } from 'zustand';

interface PlantDetailPageStore {
	// Dialog states
	transplantDialogOpen: boolean;
	setTransplantDialogOpen: (open: boolean) => void;
}

/**
 * Store for managing the plant detail page state
 * Centralizes UI state management for the plant detail page
 */
export const usePlantDetailPageStore = create<PlantDetailPageStore>((set) => ({
	transplantDialogOpen: false,
	setTransplantDialogOpen: (open) => set({ transplantDialogOpen: open }),
}));

