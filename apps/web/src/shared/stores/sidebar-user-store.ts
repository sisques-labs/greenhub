import type { AuthUserProfileResponse } from '@repo/sdk';
import { create } from 'zustand';

interface SidebarUserStore {
	profile: AuthUserProfileResponse | null;
	setProfile: (profile: AuthUserProfileResponse | null) => void;
	updateProfile: (updates: Partial<AuthUserProfileResponse>) => void;
}

/**
 * Store for managing the user profile displayed in the sidebar
 * This ensures the sidebar updates automatically when the profile changes
 */
export const useSidebarUserStore = create<SidebarUserStore>((set) => ({
	profile: null,
	setProfile: (profile) => set({ profile }),
	updateProfile: (updates) =>
		set((state) => ({
			profile: state.profile ? { ...state.profile, ...updates } : null,
		})),
}));
