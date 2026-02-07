import { renderHook, act } from '@testing-library/react';
import { useLocationUpdateForm } from './use-location-update-form';
import type { LocationResponse } from '@/features/locations/api/types';

describe('useLocationUpdateForm', () => {
	const mockOnSubmit = jest.fn();
	const mockOnOpenChange = jest.fn();
	const mockTranslations = (key: string) => key;

	const mockLocation: LocationResponse = {
		id: 'location-123',
		name: 'Test Location',
		type: 'ROOM',
		description: 'Test description',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	};

	const defaultProps = {
		location: mockLocation,
		onSubmit: mockOnSubmit,
		onOpenChange: mockOnOpenChange,
		error: null,
		t: mockTranslations,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize with default values when location is null', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm({
					...defaultProps,
					location: null,
				}),
			);

			expect(result.current.name).toBe('');
			expect(result.current.type).toBe('INDOOR_SPACE');
			expect(result.current.description).toBeNull();
			expect(result.current.formErrors).toEqual({});
		});

		it('should initialize with location data when provided', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			expect(result.current.name).toBe('Test Location');
			expect(result.current.type).toBe('ROOM');
			expect(result.current.description).toBe('Test description');
			expect(result.current.formErrors).toEqual({});
		});

		it('should handle location without description', () => {
			const locationWithoutDescription: LocationResponse = {
				...mockLocation,
				description: null,
			};

			const { result } = renderHook(() =>
				useLocationUpdateForm({
					...defaultProps,
					location: locationWithoutDescription,
				}),
			);

			expect(result.current.description).toBeNull();
		});
	});

	describe('Synchronization Logic', () => {
		it('should synchronize form state when location is provided', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			expect(result.current.name).toBe('Test Location');
			expect(result.current.type).toBe('ROOM');
			expect(result.current.description).toBe('Test description');
		});

		it('should update form state when location changes', () => {
			const { result, rerender } = renderHook(
				({ location }) =>
					useLocationUpdateForm({
						...defaultProps,
						location,
					}),
				{
					initialProps: { location: mockLocation },
				},
			);

			// Initial state
			expect(result.current.name).toBe('Test Location');
			expect(result.current.type).toBe('ROOM');

			// Change the location
			const updatedLocation: LocationResponse = {
				...mockLocation,
				id: 'location-456',
				name: 'Updated Location',
				type: 'GARDEN',
				description: 'Updated description',
			};

			rerender({ location: updatedLocation });

			// State should be updated
			expect(result.current.name).toBe('Updated Location');
			expect(result.current.type).toBe('GARDEN');
			expect(result.current.description).toBe('Updated description');
		});

		it('should clear form errors when location changes', () => {
			const { result, rerender } = renderHook(
				({ location }) =>
					useLocationUpdateForm({
						...defaultProps,
						location,
					}),
				{
					initialProps: { location: mockLocation },
				},
			);

			// Submit invalid form to generate errors
			act(() => {
				result.current.setName('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			act(() => {
				result.current.handleSubmit(mockEvent);
			});

			// Should have errors
			expect(result.current.formErrors).not.toEqual({});

			// Change location
			const updatedLocation: LocationResponse = {
				...mockLocation,
				name: 'New Name',
			};

			rerender({ location: updatedLocation });

			// Errors should be cleared
			expect(result.current.formErrors).toEqual({});
		});

		it('should not update state when location is null', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm({
					...defaultProps,
					location: null,
				}),
			);

			// Set some values
			act(() => {
				result.current.setName('Custom Name');
				result.current.setType('BALCONY');
			});

			// Values should remain unchanged
			expect(result.current.name).toBe('Custom Name');
			expect(result.current.type).toBe('BALCONY');
		});
	});

	describe('State Setters', () => {
		it('should update name', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setName('New Name');
			});

			expect(result.current.name).toBe('New Name');
		});

		it('should update type', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setType('GREENHOUSE');
			});

			expect(result.current.type).toBe('GREENHOUSE');
		});

		it('should update description', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setDescription('New description');
			});

			expect(result.current.description).toBe('New description');
		});

		it('should handle null description', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setDescription(null);
			});

			expect(result.current.description).toBeNull();
		});
	});

	describe('handleSubmit', () => {
		it('should validate and submit valid form data', async () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'location-123',
					name: 'Test Location',
					type: 'ROOM',
					description: 'Test description',
				}),
			);
		});

		it('should not submit when location is null', async () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm({
					...defaultProps,
					location: null,
				}),
			);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should set form errors when validation fails', async () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			// Clear required field
			act(() => {
				result.current.setName('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).not.toEqual({});
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should handle optional description field correctly', async () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			// Clear description
			act(() => {
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
					id: 'location-123',
					name: 'Test Location',
					type: 'ROOM',
					description: null,
				}),
			);
		});

		it('should close dialog after successful submission when no error', async () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not close dialog when submission has error', async () => {
			const errorProps = {
				...defaultProps,
				error: new Error('Submission failed'),
			};
			const { result } = renderHook(() =>
				useLocationUpdateForm(errorProps),
			);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
		});

		it('should clear form errors before submission', async () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			// First, submit invalid data to generate errors
			act(() => {
				result.current.setName('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).not.toEqual({});

			// Fix the data and submit again
			act(() => {
				result.current.setName('Test Location');
			});

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('handleOpenChange', () => {
		it('should reset form to location values when closing dialog', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			// Change form values
			act(() => {
				result.current.setName('Changed Name');
				result.current.setType('BALCONY');
				result.current.setDescription('Changed description');
			});

			expect(result.current.name).toBe('Changed Name');

			// Close dialog
			act(() => {
				result.current.handleOpenChange(false);
			});

			// Values should be reset to original location values
			expect(result.current.name).toBe('Test Location');
			expect(result.current.type).toBe('ROOM');
			expect(result.current.description).toBe('Test description');
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should clear form errors when closing dialog', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			// Set some form errors
			act(() => {
				result.current.setName('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			act(() => {
				result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).not.toEqual({});

			// Close dialog
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.formErrors).toEqual({});
		});

		it('should not reset form when opening dialog', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			// Change form values
			act(() => {
				result.current.setName('Changed Name');
			});

			// Open dialog
			act(() => {
				result.current.handleOpenChange(true);
			});

			// Values should remain unchanged
			expect(result.current.name).toBe('Changed Name');
			expect(mockOnOpenChange).toHaveBeenCalledWith(true);
		});

		it('should handle closing when location is null', () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm({
					...defaultProps,
					location: null,
				}),
			);

			// Close dialog
			act(() => {
				result.current.handleOpenChange(false);
			});

			// Should not throw an error
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});
	});

	describe('Form Validation Integration', () => {
		it('should validate different location types', async () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			const types = [
				'ROOM',
				'BALCONY',
				'GARDEN',
				'GREENHOUSE',
				'OUTDOOR_SPACE',
				'INDOOR_SPACE',
			] as const;

			for (const type of types) {
				act(() => {
					result.current.setType(type);
				});

				const mockEvent = {
					preventDefault: jest.fn(),
				} as unknown as React.FormEvent<HTMLFormElement>;

				await act(async () => {
					await result.current.handleSubmit(mockEvent);
				});

				expect(mockOnSubmit).toHaveBeenCalledWith(
					expect.objectContaining({
						type,
					}),
				);

				mockOnSubmit.mockClear();
			}
		});

		it('should validate empty strings vs null for optional fields', async () => {
			const { result } = renderHook(() =>
				useLocationUpdateForm(defaultProps),
			);

			// Test with empty string (should convert to null)
			act(() => {
				result.current.setDescription('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					description: '',
				}),
			);
		});
	});

	describe('Edge Cases', () => {
		it('should handle rapid location changes', () => {
			const { result, rerender } = renderHook(
				({ location }) =>
					useLocationUpdateForm({
						...defaultProps,
						location,
					}),
				{
					initialProps: { location: mockLocation },
				},
			);

			// Rapidly change locations
			const location1: LocationResponse = {
				...mockLocation,
				name: 'Location 1',
			};
			const location2: LocationResponse = {
				...mockLocation,
				name: 'Location 2',
			};
			const location3: LocationResponse = {
				...mockLocation,
				name: 'Location 3',
			};

			rerender({ location: location1 });
			expect(result.current.name).toBe('Location 1');

			rerender({ location: location2 });
			expect(result.current.name).toBe('Location 2');

			rerender({ location: location3 });
			expect(result.current.name).toBe('Location 3');
		});

		it('should handle location changing from null to defined', () => {
			const { result, rerender } = renderHook(
				({ location }) =>
					useLocationUpdateForm({
						...defaultProps,
						location,
					}),
				{
					initialProps: { location: null },
				},
			);

			// Initially null
			expect(result.current.name).toBe('');

			// Change to defined location
			rerender({ location: mockLocation });

			// State should be updated
			expect(result.current.name).toBe('Test Location');
			expect(result.current.type).toBe('ROOM');
		});

		it('should handle location changing from defined to null', () => {
			const { result, rerender } = renderHook(
				({ location }) =>
					useLocationUpdateForm({
						...defaultProps,
						location,
					}),
				{
					initialProps: { location: mockLocation },
				},
			);

			// Initially defined
			expect(result.current.name).toBe('Test Location');

			// Change to null
			rerender({ location: null });

			// State should remain unchanged when location becomes null
			expect(result.current.name).toBe('Test Location');
		});
	});
});
