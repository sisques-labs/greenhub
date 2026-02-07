import { renderHook, act } from '@testing-library/react';
import { useLocationCreateForm } from './use-location-create-form';

describe('useLocationCreateForm', () => {
	const mockOnSubmit = jest.fn();
	const mockOnOpenChange = jest.fn();
	const mockTranslations = (key: string) => key;

	const defaultProps = {
		onSubmit: mockOnSubmit,
		onOpenChange: mockOnOpenChange,
		error: null,
		translations: mockTranslations,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			expect(result.current.name).toBe('');
			expect(result.current.type).toBe('INDOOR_SPACE');
			expect(result.current.description).toBe(null);
			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('State Setters', () => {
		it('should update name', () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			act(() => {
				result.current.setName('Living Room');
			});

			expect(result.current.name).toBe('Living Room');
		});

		it('should update type', () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			act(() => {
				result.current.setType('BALCONY');
			});

			expect(result.current.type).toBe('BALCONY');
		});

		it('should update description', () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			act(() => {
				result.current.setDescription('This is a test description');
			});

			expect(result.current.description).toBe('This is a test description');
		});

		it('should update description to null', () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			act(() => {
				result.current.setDescription('Test');
				result.current.setDescription(null);
			});

			expect(result.current.description).toBe(null);
		});
	});

	describe('handleSubmit', () => {
		it('should validate and submit valid form data', async () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			// Set valid form data
			act(() => {
				result.current.setName('Test Location');
				result.current.setType('ROOM');
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
					name: 'Test Location',
					type: 'ROOM',
				}),
			);
		});

		it('should set form errors when validation fails', async () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

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

		it('should reset form and close dialog after successful submission', async () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			act(() => {
				result.current.setName('Test Location');
				result.current.setType('GARDEN');
				result.current.setDescription('Test description');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.name).toBe('');
			expect(result.current.type).toBe('INDOOR_SPACE');
			expect(result.current.description).toBe(null);
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not reset form when submission fails', async () => {
			const errorProps = {
				...defaultProps,
				error: new Error('Submission failed'),
			};
			const { result } = renderHook(() => useLocationCreateForm(errorProps));

			act(() => {
				result.current.setName('Test Location');
				result.current.setType('ROOM');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Form should not be reset when there's an error
			expect(result.current.name).toBe('Test Location');
			expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
		});

		it('should clear form errors before submission', async () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			// First submit with invalid data to set errors
			const mockEvent1 = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent1);
			});

			// Verify errors are set
			expect(result.current.formErrors).not.toEqual({});

			// Set valid form data
			act(() => {
				result.current.setName('Test Location');
				result.current.setType('ROOM');
			});

			// Submit again with valid data
			const mockEvent2 = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent2);
			});

			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('handleOpenChange', () => {
		it('should reset form when closing dialog', () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			// Set some form data
			act(() => {
				result.current.setName('Test Location');
				result.current.setType('BALCONY');
				result.current.setDescription('Test description');
			});

			// Close dialog
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.name).toBe('');
			expect(result.current.type).toBe('INDOOR_SPACE');
			expect(result.current.description).toBe(null);
			expect(result.current.formErrors).toEqual({});
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not reset form when opening dialog', () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			// Set some form data
			act(() => {
				result.current.setName('Test Location');
				result.current.setType('GARDEN');
			});

			// Open dialog
			act(() => {
				result.current.handleOpenChange(true);
			});

			expect(result.current.name).toBe('Test Location');
			expect(result.current.type).toBe('GARDEN');
			expect(mockOnOpenChange).toHaveBeenCalledWith(true);
		});
	});

	describe('Form Validation Integration', () => {
		it('should handle optional description field correctly', async () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			act(() => {
				result.current.setName('Test Location');
				result.current.setType('ROOM');
				// Don't set description (optional)
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalled();
		});

		it('should handle description with null value', async () => {
			const { result } = renderHook(() => useLocationCreateForm(defaultProps));

			act(() => {
				result.current.setName('Test Location');
				result.current.setType('GREENHOUSE');
				result.current.setDescription(null);
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					name: 'Test Location',
					type: 'GREENHOUSE',
					description: null,
				}),
			);
		});

		it('should validate all location types', async () => {
			const types = [
				'ROOM',
				'BALCONY',
				'GARDEN',
				'GREENHOUSE',
				'OUTDOOR_SPACE',
				'INDOOR_SPACE',
			] as const;

			for (const locationType of types) {
				const { result } = renderHook(() =>
					useLocationCreateForm(defaultProps),
				);

				act(() => {
					result.current.setName('Test Location');
					result.current.setType(locationType);
				});

				const mockEvent = {
					preventDefault: jest.fn(),
				} as unknown as React.FormEvent<HTMLFormElement>;

				await act(async () => {
					await result.current.handleSubmit(mockEvent);
				});

				expect(mockOnSubmit).toHaveBeenCalledWith(
					expect.objectContaining({
						type: locationType,
					}),
				);

				jest.clearAllMocks();
			}
		});
	});
});
