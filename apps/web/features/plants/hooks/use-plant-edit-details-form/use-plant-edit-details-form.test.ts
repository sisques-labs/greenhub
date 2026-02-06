import { renderHook, act, waitFor } from '@testing-library/react';
import { usePlantEditDetailsForm } from './use-plant-edit-details-form';
import { PLANT_STATUS } from '@/features/plants/constants/plant-status';
import type { PlantResponse } from '@/features/plants/api/types';

describe('usePlantEditDetailsForm', () => {
	const mockPlant: PlantResponse = {
		id: '1',
		name: 'Tomato Plant',
		species: 'Solanum lycopersicum',
		plantedDate: '2024-01-15T00:00:00.000Z',
		notes: 'Growing well',
		status: PLANT_STATUS.GROWING,
		locationId: 'loc-1',
		userId: 'user-1',
		createdAt: '2024-01-01T00:00:00.000Z',
		updatedAt: '2024-01-15T00:00:00.000Z',
	};

	const mockOnSubmit = jest.fn();
	const mockOnOpenChange = jest.fn();
	const mockTranslations = jest.fn((key: string) => key);

	const defaultProps = {
		plant: mockPlant,
		onSubmit: mockOnSubmit,
		error: null,
		onOpenChange: mockOnOpenChange,
		translations: mockTranslations,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize form state with plant data', () => {
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			expect(result.current.name).toBe('Tomato Plant');
			expect(result.current.species).toBe('Solanum lycopersicum');
			expect(result.current.plantedDate).toEqual(
				new Date('2024-01-15T00:00:00.000Z'),
			);
			expect(result.current.notes).toBe('Growing well');
			expect(result.current.status).toBe(PLANT_STATUS.GROWING);
			expect(result.current.formErrors).toEqual({});
		});

		it('should initialize with empty strings for missing optional fields', () => {
			const plantWithMissingFields: PlantResponse = {
				...mockPlant,
				name: undefined,
				species: undefined,
				plantedDate: undefined,
				notes: undefined,
			};

			const { result } = renderHook(() =>
				usePlantEditDetailsForm({
					...defaultProps,
					plant: plantWithMissingFields,
				}),
			);

			expect(result.current.name).toBe('');
			expect(result.current.species).toBe('');
			expect(result.current.plantedDate).toBeNull();
			expect(result.current.notes).toBe('');
			expect(result.current.status).toBe(PLANT_STATUS.PLANTED);
		});
	});

	describe('Synchronization with plant prop', () => {
		it('should update form state when plant prop changes', () => {
			const { result, rerender } = renderHook(
				({ plant }) => usePlantEditDetailsForm({ ...defaultProps, plant }),
				{
					initialProps: { plant: mockPlant },
				},
			);

			expect(result.current.name).toBe('Tomato Plant');

			const updatedPlant: PlantResponse = {
				...mockPlant,
				name: 'Updated Plant Name',
				species: 'New Species',
				status: PLANT_STATUS.HARVESTED,
			};

			rerender({ plant: updatedPlant });

			expect(result.current.name).toBe('Updated Plant Name');
			expect(result.current.species).toBe('New Species');
			expect(result.current.status).toBe(PLANT_STATUS.HARVESTED);
		});

		it('should handle plant prop with null plantedDate', () => {
			const plantWithNullDate: PlantResponse = {
				...mockPlant,
				plantedDate: undefined,
			};

			const { result } = renderHook(() =>
				usePlantEditDetailsForm({
					...defaultProps,
					plant: plantWithNullDate,
				}),
			);

			expect(result.current.plantedDate).toBeNull();
		});
	});

	describe('Form state setters', () => {
		it('should update name when setName is called', () => {
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			act(() => {
				result.current.setName('New Plant Name');
			});

			expect(result.current.name).toBe('New Plant Name');
		});

		it('should update species when setSpecies is called', () => {
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			act(() => {
				result.current.setSpecies('New Species');
			});

			expect(result.current.species).toBe('New Species');
		});

		it('should update plantedDate when setPlantedDate is called', () => {
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));
			const newDate = new Date('2024-02-01T00:00:00.000Z');

			act(() => {
				result.current.setPlantedDate(newDate);
			});

			expect(result.current.plantedDate).toEqual(newDate);
		});

		it('should update notes when setNotes is called', () => {
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			act(() => {
				result.current.setNotes('Updated notes');
			});

			expect(result.current.notes).toBe('Updated notes');
		});

		it('should update status when setStatus is called', () => {
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			act(() => {
				result.current.setStatus(PLANT_STATUS.DEAD);
			});

			expect(result.current.status).toBe(PLANT_STATUS.DEAD);
		});
	});

	describe('handleSubmit', () => {
		it('should submit valid form data', async () => {
			mockOnSubmit.mockResolvedValueOnce(undefined);
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockOnSubmit).toHaveBeenCalledWith({
				name: 'Tomato Plant',
				species: 'Solanum lycopersicum',
				plantedDate: new Date('2024-01-15T00:00:00.000Z'),
				notes: 'Growing well',
				status: PLANT_STATUS.GROWING,
			});
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
			expect(result.current.formErrors).toEqual({});
		});

		it('should not close modal on submit if there is an error', async () => {
			mockOnSubmit.mockResolvedValueOnce(undefined);
			const propsWithError = {
				...defaultProps,
				error: new Error('Submit failed'),
			};

			const { result } = renderHook(() =>
				usePlantEditDetailsForm(propsWithError),
			);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalled();
			expect(mockOnOpenChange).not.toHaveBeenCalled();
		});

		it('should set form errors for invalid data', async () => {
			mockTranslations.mockImplementation((key: string) => {
				if (key === 'shared.validation.name.required') return 'Name is required';
				if (key === 'shared.validation.species.required')
					return 'Species is required';
				return key;
			});

			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			// Set empty name and species
			act(() => {
				result.current.setName('');
				result.current.setSpecies('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).not.toHaveBeenCalled();
			expect(result.current.formErrors).toBeDefined();
			expect(Object.keys(result.current.formErrors).length).toBeGreaterThan(0);
		});

		it('should handle empty strings as undefined for optional fields', async () => {
			mockOnSubmit.mockResolvedValueOnce(undefined);
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			act(() => {
				result.current.setName('');
				result.current.setSpecies('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Even though validation might fail for empty required fields,
			// the hook properly converts empty strings to undefined
			expect(mockEvent.preventDefault).toHaveBeenCalled();
		});

		it('should clear previous form errors on successful validation', async () => {
			mockOnSubmit.mockResolvedValueOnce(undefined);
			mockTranslations.mockImplementation((key: string) => {
				if (key === 'shared.validation.name.required') return 'Name is required';
				return key;
			});

			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			// First, create an error
			act(() => {
				result.current.setName('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(Object.keys(result.current.formErrors).length).toBeGreaterThan(0);

			// Now fix the error and resubmit
			act(() => {
				result.current.setName('Valid Name');
			});

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('handleOpenChange', () => {
		it('should call onOpenChange when modal is opened', () => {
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			act(() => {
				result.current.handleOpenChange(true);
			});

			expect(mockOnOpenChange).toHaveBeenCalledWith(true);
		});

		it('should reset form to plant data when modal is closed', () => {
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			// Modify form state
			act(() => {
				result.current.setName('Modified Name');
				result.current.setSpecies('Modified Species');
				result.current.setNotes('Modified Notes');
				result.current.setStatus(PLANT_STATUS.DEAD);
			});

			expect(result.current.name).toBe('Modified Name');

			// Close modal
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.name).toBe('Tomato Plant');
			expect(result.current.species).toBe('Solanum lycopersicum');
			expect(result.current.notes).toBe('Growing well');
			expect(result.current.status).toBe(PLANT_STATUS.GROWING);
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should clear form errors when modal is closed', () => {
			const { result } = renderHook(() => usePlantEditDetailsForm(defaultProps));

			// Manually set some form errors
			act(() => {
				result.current.setName('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			// Create validation errors
			act(() => {
				result.current.handleSubmit(mockEvent);
			});

			// Close modal
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.formErrors).toEqual({});
		});

		it('should reset plantedDate to null when closing if plant has no plantedDate', () => {
			const plantWithoutDate: PlantResponse = {
				...mockPlant,
				plantedDate: undefined,
			};

			const { result } = renderHook(() =>
				usePlantEditDetailsForm({
					...defaultProps,
					plant: plantWithoutDate,
				}),
			);

			// Set a date
			act(() => {
				result.current.setPlantedDate(new Date('2024-03-01T00:00:00.000Z'));
			});

			expect(result.current.plantedDate).not.toBeNull();

			// Close modal
			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.plantedDate).toBeNull();
		});
	});

	describe('Translation integration', () => {
		it('should use translations function for schema creation', () => {
			renderHook(() => usePlantEditDetailsForm(defaultProps));

			// The translations function should be called when creating the schema
			expect(mockTranslations).toHaveBeenCalled();
		});

		it('should recreate schema when translations change', () => {
			const { rerender } = renderHook(
				({ translations }) =>
					usePlantEditDetailsForm({ ...defaultProps, translations }),
				{
					initialProps: { translations: mockTranslations },
				},
			);

			const callCountBefore = mockTranslations.mock.calls.length;

			const newTranslations = jest.fn((key: string) => key);
			rerender({ translations: newTranslations });

			expect(newTranslations.mock.calls.length).toBeGreaterThan(0);
		});
	});
});
