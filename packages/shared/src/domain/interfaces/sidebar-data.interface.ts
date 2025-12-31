import { LucideIcon } from "lucide-react";

/**
 * Interface for a single navigation item in the sidebar
 */
export interface SidebarNavItem {
	/**
	 * The title of the navigation item
	 */
	title: string;
	/**
	 * The URL to navigate to
	 */
	url: string;
	/**
	 * Whether this item is currently active
	 */
	isActive?: boolean;
	/**
	 * Optional icon component for the navigation item
	 */
	icon?: LucideIcon;
}

/**
 * Interface for a navigation group in the sidebar
 */
export interface SidebarNavGroup {
	/**
	 * The title of the navigation group
	 */
	title: string;
	/**
	 * The URL for the group (optional, can be used for group-level navigation)
	 */
	url: string;
	/**
	 * The list of navigation items within this group
	 */
	items: SidebarNavItem[];
}

/**
 * Interface for the sidebar header data
 */
export interface SidebarHeaderData {
	/**
	 * The logo image source (optional)
	 */
	logoSrc?: string;
	/**
	 * The application name to display
	 */
	appName: string;
	/**
	 * The URL to navigate to when clicking the header
	 */
	url?: string;
}

/**
 * Interface for the sidebar footer user data
 */
export interface SidebarFooterUserData {
	/**
	 * The user avatar image source
	 */
	avatarSrc?: string;
	/**
	 * The fallback text for the avatar
	 */
	avatarFallback: string;
	/**
	 * The user name or title
	 */
	name: string;
	/**
	 * The URL to navigate to the user profile
	 */
	profileUrl: string;
}

/**
 * Interface for the complete sidebar data structure
 */
export interface SidebarData {
	/**
	 * Header data (logo and app name)
	 */
	header: SidebarHeaderData;
	/**
	 * Footer user data
	 */
	footer: SidebarFooterUserData;
	/**
	 * Main navigation groups
	 */
	navMain: SidebarNavGroup[];
}
