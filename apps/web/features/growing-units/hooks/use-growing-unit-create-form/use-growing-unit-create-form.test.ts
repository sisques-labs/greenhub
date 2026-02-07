import { renderHook, act } from '@testing-library/react';
import { useGrowingUnitCreateForm } from './use-growing-unit-create-form';
import { useLocationsList } from '@/features/locations/hooks/use-locations-list/use-locations-list';

// Mock the useLocationsList hook
jest.mock('@/features/locations/hooks/use-locations-list/use-locations-list');

describe('useGrowingUnitCreateForm', () => {
	const mockOnSubmit = jest.fn();
	const mockOnOpenChange = jest.fn();
	const mockTranslations = (key: string) => key;

	const mockLocations = [
		{ id: 'location-1', name: 'Garden', type: 'OUTDOOR' },
		{ id: 'location-2', name: 'Greenhouse', type: 'INDOOR' },
	];

	const defaultProps = {
		onSubmit: mockOnSubmit,
		onOpenChange: mockOnOpenChange,
		error: null,
		translations: mockTranslations,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(useLocationsList as jest.Mock).mockReturnValue({
			locations: mockLocations,
			isLoading: false,
			error: null,
			refetch: jest.fn(),
		});
	});

	describe('Initialization', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			expect(result.current.locationId).toBe('');
			expect(result.current.name).toBe('');
			expect(result.current.type).toBe('POT');
			expect(result.current.capacity).toBe(1);
			expect(result.current.length).toBeUndefined();
			expect(result.current.width).toBeUndefined();
			expect(result.current.height).toBeUndefined();
			expect(result.current.unit).toBe('CENTIMETER');
			expect(result.current.formErrors).toEqual({});
		});

		it('should integrate useLocationsList', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			expect(result.current.locations).toEqual(mockLocations);
			expect(result.current.isLoadingLocations).toBe(false);
		});

		it('should handle loading locations state', () => {
			(useLocationsList as jest.Mock).mockReturnValue({
				locations: [],
				isLoading: true,
				error: null,
				refetch: jest.fn(),
			});

			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			expect(result.current.isLoadingLocations).toBe(true);
			expect(result.current.locations).toEqual([]);
		});
	});

	describe('State Setters', () => {
		it('should update locationId', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
			});

			expect(result.current.locationId).toBe('location-1');
		});

		it('should update name', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setName('Test Growing Unit');
			});

			expect(result.current.name).toBe('Test Growing Unit');
		});

		it('should update type', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setType('GARDEN_BED');
			});

			expect(result.current.type).toBe('GARDEN_BED');
		});

		it('should update capacity', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setCapacity(5);
			});

			expect(result.current.capacity).toBe(5);
		});

		it('should update length', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLength(100);
			});

			expect(result.current.length).toBe(100);
		});

		it('should update width', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setWidth(50);
			});

			expect(result.current.width).toBe(50);
		});

		it('should update height', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setHeight(30);
			});

			expect(result.current.height).toBe(30);
		});

		it('should update unit', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setUnit('METER');
			});

			expect(result.current.unit).toBe('METER');
		});

		it('should handle undefined numeric values', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLength(100);
				result.current.setWidth(50);
				result.current.setHeight(30);
			});

			expect(result.current.length).toBe(100);
			expect(result.current.width).toBe(50);
			expect(result.current.height).toBe(30);

			act(() => {
				result.current.setLength(undefined);
				result.current.setWidth(undefined);
				result.current.setHeight(undefined);
			});

			expect(result.current.length).toBeUndefined();
			expect(result.current.width).toBeUndefined();
			expect(result.current.height).toBeUndefined();
		});
	});

	describe('handleSubmit', () => {
		it('should validate and submit valid form data', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			// Set valid form data
			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('POT');
				result.current.setCapacity(2);
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					locationId: 'location-1',
					name: 'Test Unit',
					type: 'POT',
					capacity: 2,
					unit: 'CENTIMETER',
				}),
			);
		});

		it('should submit with optional dimension fields', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('GARDEN_BED');
				result.current.setCapacity(1);
				result.current.setLength(100);
				result.current.setWidth(50);
				result.current.setHeight(30);
				result.current.setUnit('CENTIMETER');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					locationId: 'location-1',
					name: 'Test Unit',
					type: 'GARDEN_BED',
					capacity: 1,
					length: 100,
					width: 50,
					height: 30,
					unit: 'CENTIMETER',
				}),
			);
		});

		it('should set form errors when validation fails', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			// Submit without required fields
			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).not.toEqual({});
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should set error for missing locationId', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setName('Test Unit');
				result.current.setType('POT');
				result.current.setCapacity(1);
				// locationId is not set
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.locationId).toBeDefined();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should set error for missing name', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setType('POT');
				result.current.setCapacity(1);
				// name is not set
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.name).toBeDefined();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should reset form and close dialog after successful submission', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('GARDEN_BED');
				result.current.setCapacity(3);
				result.current.setLength(100);
				result.current.setWidth(50);
				result.current.setHeight(30);
				result.current.setUnit('METER');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.locationId).toBe('');
			expect(result.current.name).toBe('');
			expect(result.current.type).toBe('POT');
			expect(result.current.capacity).toBe(1);
			expect(result.current.length).toBeUndefined();
			expect(result.current.width).toBeUndefined();
			expect(result.current.height).toBeUndefined();
			expect(result.current.unit).toBe('CENTIMETER');
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not reset form when submission fails', async () => {
			const errorProps = {
				...defaultProps,
				error: new Error('Submission failed'),
			};
			const { result } = renderHook(() => useGrowingUnitCreateForm(errorProps));

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('POT');
				result.current.setCapacity(1);
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Form should not be reset when there's an error
			expect(result.current.name).toBe('Test Unit');
			expect(result.current.locationId).toBe('location-1');
			expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
		});

		it('should clear form errors before submission', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			// First submit to set errors
			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Verify errors were set
			expect(result.current.formErrors).not.toEqual({});

			// Set valid data
			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
			});

			// Submit again
			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Errors should be cleared
			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('handleOpenChange', () => {
		it('should reset form when closing dialog', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			// Set some form data
			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('GARDEN_BED');
				result.current.setCapacity(5);
				result.current.setLength(100);
				result.current.setWidth(50);
				result.current.setHeight(30);
				result.current.setUnit('METER');
			});

			// Close dialog
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.locationId).toBe('');
			expect(result.current.name).toBe('');
			expect(result.current.type).toBe('POT');
			expect(result.current.capacity).toBe(1);
			expect(result.current.length).toBeUndefined();
			expect(result.current.width).toBeUndefined();
			expect(result.current.height).toBeUndefined();
			expect(result.current.unit).toBe('CENTIMETER');
			expect(result.current.formErrors).toEqual({});
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not reset form when opening dialog', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			// Set some form data
			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('GARDEN_BED');
			});

			// Open dialog
			act(() => {
				result.current.handleOpenChange(true);
			});

			expect(result.current.locationId).toBe('location-1');
			expect(result.current.name).toBe('Test Unit');
			expect(result.current.type).toBe('GARDEN_BED');
			expect(mockOnOpenChange).toHaveBeenCalledWith(true);
		});

		it('should clear form errors when closing dialog', () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			// Manually set form errors
			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Verify errors were set
			expect(result.current.formErrors).not.toEqual({});

			// Close dialog
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('Form Validation Integration', () => {
		it('should handle optional dimension fields correctly', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('POT');
				result.current.setCapacity(1);
				// Don't set dimensions (optional)
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalled();
		});

		it('should validate type field', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('WINDOW_BOX');
				result.current.setCapacity(1);
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'WINDOW_BOX',
				}),
			);
		});

		it('should validate capacity minimum value', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('POT');
				result.current.setCapacity(0); // Invalid: less than 1
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.capacity).toBeDefined();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should validate unit field', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('POT');
				result.current.setCapacity(1);
				result.current.setUnit('INCH');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					unit: 'INCH',
				}),
			);
		});
	});

	describe('Numeric Data Transformation', () => {
		it('should handle numeric capacity correctly', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('POT');
				result.current.setCapacity(10);
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					capacity: 10,
				}),
			);
		});

		it('should handle decimal dimension values', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitCreateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-1');
				result.current.setName('Test Unit');
				result.current.setType('POT');
				result.current.setCapacity(1);
				result.current.setLength(10.5);
				result.current.setWidth(5.25);
				result.current.setHeight(3.75);
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					length: 10.5,
					width: 5.25,
					height: 3.75,
				}),
			);
		});
	});
});
