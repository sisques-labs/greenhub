import { renderHook, act } from '@testing-library/react';
import { useGrowingUnitUpdateForm } from './use-growing-unit-update-form';
import type { GrowingUnitResponse } from '@/features/growing-units/api/types';

// Mock the useLocationsList hook
jest.mock('@/features/locations/hooks/use-locations-list/use-locations-list', () => ({
	useLocationsList: () => ({
		locations: [
			{ id: 'location-1', name: 'Garden', type: 'OUTDOOR' },
			{ id: 'location-2', name: 'Greenhouse', type: 'INDOOR' },
		],
		isLoading: false,
	}),
}));

describe('useGrowingUnitUpdateForm', () => {
	const mockOnSubmit = jest.fn();
	const mockOnOpenChange = jest.fn();
	const mockTranslations = (key: string) => key;

	const mockGrowingUnit: GrowingUnitResponse = {
		id: 'unit-123',
		name: 'Test Growing Unit',
		type: 'POT',
		capacity: 10,
		dimensions: {
			length: 30,
			width: 20,
			height: 25,
			unit: 'CENTIMETER',
		},
		location: {
			id: 'location-1',
			name: 'Garden',
			type: 'OUTDOOR',
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-01T00:00:00Z',
		},
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	};

	const defaultProps = {
		growingUnit: mockGrowingUnit,
		onSubmit: mockOnSubmit,
		onOpenChange: mockOnOpenChange,
		error: null,
		translations: mockTranslations,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize with default values when growingUnit is null', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm({
					...defaultProps,
					growingUnit: null,
				}),
			);

			expect(result.current.id).toBe('');
			expect(result.current.locationId).toBe('');
			expect(result.current.name).toBe('');
			expect(result.current.type).toBe('POT');
			expect(result.current.capacity).toBeUndefined();
			expect(result.current.length).toBeUndefined();
			expect(result.current.width).toBeUndefined();
			expect(result.current.height).toBeUndefined();
			expect(result.current.unit).toBeUndefined();
			expect(result.current.formErrors).toEqual({});
		});

		it('should load locations data', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			expect(result.current.locations).toHaveLength(2);
			expect(result.current.isLoadingLocations).toBe(false);
		});
	});

	describe('Synchronization Logic', () => {
		it('should synchronize form state when growingUnit is provided', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			expect(result.current.id).toBe('unit-123');
			expect(result.current.locationId).toBe('location-1');
			expect(result.current.name).toBe('Test Growing Unit');
			expect(result.current.type).toBe('POT');
			expect(result.current.capacity).toBe(10);
			expect(result.current.length).toBe(30);
			expect(result.current.width).toBe(20);
			expect(result.current.height).toBe(25);
			expect(result.current.unit).toBe('CENTIMETER');
		});

		it('should update form state when growingUnit changes', () => {
			const { result, rerender } = renderHook(
				({ growingUnit }) =>
					useGrowingUnitUpdateForm({
						...defaultProps,
						growingUnit,
					}),
				{
					initialProps: { growingUnit: mockGrowingUnit },
				},
			);

			// Initial state
			expect(result.current.name).toBe('Test Growing Unit');
			expect(result.current.capacity).toBe(10);

			// Change the growing unit
			const updatedGrowingUnit: GrowingUnitResponse = {
				...mockGrowingUnit,
				id: 'unit-456',
				name: 'Updated Growing Unit',
				capacity: 20,
			};

			rerender({ growingUnit: updatedGrowingUnit });

			// State should be updated
			expect(result.current.id).toBe('unit-456');
			expect(result.current.name).toBe('Updated Growing Unit');
			expect(result.current.capacity).toBe(20);
		});

		it('should handle growingUnit without dimensions', () => {
			const growingUnitWithoutDimensions: GrowingUnitResponse = {
				...mockGrowingUnit,
				dimensions: undefined,
			};

			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm({
					...defaultProps,
					growingUnit: growingUnitWithoutDimensions,
				}),
			);

			expect(result.current.length).toBeUndefined();
			expect(result.current.width).toBeUndefined();
			expect(result.current.height).toBeUndefined();
			expect(result.current.unit).toBeUndefined();
		});

		it('should clear form errors when growingUnit changes', () => {
			const { result, rerender } = renderHook(
				({ growingUnit }) =>
					useGrowingUnitUpdateForm({
						...defaultProps,
						growingUnit,
					}),
				{
					initialProps: { growingUnit: mockGrowingUnit },
				},
			);

			// Manually set form errors
			act(() => {
				const mockEvent = {
					preventDefault: jest.fn(),
				} as unknown as React.FormEvent<HTMLFormElement>;

				// Submit invalid form to generate errors
				result.current.handleSubmit(mockEvent);
			});

			// Change growing unit
			const updatedGrowingUnit: GrowingUnitResponse = {
				...mockGrowingUnit,
				name: 'New Name',
			};

			rerender({ growingUnit: updatedGrowingUnit });

			// Errors should be cleared
			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('State Setters', () => {
		it('should update locationId', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('location-2');
			});

			expect(result.current.locationId).toBe('location-2');
		});

		it('should update name', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setName('New Name');
			});

			expect(result.current.name).toBe('New Name');
		});

		it('should update type', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setType('GARDEN_BED');
			});

			expect(result.current.type).toBe('GARDEN_BED');
		});

		it('should update capacity', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setCapacity(15);
			});

			expect(result.current.capacity).toBe(15);
		});

		it('should update dimensions', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setLength(40);
				result.current.setWidth(30);
				result.current.setHeight(35);
				result.current.setUnit('METER');
			});

			expect(result.current.length).toBe(40);
			expect(result.current.width).toBe(30);
			expect(result.current.height).toBe(35);
			expect(result.current.unit).toBe('METER');
		});
	});

	describe('handleSubmit', () => {
		it('should validate and submit valid form data', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
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
					id: 'unit-123',
					locationId: 'location-1',
					name: 'Test Growing Unit',
					type: 'POT',
					capacity: 10,
					length: 30,
					width: 20,
					height: 25,
					unit: 'CENTIMETER',
				}),
			);
		});

		it('should set form errors when validation fails', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			// Clear required fields
			act(() => {
				result.current.setId('');
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

		it('should handle optional fields correctly', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			// Clear optional fields
			act(() => {
				result.current.setCapacity(undefined);
				result.current.setLength(undefined);
				result.current.setWidth(undefined);
				result.current.setHeight(undefined);
				result.current.setUnit(undefined);
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'unit-123',
					locationId: 'location-1',
					name: 'Test Growing Unit',
					type: 'POT',
				}),
			);
		});

		it('should convert empty strings to undefined for optional fields', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			act(() => {
				result.current.setLocationId('');
				result.current.setName('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Should convert empty strings to undefined
			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					locationId: undefined,
					name: undefined,
				}),
			);
		});

		it('should close dialog after successful submission', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not close dialog when submission fails', async () => {
			const errorProps = {
				...defaultProps,
				error: new Error('Submission failed'),
			};
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(errorProps),
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
				useGrowingUnitUpdateForm(defaultProps),
			);

			// First, submit invalid data to generate errors
			act(() => {
				result.current.setId('');
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
				result.current.setId('unit-123');
			});

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('handleOpenChange', () => {
		it('should clear form errors when closing dialog', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			// Set some form errors
			act(() => {
				result.current.setId('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			act(() => {
				result.current.handleSubmit(mockEvent);
			});

			// Close dialog
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.formErrors).toEqual({});
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not clear form errors when opening dialog', () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			// Set some form errors
			act(() => {
				result.current.setId('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			act(() => {
				result.current.handleSubmit(mockEvent);
			});

			const errorsBefore = result.current.formErrors;

			// Open dialog
			act(() => {
				result.current.handleOpenChange(true);
			});

			expect(result.current.formErrors).toEqual(errorsBefore);
			expect(mockOnOpenChange).toHaveBeenCalledWith(true);
		});
	});

	describe('Form Validation Integration', () => {
		it('should validate different growing unit types', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			const types = ['POT', 'GARDEN_BED', 'HANGING_BASKET', 'WINDOW_BOX'] as const;

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

		it('should validate different dimension units', async () => {
			const { result } = renderHook(() =>
				useGrowingUnitUpdateForm(defaultProps),
			);

			const units = ['MILLIMETER', 'CENTIMETER', 'METER', 'INCH', 'FOOT'] as const;

			for (const unit of units) {
				act(() => {
					result.current.setUnit(unit);
				});

				const mockEvent = {
					preventDefault: jest.fn(),
				} as unknown as React.FormEvent<HTMLFormElement>;

				await act(async () => {
					await result.current.handleSubmit(mockEvent);
				});

				expect(mockOnSubmit).toHaveBeenCalledWith(
					expect.objectContaining({
						unit,
					}),
				);

				mockOnSubmit.mockClear();
			}
		});
	});
});
