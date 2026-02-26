import { SidebarData } from '@/shared/interfaces/sidebar-data.interface';
import { BookOpen, Home, LayoutGrid, MapPin, Settings, Sprout } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export const useAppRoutes = () => {
	const pathname = usePathname();
	const locale = useLocale();
	const t = useTranslations('nav');

	// Helper function to build localized URLs
	const buildLocalizedUrl = (path: string): string => {
		// Remove leading slash if present
		const cleanPath = path.startsWith('/') ? path.slice(1) : path;
		// Build URL with locale prefix
		return `/${locale}/${cleanPath}`;
	};

	const routes = {
		home: buildLocalizedUrl('/home'),
		settings: buildLocalizedUrl('/settings'),
		auth: buildLocalizedUrl('/auth'),
		userProfile: buildLocalizedUrl('/user/profile'),
		plants: buildLocalizedUrl('/plants'),
		growingUnits: buildLocalizedUrl('/growing-units'),
		locations: buildLocalizedUrl('/locations'),
		plantSpecies: buildLocalizedUrl('/plant-species'),
	} as const;

	/**
	 * Generates sidebar data structure with active state based on current pathname
	 */
	const getSidebarData = (): Omit<SidebarData, 'header' | 'footer'> => {
		return {
			navMain: [
				{
					title: t('home'),
					url: '#',
					items: [
						{
							title: t('home'),
							url: routes.home,
							isActive: pathname === routes.home,
							icon: Home,
						},
					],
				},
				{
					title: t('plants'),
					url: '#',
					items: [
						{
							title: t('plants'),
							url: routes.plants,
							isActive: pathname === routes.plants,
							icon: Sprout,
						},
						{
							title: t('growingUnits'),
							url: routes.growingUnits,
							isActive: pathname === routes.growingUnits,
							icon: LayoutGrid,
						},
						{
							title: t('plantSpecies'),
							url: routes.plantSpecies,
							isActive: pathname?.startsWith(routes.plantSpecies) ?? false,
							icon: BookOpen,
						},
					],
				},
				{
					title: t('locations'),
					url: '#',
					items: [
						{
							title: t('locations'),
							url: routes.locations,
							isActive: pathname === routes.locations,
							icon: MapPin,
						},
					],
				},
				{
					title: t('settings'),
					url: routes.settings,
					items: [
						{
							title: t('settings'),
							url: routes.settings,
							isActive: pathname === routes.settings,
							icon: Settings,
						},
					],
				},
			],
		};
	};

	return {
		routes,
		getSidebarData,
	};
};
