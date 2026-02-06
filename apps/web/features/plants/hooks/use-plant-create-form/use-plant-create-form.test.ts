import { renderHook, act } from '@testing-library/react';
import { usePlantCreateForm } from './use-plant-create-form';
import { PLANT_STATUS } from '@/features/plants/constants/plant-status';

describe('usePlantCreateForm', () => {
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
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			expect(result.current.selectedGrowingUnitId).toBe('');
			expect(result.current.name).toBe('');
			expect(result.current.species).toBe('');
			expect(result.current.plantedDate).toBeInstanceOf(Date);
			expect(result.current.notes).toBe('');
			expect(result.current.status).toBe(PLANT_STATUS.PLANTED);
			expect(result.current.formErrors).toEqual({});
		});

		it('should initialize with provided initialGrowingUnitId', () => {
			const { result } = renderHook(() =>
				usePlantCreateForm({
					...defaultProps,
					initialGrowingUnitId: 'unit-123',
				}),
			);

			expect(result.current.selectedGrowingUnitId).toBe('unit-123');
		});
	});

	describe('State Setters', () => {
		it('should update selectedGrowingUnitId', () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			act(() => {
				result.current.setSelectedGrowingUnitId('new-unit-id');
			});

			expect(result.current.selectedGrowingUnitId).toBe('new-unit-id');
		});

		it('should update name', () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			act(() => {
				result.current.setName('Tomato Plant');
			});

			expect(result.current.name).toBe('Tomato Plant');
		});

		it('should update species', () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			act(() => {
				result.current.setSpecies('Solanum lycopersicum');
			});

			expect(result.current.species).toBe('Solanum lycopersicum');
		});

		it('should update plantedDate', () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));
			const newDate = new Date('2024-01-15');

			act(() => {
				result.current.setPlantedDate(newDate);
			});

			expect(result.current.plantedDate).toEqual(newDate);
		});

		it('should update notes', () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			act(() => {
				result.current.setNotes('This is a test note');
			});

			expect(result.current.notes).toBe('This is a test note');
		});

		it('should update status', () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			act(() => {
				result.current.setStatus(PLANT_STATUS.GROWING);
			});

			expect(result.current.status).toBe(PLANT_STATUS.GROWING);
		});
	});

	describe('handleSubmit', () => {
		it('should validate and submit valid form data', async () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			// Set valid form data
			act(() => {
				result.current.setName('Test Plant');
				result.current.setSpecies('Test Species');
				result.current.setSelectedGrowingUnitId('unit-123');
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
					name: 'Test Plant',
					species: 'Test Species',
					growingUnitId: 'unit-123',
				}),
			);
		});

		it('should set form errors when validation fails', async () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

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

		it('should use initialGrowingUnitId when selectedGrowingUnitId is empty', async () => {
			const { result } = renderHook(() =>
				usePlantCreateForm({
					...defaultProps,
					initialGrowingUnitId: 'initial-unit',
				}),
			);

			act(() => {
				result.current.setName('Test Plant');
				result.current.setSpecies('Test Species');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					growingUnitId: 'initial-unit',
				}),
			);
		});

		it('should reset form and close dialog after successful submission', async () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			act(() => {
				result.current.setName('Test Plant');
				result.current.setSpecies('Test Species');
				result.current.setSelectedGrowingUnitId('unit-123');
				result.current.setNotes('Test notes');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.name).toBe('');
			expect(result.current.species).toBe('');
			expect(result.current.notes).toBe('');
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not reset form when submission fails', async () => {
			const errorProps = {
				...defaultProps,
				error: new Error('Submission failed'),
			};
			const { result } = renderHook(() => usePlantCreateForm(errorProps));

			act(() => {
				result.current.setName('Test Plant');
				result.current.setSpecies('Test Species');
				result.current.setSelectedGrowingUnitId('unit-123');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Form should not be reset when there's an error
			expect(result.current.name).toBe('Test Plant');
			expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
		});

		it('should clear form errors before submission', async () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			// Set some form errors manually
			act(() => {
				result.current.setName('Test Plant');
				result.current.setSpecies('Test Species');
				result.current.setSelectedGrowingUnitId('unit-123');
			});

			// First submit to set errors
			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('handleOpenChange', () => {
		it('should reset form when closing dialog', () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			// Set some form data
			act(() => {
				result.current.setName('Test Plant');
				result.current.setSpecies('Test Species');
				result.current.setNotes('Test notes');
			});

			// Close dialog
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.name).toBe('');
			expect(result.current.species).toBe('');
			expect(result.current.notes).toBe('');
			expect(result.current.formErrors).toEqual({});
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not reset form when opening dialog', () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			// Set some form data
			act(() => {
				result.current.setName('Test Plant');
				result.current.setSpecies('Test Species');
			});

			// Open dialog
			act(() => {
				result.current.handleOpenChange(true);
			});

			expect(result.current.name).toBe('Test Plant');
			expect(result.current.species).toBe('Test Species');
			expect(mockOnOpenChange).toHaveBeenCalledWith(true);
		});

		it('should reset to initialGrowingUnitId when provided', () => {
			const { result } = renderHook(() =>
				usePlantCreateForm({
					...defaultProps,
					initialGrowingUnitId: 'initial-unit',
				}),
			);

			// Change growing unit
			act(() => {
				result.current.setSelectedGrowingUnitId('different-unit');
			});

			// Close dialog
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.selectedGrowingUnitId).toBe('initial-unit');
		});
	});

	describe('Form Validation Integration', () => {
		it('should handle optional notes field correctly', async () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			act(() => {
				result.current.setName('Test Plant');
				result.current.setSpecies('Test Species');
				result.current.setSelectedGrowingUnitId('unit-123');
				// Don't set notes (optional)
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalled();
		});

		it('should validate status field', async () => {
			const { result } = renderHook(() => usePlantCreateForm(defaultProps));

			act(() => {
				result.current.setName('Test Plant');
				result.current.setSpecies('Test Species');
				result.current.setSelectedGrowingUnitId('unit-123');
				result.current.setStatus(PLANT_STATUS.HARVESTED);
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					status: PLANT_STATUS.HARVESTED,
				}),
			);
		});
	});
});
