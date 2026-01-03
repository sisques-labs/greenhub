import { create } from 'zustand';

interface TenantSelectorStore {
	refreshKey: number;
	triggerRefresh: () => void;
}

/**
 * Store for managing the tenant selector state
 * Used to trigger refreshes of the organization list when a new organization is created
 */
export const useTenantSelectorStore = create<TenantSelectorStore>((set) => ({
	refreshKey: 0,
	triggerRefresh: () =>
		set((state) => ({
			refreshKey: state.refreshKey + 1,
		})),
}));
