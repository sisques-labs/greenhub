import type { AuthUserProfileResponse } from '@/features/auth/api/types';
import { create } from 'zustand';

// Profile type that supports both SDK and our new auth types
type ProfileType = AuthUserProfileResponse;

interface SidebarUserStore {
	profile: ProfileType | null;
	setProfile: (profile: ProfileType | null) => void;
	updateProfile: (updates: Partial<ProfileType>) => void;
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
