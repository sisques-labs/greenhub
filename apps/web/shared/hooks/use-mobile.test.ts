import { useIsMobile } from '@/shared/hooks/use-mobile';
import { act, renderHook } from '@testing-library/react';

describe('useIsMobile', () => {
	const originalInnerWidth = window.innerWidth;
	const originalMatchMedia = window.matchMedia;

	afterEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: originalInnerWidth,
		});
		window.matchMedia = originalMatchMedia;
	});

	const setupMatchMedia = (matches: boolean) => {
		const listeners: Array<(e: MediaQueryListEvent) => void> = [];
		const mockMql = {
			matches,
			addEventListener: jest.fn((_event: string, listener: (e: MediaQueryListEvent) => void) => {
				listeners.push(listener);
			}),
			removeEventListener: jest.fn(),
		};
		window.matchMedia = jest.fn(() => mockMql as any);
		return { mockMql, listeners };
	};

	describe('Mobile detection', () => {
		it('should return true when window width is less than 768px', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 375,
			});
			setupMatchMedia(true);

			const { result } = renderHook(() => useIsMobile());

			expect(result.current).toBe(true);
		});

		it('should return false when window width is 768px or more', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 1024,
			});
			setupMatchMedia(false);

			const { result } = renderHook(() => useIsMobile());

			expect(result.current).toBe(false);
		});

		it('should return false when window width is exactly 768px', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 768,
			});
			setupMatchMedia(false);

			const { result } = renderHook(() => useIsMobile());

			expect(result.current).toBe(false);
		});
	});

	describe('Media query setup', () => {
		it('should call window.matchMedia with correct query', () => {
			setupMatchMedia(false);

			renderHook(() => useIsMobile());

			expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
		});

		it('should add event listener for media query changes', () => {
			const { mockMql } = setupMatchMedia(false);

			renderHook(() => useIsMobile());

			expect(mockMql.addEventListener).toHaveBeenCalledWith(
				'change',
				expect.any(Function),
			);
		});

		it('should remove event listener on unmount', () => {
			const { mockMql } = setupMatchMedia(false);

			const { unmount } = renderHook(() => useIsMobile());

			unmount();

			expect(mockMql.removeEventListener).toHaveBeenCalledWith(
				'change',
				expect.any(Function),
			);
		});
	});

	describe('Responsive updates', () => {
		it('should update when window resizes', () => {
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 1024,
			});

			const { listeners } = setupMatchMedia(false);

			const { result } = renderHook(() => useIsMobile());

			expect(result.current).toBe(false);

			// Simulate resize to mobile
			Object.defineProperty(window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 375,
			});

			act(() => {
				listeners.forEach((listener) =>
					listener({} as MediaQueryListEvent),
				);
			});

			expect(result.current).toBe(true);
		});
	});
});
