import { render } from '@testing-library/react';
import { getLocationIcon } from './icon-utils';

describe('icon-utils', () => {
	describe('getLocationIcon', () => {
		it('should render a MapPinIcon', () => {
			const icon = getLocationIcon();
			const { container } = render(<div>{icon}</div>);

			const svg = container.querySelector('svg');
			expect(svg).toBeInTheDocument();
		});

		it('should have correct CSS classes', () => {
			const icon = getLocationIcon();
			const { container } = render(<div>{icon}</div>);

			const svg = container.querySelector('svg');
			expect(svg).toHaveClass('h-4');
			expect(svg).toHaveClass('w-4');
			expect(svg).toHaveClass('text-muted-foreground');
		});

		it('should return consistent icon on multiple calls', () => {
			const icon1 = getLocationIcon();
			const icon2 = getLocationIcon();

			const { container: container1 } = render(<div>{icon1}</div>);
			const { container: container2 } = render(<div>{icon2}</div>);

			const svg1 = container1.querySelector('svg');
			const svg2 = container2.querySelector('svg');

			expect(svg1?.getAttribute('class')).toBe(svg2?.getAttribute('class'));
		});

		it('should be renderable in React component', () => {
			const TestComponent = () => (
				<div className="test-wrapper">{getLocationIcon()}</div>
			);

			const { container } = render(<TestComponent />);
			const wrapper = container.querySelector('.test-wrapper');
			const svg = wrapper?.querySelector('svg');

			expect(svg).toBeInTheDocument();
		});
	});
});
