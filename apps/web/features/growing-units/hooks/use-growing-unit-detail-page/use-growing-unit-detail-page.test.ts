import { renderHook, act } from '@testing-library/react';
import { useGrowingUnitDetailPage } from './use-growing-unit-detail-page';
import { useGrowingUnitFindById } from 'features/growing-units/hooks/use-growing-unit-find-by-id/use-growing-unit-find-by-id';
import { useGrowingUnitUpdate } from 'features/growing-units/hooks/use-growing-unit-update/use-growing-unit-update';
import { useGrowingUnitDetailPageStore } from 'features/growing-units/stores/growing-unit-detail-page-store';
import { usePlantAdd } from 'features/plants/hooks/use-plant-add/use-plant-add';

// Mock dependencies
jest.mock(
	'features/growing-units/hooks/use-growing-unit-find-by-id/use-growing-unit-find-by-id',
);
jest.mock('features/growing-units/hooks/use-growing-unit-update/use-growing-unit-update');
jest.mock('features/growing-units/stores/growing-unit-detail-page-store');
jest.mock('features/plants/hooks/use-plant-add/use-plant-add');

describe('useGrowingUnitDetailPage', () => {
	const mockGrowingUnit = {
		id: 'unit-1',
		name: 'Test Unit',
		type: 'POT' as const,
		capacity: 10,
		numberOfPlants: 5,
		plants: [],
	};

	const mockRefetch = jest.fn();
	const mockHandleUpdate = jest.fn();
	const mockHandlePlantCreate = jest.fn();
	const mockSetUpdateDialogOpen = jest.fn();
	const mockSetCreatePlantDialogOpen = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		(useGrowingUnitFindById as jest.Mock).mockReturnValue({
			growingUnit: mockGrowingUnit,
			isLoading: false,
			error: null,
			refetch: mockRefetch,
		});

		(useGrowingUnitUpdate as jest.Mock).mockReturnValue({
			handleUpdate: mockHandleUpdate,
			isLoading: false,
			error: null,
		});

		(usePlantAdd as jest.Mock).mockReturnValue({
			handleCreate: mockHandlePlantCreate,
			isLoading: false,
			error: null,
		});

		(useGrowingUnitDetailPageStore as jest.Mock).mockReturnValue({
			updateDialogOpen: false,
			setUpdateDialogOpen: mockSetUpdateDialogOpen,
			createPlantDialogOpen: false,
			setCreatePlantDialogOpen: mockSetCreatePlantDialogOpen,
		});
	});

	describe('Initialization', () => {
		it('should initialize with data from hooks', () => {
			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.growingUnit).toEqual(mockGrowingUnit);
			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
		});

		it('should pass id to useGrowingUnitFindById', () => {
			renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(useGrowingUnitFindById).toHaveBeenCalledWith('unit-1');
		});
	});

	describe('Location determination', () => {
		it('should determine indoor location for POT type', () => {
			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.location).toBe('indoor');
		});

		it('should determine indoor location for WINDOW_BOX type', () => {
			(useGrowingUnitFindById as jest.Mock).mockReturnValue({
				growingUnit: { ...mockGrowingUnit, type: 'WINDOW_BOX' },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.location).toBe('indoor');
		});

		it('should determine outdoor location for GARDEN_BED type', () => {
			(useGrowingUnitFindById as jest.Mock).mockReturnValue({
				growingUnit: { ...mockGrowingUnit, type: 'GARDEN_BED' },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.location).toBe('outdoor');
		});

		it('should determine outdoor location for HANGING_BASKET type', () => {
			(useGrowingUnitFindById as jest.Mock).mockReturnValue({
				growingUnit: { ...mockGrowingUnit, type: 'HANGING_BASKET' },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.location).toBe('outdoor');
		});
	});

	describe('Occupancy percentage calculation', () => {
		it('should calculate occupancy percentage correctly', () => {
			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.occupancyPercentage).toBe(50); // 5/10 = 50%
		});

		it('should handle 0% occupancy', () => {
			(useGrowingUnitFindById as jest.Mock).mockReturnValue({
				growingUnit: { ...mockGrowingUnit, numberOfPlants: 0 },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.occupancyPercentage).toBe(0);
		});

		it('should handle 100% occupancy', () => {
			(useGrowingUnitFindById as jest.Mock).mockReturnValue({
				growingUnit: { ...mockGrowingUnit, numberOfPlants: 10 },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.occupancyPercentage).toBe(100);
		});

		it('should handle null growing unit', () => {
			(useGrowingUnitFindById as jest.Mock).mockReturnValue({
				growingUnit: null,
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.occupancyPercentage).toBe(0);
		});
	});

	describe('handleUpdateSubmit', () => {
		it('should call handleUpdate with values', async () => {
			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			const values = {
				id: 'unit-1',
				name: 'Updated Unit',
				locationId: 'location-1',
				capacity: 15,
			};

			await act(async () => {
				await result.current.handleUpdateSubmit(values);
			});

			expect(mockHandleUpdate).toHaveBeenCalledWith(
				values,
				expect.any(Function),
			);
		});

		it('should call refetch and close dialog after successful update', async () => {
			mockHandleUpdate.mockImplementation(
				async (_values: any, callback: () => void) => {
					callback();
				},
			);

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			const values = {
				id: 'unit-1',
				name: 'Updated Unit',
				locationId: 'location-1',
				capacity: 15,
			};

			await act(async () => {
				await result.current.handleUpdateSubmit(values);
			});

			expect(mockRefetch).toHaveBeenCalled();
			expect(mockSetUpdateDialogOpen).toHaveBeenCalledWith(false);
		});
	});

	describe('handlePlantCreateSubmit', () => {
		it('should transform and call handleCreate with values', async () => {
			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			const plantedDate = new Date('2024-01-15');
			const values = {
				growingUnitId: 'unit-1',
				name: 'Test Plant',
				species: 'Tomato',
				plantedDate,
				notes: 'Test notes',
				status: 'PLANTED',
			};

			await act(async () => {
				await result.current.handlePlantCreateSubmit(values);
			});

			expect(mockHandlePlantCreate).toHaveBeenCalledWith(
				{
					growingUnitId: 'unit-1',
					name: 'Test Plant',
					species: 'Tomato',
					plantedDate: plantedDate.toISOString(),
					notes: 'Test notes',
					status: 'PLANTED',
				},
				expect.any(Function),
			);
		});

		it('should handle null plantedDate', async () => {
			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			const values = {
				growingUnitId: 'unit-1',
				name: 'Test Plant',
				species: 'Tomato',
				plantedDate: null,
				notes: 'Test notes',
				status: 'PLANTED',
			};

			await act(async () => {
				await result.current.handlePlantCreateSubmit(values);
			});

			expect(mockHandlePlantCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					plantedDate: null,
				}),
				expect.any(Function),
			);
		});

		it('should call refetch and close dialog after successful creation', async () => {
			mockHandlePlantCreate.mockImplementation(
				async (_values: any, callback: () => void) => {
					callback();
				},
			);

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			const values = {
				growingUnitId: 'unit-1',
				name: 'Test Plant',
				species: 'Tomato',
				plantedDate: new Date(),
				notes: 'Test notes',
				status: 'PLANTED',
			};

			await act(async () => {
				await result.current.handlePlantCreateSubmit(values);
			});

			expect(mockRefetch).toHaveBeenCalled();
			expect(mockSetCreatePlantDialogOpen).toHaveBeenCalledWith(false);
		});
	});

	describe('handleAddPlant', () => {
		it('should open create plant dialog', () => {
			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			act(() => {
				result.current.handleAddPlant();
			});

			expect(mockSetCreatePlantDialogOpen).toHaveBeenCalledWith(true);
		});
	});

	describe('handleEditUnit', () => {
		it('should open update dialog', () => {
			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			act(() => {
				result.current.handleEditUnit();
			});

			expect(mockSetUpdateDialogOpen).toHaveBeenCalledWith(true);
		});
	});

	describe('Loading and error states', () => {
		it('should expose loading state', () => {
			(useGrowingUnitFindById as jest.Mock).mockReturnValue({
				growingUnit: null,
				isLoading: true,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.isLoading).toBe(true);
		});

		it('should expose error state', () => {
			const mockError = new Error('Failed to load');
			(useGrowingUnitFindById as jest.Mock).mockReturnValue({
				growingUnit: null,
				isLoading: false,
				error: mockError,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.error).toBe(mockError);
		});

		it('should expose update loading state', () => {
			(useGrowingUnitUpdate as jest.Mock).mockReturnValue({
				handleUpdate: mockHandleUpdate,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.isUpdating).toBe(true);
		});

		it('should expose plant creation loading state', () => {
			(usePlantAdd as jest.Mock).mockReturnValue({
				handleCreate: mockHandlePlantCreate,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.isCreatingPlant).toBe(true);
		});
	});

	describe('Dialog state management', () => {
		it('should expose update dialog open state', () => {
			(useGrowingUnitDetailPageStore as jest.Mock).mockReturnValue({
				updateDialogOpen: true,
				setUpdateDialogOpen: mockSetUpdateDialogOpen,
				createPlantDialogOpen: false,
				setCreatePlantDialogOpen: mockSetCreatePlantDialogOpen,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.updateDialogOpen).toBe(true);
		});

		it('should expose create plant dialog open state', () => {
			(useGrowingUnitDetailPageStore as jest.Mock).mockReturnValue({
				updateDialogOpen: false,
				setUpdateDialogOpen: mockSetUpdateDialogOpen,
				createPlantDialogOpen: true,
				setCreatePlantDialogOpen: mockSetCreatePlantDialogOpen,
			});

			const { result } = renderHook(() => useGrowingUnitDetailPage('unit-1'));

			expect(result.current.createPlantDialogOpen).toBe(true);
		});
	});
});
