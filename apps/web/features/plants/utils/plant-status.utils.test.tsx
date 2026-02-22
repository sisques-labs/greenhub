import { getPlantStatusBadge } from '@/features/plants/utils/plant-status.utils';
import { render } from '@testing-library/react';

describe('plant-status.utils', () => {
	const mockT = (key: string) => key;

	describe('getPlantStatusBadge', () => {
		it('should return a Badge component for PLANTED status', () => {
			const badge = getPlantStatusBadge('PLANTED', mockT);
			const { container } = render(badge);

			expect(container.firstChild).toBeTruthy();
		});

		it('should return a Badge with outline variant for PLANTED status', () => {
			const badge = getPlantStatusBadge('PLANTED', mockT);
			const { container } = render(badge);

			// The badge should be rendered with the translation key
			expect(container.textContent).toBe('shared.status.plant.PLANTED');
		});

		it('should return a Badge for GROWING status', () => {
			const badge = getPlantStatusBadge('GROWING', mockT);
			const { container } = render(badge);

			expect(container.textContent).toBe('shared.status.plant.GROWING');
		});

		it('should return a Badge for HARVESTED status', () => {
			const badge = getPlantStatusBadge('HARVESTED', mockT);
			const { container } = render(badge);

			expect(container.textContent).toBe('shared.status.plant.HARVESTED');
		});

		it('should return a Badge for DEAD status', () => {
			const badge = getPlantStatusBadge('DEAD', mockT);
			const { container } = render(badge);

			expect(container.textContent).toBe('shared.status.plant.DEAD');
		});

		it('should return a Badge for ARCHIVED status', () => {
			const badge = getPlantStatusBadge('ARCHIVED', mockT);
			const { container } = render(badge);

			expect(container.textContent).toBe('shared.status.plant.ARCHIVED');
		});

		it('should return a Badge with the raw status for unknown status', () => {
			const badge = getPlantStatusBadge('UNKNOWN_STATUS', mockT);
			const { container } = render(badge);

			expect(container.textContent).toBe('UNKNOWN_STATUS');
		});

		it('should call translation function with correct key', () => {
			const mockTranslate = jest.fn((key: string) => key);

			getPlantStatusBadge('PLANTED', mockTranslate);

			expect(mockTranslate).toHaveBeenCalledWith('shared.status.plant.PLANTED');
		});

		it('should not call translation function for unknown status', () => {
			const mockTranslate = jest.fn((key: string) => key);

			getPlantStatusBadge('UNKNOWN', mockTranslate);

			expect(mockTranslate).not.toHaveBeenCalled();
		});
	});
});
