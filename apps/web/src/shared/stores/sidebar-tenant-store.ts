import type { TenantResponse } from "@repo/sdk";
import { create } from "zustand";

interface SidebarTenantStore {
	tenant: TenantResponse | null;
	setTenant: (tenant: TenantResponse | null) => void;
	updateTenant: (updates: Partial<TenantResponse>) => void;
}

/**
 * Store for managing the tenant displayed in the sidebar
 * This ensures the sidebar updates automatically when the tenant changes
 */
export const useSidebarTenantStore = create<SidebarTenantStore>((set) => ({
	tenant: null,
	setTenant: (tenant) => set({ tenant }),
	updateTenant: (updates) =>
		set((state) => ({
			tenant: state.tenant ? { ...state.tenant, ...updates } : null,
		})),
}));

