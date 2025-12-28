import { SidebarData } from '@repo/shared/domain/interfaces/sidebar-data.interface';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export const useRoutes = () => {
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
