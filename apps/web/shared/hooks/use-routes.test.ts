import { useAppRoutes } from '@/shared/hooks/use-routes';
import { renderHook } from '@testing-library/react';

// next/navigation and next-intl are mocked in jest.setup.ts

describe('useAppRoutes', () => {
	describe('routes', () => {
		it('should return localized routes', () => {
			const { result } = renderHook(() => useAppRoutes());

			expect(result.current.routes).toBeDefined();
		});

		it('should include home route with locale prefix', () => {
			const { result } = renderHook(() => useAppRoutes());

			expect(result.current.routes.home).toMatch(/^\/en\//);
			expect(result.current.routes.home).toContain('home');
		});

		it('should include plants route with locale prefix', () => {
			const { result } = renderHook(() => useAppRoutes());

			expect(result.current.routes.plants).toMatch(/^\/en\//);
			expect(result.current.routes.plants).toContain('plants');
		});

		it('should include growing units route with locale prefix', () => {
			const { result } = renderHook(() => useAppRoutes());

			expect(result.current.routes.growingUnits).toMatch(/^\/en\//);
			expect(result.current.routes.growingUnits).toContain('growing-units');
		});

		it('should include locations route with locale prefix', () => {
			const { result } = renderHook(() => useAppRoutes());

			expect(result.current.routes.locations).toMatch(/^\/en\//);
			expect(result.current.routes.locations).toContain('locations');
		});

		it('should include settings route with locale prefix', () => {
			const { result } = renderHook(() => useAppRoutes());

			expect(result.current.routes.settings).toMatch(/^\/en\//);
			expect(result.current.routes.settings).toContain('settings');
		});

		it('should include auth route with locale prefix', () => {
			const { result } = renderHook(() => useAppRoutes());

			expect(result.current.routes.auth).toMatch(/^\/en\//);
			expect(result.current.routes.auth).toContain('auth');
		});

		it('should include userProfile route with locale prefix', () => {
			const { result } = renderHook(() => useAppRoutes());

			expect(result.current.routes.userProfile).toMatch(/^\/en\//);
			expect(result.current.routes.userProfile).toContain('user/profile');
		});
	});

	describe('getSidebarData', () => {
		it('should return sidebar data with navMain', () => {
			const { result } = renderHook(() => useAppRoutes());

			const sidebarData = result.current.getSidebarData();

			expect(sidebarData).toBeDefined();
			expect(sidebarData.navMain).toBeDefined();
			expect(Array.isArray(sidebarData.navMain)).toBe(true);
		});

		it('should include home section in navMain', () => {
			const { result } = renderHook(() => useAppRoutes());

			const sidebarData = result.current.getSidebarData();
			const homeSection = sidebarData.navMain.find((section) =>
				section.items?.some((item) =>
					item.url.includes('home'),
				),
			);

			expect(homeSection).toBeDefined();
		});

		it('should include plants section in navMain', () => {
			const { result } = renderHook(() => useAppRoutes());

			const sidebarData = result.current.getSidebarData();
			const plantsSection = sidebarData.navMain.find((section) =>
				section.items?.some((item) =>
					item.url.includes('plants'),
				),
			);

			expect(plantsSection).toBeDefined();
		});

		it('should include locations section in navMain', () => {
			const { result } = renderHook(() => useAppRoutes());

			const sidebarData = result.current.getSidebarData();
			const locationsSection = sidebarData.navMain.find((section) =>
				section.items?.some((item) =>
					item.url.includes('locations'),
				),
			);

			expect(locationsSection).toBeDefined();
		});

		it('should mark items as active based on current pathname', () => {
			const { result } = renderHook(() => useAppRoutes());

			const sidebarData = result.current.getSidebarData();
			// pathname is mocked to '/' in jest.setup.ts
			// All items should have isActive based on pathname comparison
			const allItems = sidebarData.navMain.flatMap((s) => s.items || []);
			const activeItems = allItems.filter((item) => item.isActive);

			// With pathname '/', no items should be active since routes have locale prefix
			expect(activeItems).toHaveLength(0);
		});
	});
});
