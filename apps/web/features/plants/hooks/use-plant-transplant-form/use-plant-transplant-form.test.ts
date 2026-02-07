import { renderHook, act } from '@testing-library/react';
import type { GrowingUnitResponse } from 'features/growing-units/api/types';
import type { PlantGrowingUnitReference } from 'features/plants/api/types';
import { usePlantTransplantForm } from './use-plant-transplant-form';

describe('usePlantTransplantForm', () => {
	const mockOnSubmit = jest.fn();
	const mockOnOpenChange = jest.fn();
	const mockTranslations = (key: string) => key;

	const sourceGrowingUnit: PlantGrowingUnitReference = {
		id: 'source-unit-1',
		name: 'Source Growing Unit',
	};

	const targetGrowingUnits: GrowingUnitResponse[] = [
		{
			id: 'source-unit-1',
			name: 'Source Growing Unit',
			capacity: 10,
			remainingCapacity: 5,
			description: 'Source unit',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: 'target-unit-1',
			name: 'Target Growing Unit 1',
			capacity: 20,
			remainingCapacity: 15,
			description: 'Target unit 1',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: 'target-unit-2',
			name: 'Target Growing Unit 2',
			capacity: 30,
			remainingCapacity: 25,
			description: 'Target unit 2',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	const defaultProps = {
		sourceGrowingUnit,
		targetGrowingUnits,
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
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			expect(result.current.targetGrowingUnitId).toBe('');
			expect(result.current.formErrors).toEqual({});
		});

		it('should initialize availableTargetGrowingUnits without source unit', () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			expect(result.current.availableTargetGrowingUnits).toHaveLength(2);
			expect(
				result.current.availableTargetGrowingUnits.find(
					(unit) => unit.id === 'source-unit-1',
				),
			).toBeUndefined();
			expect(
				result.current.availableTargetGrowingUnits.find(
					(unit) => unit.id === 'target-unit-1',
				),
			).toBeDefined();
			expect(
				result.current.availableTargetGrowingUnits.find(
					(unit) => unit.id === 'target-unit-2',
				),
			).toBeDefined();
		});

		it('should return all units when sourceGrowingUnit is null', () => {
			const { result } = renderHook(() =>
				usePlantTransplantForm({
					...defaultProps,
					sourceGrowingUnit: null,
				}),
			);

			expect(result.current.availableTargetGrowingUnits).toHaveLength(3);
		});
	});

	describe('State Setters', () => {
		it('should update targetGrowingUnitId', () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			act(() => {
				result.current.setTargetGrowingUnitId('target-unit-1');
			});

			expect(result.current.targetGrowingUnitId).toBe('target-unit-1');
		});
	});

	describe('handleSubmit', () => {
		it('should validate and submit valid form data', async () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			act(() => {
				result.current.setTargetGrowingUnitId('target-unit-1');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockOnSubmit).toHaveBeenCalledWith('target-unit-1');
		});

		it('should set form errors when validation fails', async () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).not.toEqual({});
			expect(result.current.formErrors.targetGrowingUnitId).toBeDefined();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should reset form and close dialog after successful submission', async () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			act(() => {
				result.current.setTargetGrowingUnitId('target-unit-1');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.targetGrowingUnitId).toBe('');
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not reset form when submission fails', async () => {
			const errorProps = {
				...defaultProps,
				error: new Error('Submission failed'),
			};
			const { result } = renderHook(() => usePlantTransplantForm(errorProps));

			act(() => {
				result.current.setTargetGrowingUnitId('target-unit-1');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.targetGrowingUnitId).toBe('target-unit-1');
			expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
		});

		it('should clear form errors before submission', async () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			act(() => {
				result.current.setTargetGrowingUnitId('target-unit-1');
			});

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
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			act(() => {
				result.current.setTargetGrowingUnitId('target-unit-1');
			});

			act(() => {
				result.current.handleOpenChange(false);
			});

			expect(result.current.targetGrowingUnitId).toBe('');
			expect(result.current.formErrors).toEqual({});
			expect(mockOnOpenChange).toHaveBeenCalledWith(false);
		});

		it('should not reset form when opening dialog', () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			act(() => {
				result.current.setTargetGrowingUnitId('target-unit-1');
			});

			act(() => {
				result.current.handleOpenChange(true);
			});

			expect(result.current.targetGrowingUnitId).toBe('target-unit-1');
			expect(mockOnOpenChange).toHaveBeenCalledWith(true);
		});
	});

	describe('Growing Unit Filtering Logic', () => {
		it('should filter out source growing unit from available targets', () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			const sourceUnitInAvailable =
				result.current.availableTargetGrowingUnits.some(
					(unit) => unit.id === sourceGrowingUnit.id,
				);

			expect(sourceUnitInAvailable).toBe(false);
			expect(result.current.availableTargetGrowingUnits).toHaveLength(2);
		});

		it('should update available units when targetGrowingUnits changes', () => {
			const { result, rerender } = renderHook(
				({ targetGrowingUnits }) =>
					usePlantTransplantForm({
						...defaultProps,
						targetGrowingUnits,
					}),
				{
					initialProps: { targetGrowingUnits },
				},
			);

			expect(result.current.availableTargetGrowingUnits).toHaveLength(2);

			const newTargetUnits: GrowingUnitResponse[] = [
				{
					id: 'target-unit-3',
					name: 'Target Growing Unit 3',
					capacity: 40,
					remainingCapacity: 35,
					description: 'Target unit 3',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			];

			rerender({ targetGrowingUnits: newTargetUnits });

			expect(result.current.availableTargetGrowingUnits).toHaveLength(1);
			expect(result.current.availableTargetGrowingUnits[0].id).toBe(
				'target-unit-3',
			);
		});

		it('should update available units when sourceGrowingUnit changes', () => {
			const { result, rerender } = renderHook(
				({ sourceGrowingUnit }) =>
					usePlantTransplantForm({
						...defaultProps,
						sourceGrowingUnit,
					}),
				{
					initialProps: { sourceGrowingUnit },
				},
			);

			expect(result.current.availableTargetGrowingUnits).toHaveLength(2);

			const newSourceUnit: PlantGrowingUnitReference = {
				id: 'target-unit-1',
				name: 'Target Growing Unit 1',
			};

			rerender({ sourceGrowingUnit: newSourceUnit });

			expect(result.current.availableTargetGrowingUnits).toHaveLength(2);
			expect(
				result.current.availableTargetGrowingUnits.some(
					(unit) => unit.id === 'target-unit-1',
				),
			).toBe(false);
		});

		it('should include all units when source unit is not in target list', () => {
			const differentSourceUnit: PlantGrowingUnitReference = {
				id: 'different-unit',
				name: 'Different Unit',
			};

			const { result } = renderHook(() =>
				usePlantTransplantForm({
					...defaultProps,
					sourceGrowingUnit: differentSourceUnit,
				}),
			);

			expect(result.current.availableTargetGrowingUnits).toHaveLength(3);
		});
	});

	describe('Form Validation Integration', () => {
		it('should validate empty targetGrowingUnitId', async () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.targetGrowingUnitId).toBeDefined();
			expect(result.current.formErrors.targetGrowingUnitId.message).toBeTruthy();
		});

		it('should accept valid targetGrowingUnitId', async () => {
			const { result } = renderHook(() => usePlantTransplantForm(defaultProps));

			act(() => {
				result.current.setTargetGrowingUnitId('target-unit-1');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).toEqual({});
			expect(mockOnSubmit).toHaveBeenCalled();
		});
	});
});
